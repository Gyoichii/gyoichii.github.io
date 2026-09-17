import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve("out");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};
http
  .createServer((request, response) => {
    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
    } catch {
      response.writeHead(400).end();
      return;
    }
    let file = path.resolve(root, "." + pathname);
    if (file !== root && !file.startsWith(root + path.sep)) {
      response.writeHead(403).end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory())
      file = path.join(file, "index.html");
    let status = 200;
    if (!fs.existsSync(file)) {
      file = path.join(root, "404.html");
      status = 404;
    }
    if (!fs.existsSync(file)) {
      response.writeHead(404).end("Run npm run build first.");
      return;
    }
    const stat = fs.statSync(file);
    const headers = {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Accept-Ranges": "bytes",
    };
    const range = request.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]),
        end = range[2]
          ? Math.min(Number(range[2]), stat.size - 1)
          : stat.size - 1;
      if (start > end || start >= stat.size) {
        response
          .writeHead(416, { "Content-Range": `bytes */${stat.size}` })
          .end();
        return;
      }
      response.writeHead(206, {
        ...headers,
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Content-Length": end - start + 1,
      });
      if (request.method === "HEAD") response.end();
      else fs.createReadStream(file, { start, end }).pipe(response);
      return;
    }
    response.writeHead(status, { ...headers, "Content-Length": stat.size });
    if (request.method === "HEAD") response.end();
    else fs.createReadStream(file).pipe(response);
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Production preview: http://127.0.0.1:${port}`),
  );
