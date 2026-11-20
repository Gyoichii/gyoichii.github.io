package love.fridaynight;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.sql.Types;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class SQLiteImporter implements ApplicationRunner {

  // Foreign-key order.
  static final List<String> TABLES =
      List.of(
          "genres",
          "users",
          "groups",
          "notification_preferences",
          "watch_appearances",
          "group_bans",
          "group_join_requests",
          "group_members",
          "movies",
          "watch_rooms",
          "comments",
          "movie_genres",
          "movie_ratings",
          "playground_screens",
          "wants",
          "watch_peers",
          "notifications");

  private static final int INSERT_BATCH_SIZE = 500;

  private final DataSource target;
  private final ObjectMapper json;
  private final String sourcePath;

  public SQLiteImporter(
      DataSource target, ObjectMapper json, @Value("${app.import-sqlite:}") String sourcePath) {
    this.target = target;
    this.json = json;
    this.sourcePath = sourcePath;
  }

  @Override
  public void run(ApplicationArguments args) throws Exception {
    if (sourcePath.isBlank()) return;
    Map<String, Object> report = importFile(Path.of(sourcePath));
    System.out.println(json.writerWithDefaultPrettyPrinter().writeValueAsString(report));
  }

  public Map<String, Object> importFile(Path input) throws Exception {
    Path path = input.toAbsolutePath().normalize().toRealPath();
    if (!Files.isRegularFile(path))
      throw new IllegalArgumentException("SQLite source must be a regular file");
    Path wal = Path.of(path + "-wal");
    byte[] dbBefore = digestFile(path);
    byte[] walBefore = digestFile(wal);

    Class.forName("org.sqlite.JDBC");
    String url = "jdbc:sqlite:" + path.toUri().toASCIIString() + "?mode=ro";
    try (Connection source = DriverManager.getConnection(url);
        Connection dest = target.getConnection()) {
      try (var st = source.createStatement()) {
        st.execute("PRAGMA query_only=ON");
      }
      source.setAutoCommit(false);
      dest.setAutoCommit(false);
      try {
        requireControlServiceStopped(dest);
        Set<String> sourceTables = readSourceTables(source);
        lockEmptyDestination(dest);
        createGenreStaging(dest);
        String stagingSchema = tempSchemaName(dest);

        List<Row> tables = new ArrayList<>();
        for (String table : TABLES) {
          tables.add(
              sourceTables.contains(table)
                  ? copyTable(source, dest, table, stagingSchema)
                  : Row.of("table", table, "rows", 0, "source_table", "absent"));
        }

        // Don't commit a stale SQLite snapshot.
        if (!MessageDigest.isEqual(dbBefore, digestFile(path))
            || !MessageDigest.isEqual(walBefore, digestFile(wal)))
          throw new IllegalStateException(
              "SQLite changed during import. Stop its writer and retry; destination rolled back.");

        projectGenresOntoFilms(dest);
        dest.commit();
        source.rollback();
        return Row.of(
            "source", path.toString(),
            "source_sha256", HexFormat.of().formatHex(dbBefore),
            "source_unchanged", true,
            "transaction_committed", true,
            "tables", tables);
      } catch (Exception e) {
        dest.rollback();
        throw e;
      }
    }
  }

  private static void requireControlServiceStopped(Connection dest) throws SQLException {
    try (var lock = dest.prepareStatement("SELECT pg_try_advisory_xact_lock(?)")) {
      lock.setLong(1, ControlLease.KEY);
      try (var rs = lock.executeQuery()) {
        rs.next();
        if (!rs.getBoolean(1))
          throw new IllegalStateException("Stop the Java control service before importing.");
      }
    }
  }

  private static Set<String> readSourceTables(Connection source) throws SQLException {
    Set<String> tables = new HashSet<>();
    try (var st = source.createStatement();
        var rs = st.executeQuery("SELECT name FROM sqlite_master WHERE type='table'")) {
      while (rs.next()) tables.add(rs.getString(1));
    }
    if (!tables.containsAll(List.of("users", "groups", "movies")))
      throw new IllegalArgumentException("Source is not a current Friday Night database");

    Set<String> unknown = new HashSet<>(tables);
    unknown.removeAll(TABLES);
    unknown.removeIf(name -> name.startsWith("sqlite_"));
    if (!unknown.isEmpty()) throw new IllegalStateException("Unmapped source tables: " + unknown);
    return tables;
  }

  private static void lockEmptyDestination(Connection dest) throws SQLException {
    try (var st = dest.createStatement()) {
      st.execute("LOCK TABLE films IN ACCESS EXCLUSIVE MODE");
      try (var rs = st.executeQuery("SELECT 1 FROM films LIMIT 1")) {
        if (rs.next()) throw new IllegalStateException("Destination film catalog must be empty.");
      }
      for (String table : TABLES) {
        st.execute("LOCK TABLE " + identifier(lockTarget(table)) + " IN ACCESS EXCLUSIVE MODE");
        try (var rs = st.executeQuery("SELECT count(*) FROM " + identifier(table))) {
          rs.next();
          if (rs.getLong(1) != 0)
            throw new IllegalStateException(
                "Destination must be empty; table " + table + " contains data.");
        }
      }
    }
  }

  private static void createGenreStaging(Connection dest) throws SQLException {
    try (var st = dest.createStatement()) {
      st.execute(
          "CREATE TEMP TABLE movie_genres(movie_id integer, genre_id integer,"
              + " PRIMARY KEY(movie_id,genre_id)) ON COMMIT DROP");
    }
  }

  private static String tempSchemaName(Connection dest) throws SQLException {
    try (var st = dest.createStatement();
        var rs = st.executeQuery("SELECT pg_my_temp_schema()::regnamespace::text")) {
      rs.next();
      return rs.getString(1);
    }
  }

  // Lock film_genres. Stage movie_genres until the old entry IDs are verified.
  private static String lockTarget(String table) {
    return switch (table) {
      case "movies" -> "list_entries";
      case "movie_genres" -> "film_genres";
      default -> table;
    };
  }

  private static String insertTarget(String table) {
    return table.equals("movies") ? "list_entries" : table;
  }

  private static Row copyTable(Connection source, Connection dest, String table, String stagingSchema)
      throws Exception {
    Map<String, Integer> targetTypes = targetColumnTypes(dest, table);
    List<String> columns = sourceColumns(source, table);
    for (String column : columns)
      if (!targetTypes.containsKey(column))
        throw new IllegalStateException("Unmapped source column " + table + "." + column);
    int[] types = columns.stream().mapToInt(targetTypes::get).toArray();

    String physicalTable = insertTarget(table);
    String schema = table.equals("movie_genres") ? stagingSchema : "public";
    List<String> key = primaryKey(dest, schema, physicalTable);
    if (key.isEmpty())
      throw new IllegalStateException("Cannot verify " + table + ": no primary key on " + schema + "." + physicalTable);

    String names = joinIdentifiers(columns);
    String select =
        "SELECT " + names + " FROM " + identifier(table)
            + " ORDER BY " + joinIdentifiers(key);
    String insert =
        "INSERT INTO " + identifier(physicalTable) + "(" + names + ") VALUES("
            + String.join(",", Collections.nCopies(columns.size(), "?")) + ")";

    MessageDigest sourceDigest = MessageDigest.getInstance("SHA-256");
    long rows = 0;
    try (var read = source.createStatement();
        var rs = read.executeQuery(select);
        var write = dest.prepareStatement(insert)) {
      while (rs.next()) {
        for (int i = 0; i < types.length; i++) {
          Object value = convert(rs.getObject(i + 1), types[i]);
          hash(sourceDigest, value);
          if (value == null) write.setNull(i + 1, types[i]);
          else write.setObject(i + 1, value);
        }
        write.addBatch();
        rows++;
        if (rows % INSERT_BATCH_SIZE == 0) write.executeBatch();
      }
      write.executeBatch();
    }

    // A trigger can change what was inserted.
    MessageDigest copiedDigest = MessageDigest.getInstance("SHA-256");
    long copied = 0;
    try (var read = dest.createStatement();
        var rs = read.executeQuery(select)) {
      while (rs.next()) {
        for (int i = 0; i < types.length; i++)
          hash(copiedDigest, convert(rs.getObject(i + 1), types[i]));
        copied++;
      }
    }
    byte[] sourceHash = sourceDigest.digest();
    if (rows != copied || !MessageDigest.isEqual(sourceHash, copiedDigest.digest()))
      throw new IllegalStateException("Verification failed for " + table);

    Integer idType = targetTypes.get("id");
    if (key.equals(List.of("id")) && idType != null && (idType == Types.INTEGER || idType == Types.BIGINT))
      resetIdSequence(dest, physicalTable, table);

    return Row.of("table", table, "rows", rows, "sha256", HexFormat.of().formatHex(sourceHash));
  }

  private static Map<String, Integer> targetColumnTypes(Connection dest, String table)
      throws SQLException {
    Map<String, Integer> types = new LinkedHashMap<>();
    try (var rs = dest.getMetaData().getColumns(null, "public", table, null)) {
      while (rs.next()) types.put(rs.getString("COLUMN_NAME"), rs.getInt("DATA_TYPE"));
    }
    return types;
  }

  private static List<String> sourceColumns(Connection source, String table) throws SQLException {
    List<String> columns = new ArrayList<>();
    try (var st = source.createStatement();
        var rs = st.executeQuery("PRAGMA table_info(" + identifier(table) + ")")) {
      while (rs.next()) columns.add(rs.getString("name"));
    }
    return columns;
  }

  private static List<String> primaryKey(Connection dest, String schema, String table)
      throws SQLException {
    TreeMap<Short, String> bySeq = new TreeMap<>();
    try (var rs = dest.getMetaData().getPrimaryKeys(null, schema, table)) {
      while (rs.next()) bySeq.put(rs.getShort("KEY_SEQ"), rs.getString("COLUMN_NAME"));
    }
    return new ArrayList<>(bySeq.values());
  }

  private static void resetIdSequence(Connection dest, String physical, String table)
      throws SQLException {
    String t = identifier(table);
    try (var st = dest.createStatement()) {
      st.execute(
          "SELECT setval(pg_get_serial_sequence('" + physical + "','id'),"
              + "COALESCE((SELECT max(id) FROM " + t + "),1),"
              + "(SELECT count(*)>0 FROM " + t + "))");
    }
  }

  private static void projectGenresOntoFilms(Connection dest) throws SQLException {
    try (var st = dest.createStatement()) {
      st.execute(
          "INSERT INTO film_genres(film_id,genre_id) "
              + "SELECT DISTINCT (SELECT e.film_id FROM list_entries e WHERE e.id=mg.movie_id),"
              + "mg.genre_id FROM pg_temp.movie_genres mg");
      st.execute("SELECT consolidate_film_catalog()");
    }
  }

  static String identifier(String name) {
    if (!name.matches("[a-z_][a-z_0-9]*"))
      throw new IllegalArgumentException("Invalid database identifier");
    return '"' + name + '"';
  }

  private static String joinIdentifiers(List<String> names) {
    return names.stream().map(SQLiteImporter::identifier).collect(Collectors.joining(","));
  }

  static byte[] digestFile(Path path) throws Exception {
    if (!Files.exists(path)) return new byte[0];
    MessageDigest digest = MessageDigest.getInstance("SHA-256");
    try (var in = Files.newInputStream(path)) {
      byte[] buffer = new byte[65536];
      int n;
      while ((n = in.read(buffer)) >= 0) digest.update(buffer, 0, n);
    }
    return digest.digest();
  }

  static Object convert(Object value, int type) {
    if (value == null) return null;
    return switch (type) {
      case Types.BOOLEAN, Types.BIT -> {
        if (value instanceof Boolean b) yield b;
        if (value instanceof Number n) yield n.intValue() != 0;
        yield Boolean.parseBoolean(value.toString());
      }
      case Types.DATE -> {
        if (value instanceof java.sql.Date d) yield d.toLocalDate();
        if (value instanceof LocalDate) yield value;
        yield LocalDate.parse(value.toString());
      }
      case Types.TIMESTAMP -> {
        if (value instanceof Timestamp t) yield t.toLocalDateTime();
        if (value instanceof LocalDateTime) yield value;
        yield parseTime(value.toString());
      }
      case Types.INTEGER ->
          value instanceof Number n ? n.intValue() : Integer.parseInt(value.toString());
      case Types.BIGINT ->
          value instanceof Number n ? n.longValue() : Long.parseLong(value.toString());
      case Types.FLOAT, Types.DOUBLE, Types.REAL ->
          value instanceof Number n ? n.doubleValue() : Double.parseDouble(value.toString());
      default -> value;
    };
  }

  static LocalDateTime parseTime(String value) {
    String text = value.replace(' ', 'T');
    try {
      return LocalDateTime.parse(text);
    } catch (Exception e) {
      return OffsetDateTime.parse(text).withOffsetSameInstant(ZoneOffset.UTC).toLocalDateTime();
    }
  }

  // Lengths distinguish ("ab", "c") from ("a", "bc").
  static void hash(MessageDigest digest, Object value) {
    byte kind;
    byte[] bytes;
    if (value == null) {
      kind = 0;
      bytes = new byte[0];
    } else if (value instanceof byte[] b) {
      kind = 1;
      bytes = b;
    } else if (value instanceof Number n) {
      kind = 2;
      String number =
          Double.isFinite(n.doubleValue())
              ? new BigDecimal(n.toString()).stripTrailingZeros().toPlainString()
              : n.toString();
      bytes = number.getBytes(StandardCharsets.UTF_8);
    } else {
      kind = 3;
      bytes = value.toString().getBytes(StandardCharsets.UTF_8);
    }
    digest.update(kind);
    digest.update(ByteBuffer.allocate(4).putInt(bytes.length).array());
    digest.update(bytes);
  }
}
