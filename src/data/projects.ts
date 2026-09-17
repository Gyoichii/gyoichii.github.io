export type System = {
  id: string;
  label: string;
  headline: string;
  summary: string;
  detail: string;
  tags: string[];
  media: string[];
  diagram?: "combat" | "sweep" | "occlusion" | "pcg" | "auth";
};
export type Project = {
  slug: string;
  number: string;
  title: string;
  category: string;
  period: string;
  role: string;
  team: string;
  intro: string;
  deck: string;
  tags: string[];
  hero: string;
  systems: System[];
};
export const rivering: Project = {
  slug: "rivering",
  number: "01",
  title: "Project Rivering",
  category: "Gameplay systems / Procedural worlds",
  period: "Apr 2026 — Present",
  role: "Independent developer",
  team: "Personal project",
  intro: "An action game, built from the systems up.",
  deck: "Custom combat, deliberate character movement, and a procedural urban world. An ongoing Unreal Engine 5 project where gameplay engineering meets the tools that make a place feel built.",
  tags: [
    "C++",
    "Unreal Engine 5",
    "GAS",
    "Mover / GASP",
    "PCG",
    "Python / Blender",
  ],
  hero: "rivering/hero",
  systems: [
    {
      id: "combat-interaction",
      label: "Combat interaction",
      headline: "Every action has a place.",
      summary:
        "Attacks, blocks, dashes and targeting share a combat state and input policy. The same decisions govern what can start, what can be buffered, and when movement or facing input is accepted.",
      detail:
        "Enhanced Input commands enter server-side combat handlers. The combat component tracks active actions, block phases and hit-reaction state, while GAS attributes and effects support stamina spending and recovery. Blocking retains grounded movement input; dashes lock facing; attack phases can accept facing intent while suppressing ordinary translation. This is a source-level architecture description, not a multiplayer performance claim.",
      tags: ["Action arbitration", "GAS attributes", "Input policy"],
      media: ["rivering/combat-interaction"],
      diagram: "combat",
    },
    {
      id: "skill-vfx",
      label: "Skills & VFX",
      headline: "Timing makes an effect belong.",
      summary:
        "Animation notify windows drive the Spin 360 trail lifecycle. Impact feedback consumes resolved contact direction and result data to orient Niagara effects around the interaction.",
      detail:
        "A dedicated notify state calls begin, update and end on the combat component. Impact presentation binds values such as impact normal and weapon-sweep direction into Niagara. These are implemented integration paths; this page does not claim that every effect asset or the experimental bloodline work has finished visual validation.",
      tags: ["Niagara", "Animation notifies", "Impact feedback"],
      media: ["rivering/skill-vfx"],
    },
    {
      id: "gasp-block",
      label: "GASP block",
      headline: "Hold your ground. Keep moving.",
      summary:
        "Blocking is a combat state with its own movement and orientation policy. The GASP / Mover character can retain grounded locomotion while ordinary movement-driven facing intent is suppressed.",
      detail:
        "Combat state distinguishes block entry, loop and ending. The walking integration consumes an overridden desired facing and applies a bounded yaw response for blocking. Animation, actor orientation and Control Rotation are inspected separately, so a visually plausible pose is not mistaken for proof that all three are aligned. The dedicated recording slot is reserved for the current character in motion.",
      tags: ["GASP", "Mover", "Block state"],
      media: ["rivering/gasp-block"],
    },
    {
      id: "melee-sweep",
      label: "Melee sweep / contact",
      headline: "The space between two poses matters.",
      summary:
        "Animation-timed attack windows query the path between weapon poses. Candidate contacts are validated before gameplay resolution, and accepted targets are tracked within the attack window to avoid repeated processing across frames.",
      detail:
        "The current source integrates a weapon-sweep subsystem and validates contact actor, component, body information, point, normal and attack direction. Invalid or volume-only evidence is not promoted to a usable surface contact. Pose history and contact validation are implementation facts; the newest sweep changes still need their final linked-build and in-game acceptance. Experimental trauma and bloodline work is outside this case study’s completed scope.",
      tags: ["Pose history", "Swept collision", "Contact validation"],
      media: ["rivering/melee-sweep"],
      diagram: "sweep",
    },
    {
      id: "cr-facing",
      label: "CR facing / character orientation",
      headline: "Intent, body, and motion.",
      summary:
        "Control Rotation supplies a facing target; the actor and animation root each have their own orientation. Facing policies decide whether player intent is accepted, ignored or locked during an action.",
      detail:
        "The pawn records movement-derived desired yaw and exposes explicit lock and clear operations. Turning diagnostics compare Control Rotation, actor yaw, animation-root yaw and the walking mode’s overridden target. Here “CR” means Control Rotation. It is an orientation-control study, not a claim of completed procedural weapon aiming or a particular Control Rig implementation.",
      tags: ["Control Rotation", "Facing intent", "Motion diagnostics"],
      media: ["rivering/cr-facing"],
    },
    {
      id: "material-sphere",
      label: "Material work",
      headline: "Surfaces with a controllable history.",
      summary:
        "Material studies explore intact and weathered surfaces, height-driven layer boundaries, and aged glass. Dirt, rain streaks, tint and surface response have separate controls so a look can be tuned deliberately.",
      detail:
        "The project includes an A/B wall-surface blend with optional height-based coverage, and a Substrate glass-aging material with separate dust, rain-streak, mud and transmission controls. Material instances and project tooling are present. This is authored material work and integration; it is not a runtime weather simulation. The material-sphere slot is ready for a current turntable.",
      tags: ["Substrate", "Material instances", "Surface blending"],
      media: ["rivering/material-sphere"],
    },
    {
      id: "occlusion",
      label: "Camera & occlusion",
      headline: "Reveal the player. Keep the world solid.",
      summary:
        "Camera-to-character geometry queries decide when walls and roofs need a visibility window. Material clipping reveals the character while retaining the original collision geometry used for obstruction checks.",
      detail:
        "The component samples a bounded silhouette across the character capsule and traces against the original structure. Separate classification handles walls, roofs, props and exclusions. Because material clipping does not remove the collision body used by the query, revealing an obstruction does not immediately make the visibility test lose that obstruction. Generated buildings also have an explicit PCG-to-occlusion lifecycle binding.",
      tags: ["Geometry queries", "Material clipping", "Collision preserved"],
      media: ["rivering/occlusion"],
      diagram: "occlusion",
    },
    {
      id: "pcg-urban-village",
      label: "PCG urban village",
      headline: "A building is more than a façade.",
      summary:
        "Python / Blender tools generate a modular construction kit. A native Unreal PCG element turns building controls into layout and mesh output, connecting rooms, circulation, windows, floors and rooftop structure.",
      detail:
        "The current C++ plugin exposes width and depth, floor count, entrance and stair choices, a seed, window options and weighted material patterns. Fixed modules and adaptable infill play different roles. PCG owns generated components, while a binding component connects completed output to building visibility and releases that binding on cleanup. Current source has advanced beyond the early Blender-only prototype; final circulation and visual issues are still being refined.",
      tags: [
        "Native PCG element",
        "Deterministic generation",
        "Modular tooling",
      ],
      media: [
        "rivering/pcg-urban-village",
        "rivering/building-study",
        "rivering/module-kit",
        "rivering/pcg-variants",
        "rivering/pcg-graph",
      ],
      diagram: "pcg",
    },
  ],
};
export const friday: Project = {
  slug: "friday-night",
  number: "02",
  title: "Friday Night",
  category: "Backend / Web application",
  period: "Jun 2026",
  role: "Developer",
  team: "Web application",
  intro: "From “what should we watch?” to a shared plan.",
  deck: "A collaborative movie-discovery and planning application with persistent groups, recommendations and voting. The engineering runs through the interface: authentication, group-scoped permissions, and the shared state behind a movie night.",
  tags: ["Python", "FastAPI", "SQLAlchemy", "SQLite", "TMDB"],
  hero: "friday-night/desktop",
  systems: [
    {
      id: "shared-workflow",
      label: "Product & persistence",
      headline: "One group. A shared movie night.",
      summary:
        "Users join groups by code or a configured approval flow, recommend films, vote, and discuss them. SQLAlchemy models preserve membership, movie state, comments and notification preferences in SQLite.",
      detail:
        "Group membership is unique per user and group. Votes are unique per user, movie and vote date. Movie records distinguish active, watched and deleted states, with separate restoration and archive actions. Movie queries filter by the selected group, so shared state belongs to the group that created it.",
      tags: ["Relational models", "Group workflow", "Persistent state"],
      media: [
        "friday-night/desktop",
        "friday-night/mobile",
        "friday-night/group-workflow",
      ],
    },
    {
      id: "access-control",
      label: "Authentication & permissions",
      headline: "A group boundary is a real boundary.",
      summary:
        "A valid login is only the first check. Each operation resolves the current group, verifies membership and checks the resource and role before changing state. Being an admin in one group grants no authority over another.",
      detail:
        "Time-limited signed cookies establish identity. Passwords use salted PBKDF2-SHA256 hashes with constant-time comparison. Role checks distinguish owner, admin and member; movie and comment handlers enforce group ownership. Removed members cannot keep posting with a stale group cookie. The request path checks CSRF tokens for state-changing methods.",
      tags: ["Signed cookies", "Role-based access", "CSRF protection"],
      media: [],
      diagram: "auth",
    },
    {
      id: "movie-data",
      label: "External data & discovery",
      headline: "Movie data, connected to a local workflow.",
      summary:
        "An asynchronous TMDB client supplies movie search, details and poster metadata. Selected films become local records that the group can recommend, vote on, archive and discuss.",
      detail:
        "The client uses bounded HTTP timeouts and handles upstream failures. API credentials are read from the environment. Search and metadata completion connect to the group’s existing movie records; identity checks look for duplicate active or archived films within that group. The group workflow remains distinct from the external catalogue.",
      tags: ["TMDB API", "Async HTTP", "Movie identity"],
      media: [],
    },
    {
      id: "security-tests",
      label: "Security & delivery",
      headline: "Test what a user must not be able to do.",
      summary:
        "Focused tests exercise missing and invalid CSRF tokens, guessed movie IDs, stale membership cookies, and permissions across group boundaries. The public application is served over HTTPS.",
      detail:
        "The current test source includes cross-group trash operations, member-only restrictions, owner-role protection and login-failure throttling. Production configuration rejects a missing or development signing key and requires secure cookies. Nginx in front of Uvicorn is the documented deployment setup; only the public HTTPS endpoint was inspected here, not the live server configuration. Test presence and assertions were reviewed, not re-executed for this portfolio.",
      tags: ["Permission-boundary tests", "Production configuration", "HTTPS"],
      media: [],
    },
  ],
};
export const wayjia: Project = {
  slug: "wayjia",
  number: "03",
  title: "WayJia",
  category: "Game programming / Small-team production",
  period: "Sep — Dec 2025",
  role: "Sole programmer & producer",
  team: "Three-person core team",
  intro: "A little spacecraft. A long way home.",
  deck: "A poetic zero-gravity journey through light, memory and unfamiliar space. I programmed the game and coordinated production for a three-person core team, taking its systems from spacecraft control through the ending.",
  tags: ["GML", "GameMaker Studio", "GLSL ES"],
  hero: "wayjia/hero",
  systems: [
    {
      id: "flight",
      label: "Physics & exploration",
      headline: "Let momentum tell the story.",
      summary:
        "Force-driven thrust, torque and inertial movement give the spacecraft its character. Radar reveals targets; resonance interactions activate stars and advance the journey.",
      detail:
        "The player controller applies mass-scaled forces and torque, limits linear and angular speed, and decays motion after input. A radar cooldown gates scan creation. Nearby-star interaction accumulates a hold duration, marks the star as activated and updates shared progression. Region-specific code adds underwater behavior, black-hole attraction and white-hole transitions.",
      tags: ["Forces & torque", "Radar", "Resonance"],
      media: ["wayjia/hero", "wayjia/exploration"],
    },
    {
      id: "rendering",
      label: "Rendering & shader adaptation",
      headline: "An atmosphere, integrated into play.",
      summary:
        "Reference and Shadertoy-origin shader work was ported and adapted for GameMaker’s GLSL ES pipeline. Runtime parameter binding, camera-aligned rendering and off-screen surfaces connect those effects to the game.",
      detail:
        "The background objects manage render surfaces and bind camera, resolution and time parameters for shader passes. GameMaker-specific integration and visual tuning are my work; the originating shader algorithms are not claimed as original inventions. Teammates and collaborators contributed art, writing, voices and music.",
      tags: ["GLSL ES adaptation", "Render surfaces", "Camera alignment"],
      media: [],
    },
    {
      id: "delivery",
      label: "Complete game delivery",
      headline: "All the way to the credits.",
      summary:
        "Beyond movement and visual effects, I implemented the connective tissue of a finished game: region progression, dialogue, voice playback, cutscenes, menus and the ending.",
      detail:
        "The final local project contains the room flow, narrative controllers, audio playback and end-state objects. As producer, I coordinated the technical work with the team’s art and narrative. The final-game credits below preserve the wider contributors’ authorship.",
      tags: ["Game flow", "Dialogue & audio", "Production"],
      media: ["wayjia/credits", "wayjia/gameplay"],
    },
  ],
};
export const projects = [rivering, friday, wayjia];
