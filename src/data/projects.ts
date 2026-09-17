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
  cardSummary: string;
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
  intro: "An Unreal Engine 5 action game.",
  cardSummary:
    "C++ combat systems, GASP / Mover integration, and procedural building generation.",
  deck: "An independent project combining C++ combat systems, GASP / Mover integration, and native PCG building generation. Python / Blender tools produce the modular environment assets.",
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
      headline: "Combat state & action arbitration",
      summary:
        "Attacks, blocks, dashes and targeting share a combat state and input policy. The same decisions govern what can start, what can be buffered, and when movement or facing input is accepted.",
      detail:
        "Enhanced Input commands enter server-side combat handlers. The combat component tracks active actions, block phases, and hit-reaction state; GAS attributes and effects handle stamina spending and recovery. Blocking retains grounded movement input. Dashes lock facing. Attack phases can accept facing intent while suppressing ordinary translation.",
      tags: ["Action arbitration", "GAS attributes", "Input policy"],
      media: ["rivering/combat-interaction"],
      diagram: "combat",
    },
    {
      id: "skill-vfx",
      label: "Skills & VFX",
      headline: "Animation-driven skills & effects",
      summary:
        "Animation notify windows drive the Spin 360 trail lifecycle. Impact feedback consumes resolved contact direction and result data to orient Niagara effects around the interaction.",
      detail:
        "A dedicated notify state starts, updates, and ends the trail through the combat component. Impact presentation passes the contact normal and weapon-sweep direction to Niagara. These hooks control effect timing and orientation; visual tuning is ongoing.",
      tags: ["Niagara", "Animation notifies", "Impact feedback"],
      media: ["rivering/skill-vfx"],
    },
    {
      id: "gasp-block",
      label: "GASP block",
      headline: "Blocking integrated with GASP / Mover",
      summary:
        "Blocking is a combat state with its own movement and orientation policy. The GASP / Mover character can retain grounded locomotion while ordinary movement-driven facing intent is suppressed.",
      detail:
        "GASP / Mover supplies the underlying locomotion and character-facing system. Rivering integrates block entry, loop and ending with that existing path, selecting movement and facing policies for combat. The walking integration consumes a desired facing and applies a bounded yaw response during blocking. The contribution shown here is combat-state integration with GASP / Mover.",
      tags: ["GASP", "Mover", "Block state"],
      media: ["rivering/gasp-block"],
    },
    {
      id: "melee-sweep",
      label: "Melee sweep / contact",
      headline: "Continuous melee contact",
      summary:
        "Animation-timed attack windows query the path between weapon poses. Candidate contacts are validated before gameplay resolution, and accepted targets are tracked within the attack window to avoid repeated processing across frames.",
      detail:
        "The weapon-sweep subsystem validates the actor, component, body, contact point, normal, and attack direction. Invalid or volume-only results are rejected. Accepted targets are tracked within each attack window. The latest sweep revision still requires linked-build and in-game validation.",
      tags: ["Pose history", "Swept collision", "Contact validation"],
      media: ["rivering/melee-sweep"],
      diagram: "sweep",
    },
    {
      id: "cr-facing",
      label: "Vertical aiming / Control Rig",
      headline: "Control Rig & vertical aiming",
      summary:
        "Control Rig adds up-and-down aim correction to the animated pose. Character facing follows the existing GASP / Mover orientation system; Rivering connects the aiming layer to target data and combat state.",
      detail:
        "The dedicated melee Control Rig consumes a target offset relative to the character root and adds bounded corrections to the authored animation. Body-part settings control the correction range and weight. Rivering supplies combat state and target data; the base character-facing path remains in GASP / Mover.",
      tags: ["Control Rig", "Vertical aiming", "Animation integration"],
      media: ["rivering/cr-facing"],
    },
    {
      id: "material-sphere",
      label: "Material work",
      headline: "Parameterized material studies",
      summary:
        "Wall materials blend intact and weathered surfaces with height-driven boundaries. Glass instances expose separate controls for dirt, rain streaks, tint, and surface response.",
      detail:
        "An A/B wall-surface blend supports optional height-based coverage. A Substrate glass material separates dust, rain streaks, mud, and transmission parameters. Material instances expose these controls for look development.",
      tags: ["Substrate", "Material instances", "Surface blending"],
      media: [
        "rivering/material-sphere",
        "rivering/glass-transmission",
        "rivering/glass-variants",
        "rivering/wall-weathering",
        "rivering/material-instance-controls",
      ],
    },
    {
      id: "occlusion",
      label: "Camera & occlusion",
      headline: "Geometry-preserving occlusion",
      summary:
        "Camera-to-character geometry queries decide when walls and roofs need a visibility window. Material clipping reveals the character while retaining the original collision geometry used for obstruction checks.",
      detail:
        "The component samples a bounded silhouette across the character capsule and traces against the original structure. Separate classification handles walls, roofs, props and exclusions. Because material clipping does not remove the collision body used by the query, revealing an obstruction does not immediately make the visibility test lose that obstruction. Generated buildings also have an explicit PCG-to-occlusion lifecycle binding.",
      tags: ["Geometry queries", "Material clipping", "Collision preserved"],
      media: ["rivering/occlusion-walkthrough", "rivering/occlusion"],
      diagram: "occlusion",
    },
    {
      id: "pcg-urban-village",
      label: "PCG urban village",
      headline: "Procedural building generation",
      summary:
        "Python / Blender tools generate a modular construction kit. A native Unreal PCG element turns building controls into layout and mesh output, connecting rooms, circulation, windows, floors and rooftop structure.",
      detail:
        "The C++ plugin exposes width, depth, floor count, entrances, stairs, seed, window options, and weighted material patterns. Layout combines fixed modules with adaptable infill. PCG owns the generated components; a binding component registers completed output with building visibility and releases it during cleanup. Circulation and visual refinement are ongoing.",
      tags: [
        "Native PCG element",
        "Deterministic generation",
        "Modular tooling",
      ],
      media: [
        "rivering/pcg-urban-village",
        "rivering/pcg-dimensions",
        "rivering/pcg-variants",
        "rivering/building-study",
        "rivering/module-kit",
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
  intro: "Movie discovery and planning for groups.",
  cardSummary:
    "A FastAPI application with shared movie lists, voting, and group-based permissions.",
  deck: "A Python / FastAPI web application for movie recommendations, voting, and discussion. SQLAlchemy and SQLite store group membership and movie activity; signed-cookie authentication and resource-level checks control access.",
  tags: ["Python", "FastAPI", "SQLAlchemy", "SQLite", "TMDB"],
  hero: "friday-night/group-workflow",
  systems: [
    {
      id: "shared-workflow",
      label: "Product & persistence",
      headline: "Shared movie lists & persistent state",
      summary:
        "Users join groups by code or a configured approval flow, recommend films, vote, and discuss them. SQLAlchemy models preserve membership, movie state, comments and notification preferences in SQLite.",
      detail:
        "Group membership is unique per user and group. Votes are unique per user, movie and vote date. Movie records distinguish active, watched and deleted states, with separate restoration and archive actions. Movie queries filter by the selected group, so shared state belongs to the group that created it.",
      tags: ["Relational models", "Group workflow", "Persistent state"],
      media: ["friday-night/movie-detail", "friday-night/notifications"],
    },
    {
      id: "access-control",
      label: "Authentication & permissions",
      headline: "Authentication & group-level authorization",
      summary:
        "Each operation resolves the current group, verifies membership, and checks the resource and role before changing state. Owner, admin, and member permissions apply within their own group.",
      detail:
        "Time-limited signed cookies establish identity. Passwords use salted PBKDF2-SHA256 hashes with constant-time comparison. Role checks distinguish owner, admin and member; movie and comment handlers enforce group ownership. Removed members cannot keep posting with a stale group cookie. The request path checks CSRF tokens for state-changing methods.",
      tags: ["Signed cookies", "Role-based access", "CSRF protection"],
      media: ["friday-night/group-settings", "friday-night/group-selection"],
      diagram: "auth",
    },
    {
      id: "movie-data",
      label: "External data & discovery",
      headline: "TMDB search & metadata import",
      summary:
        "An asynchronous TMDB client supplies movie search, details and poster metadata. Selected films become local records that the group can recommend, vote on, archive and discuss.",
      detail:
        "The client uses bounded HTTP timeouts and handles upstream failures. API credentials are read from the environment. Search and metadata completion connect to the group’s existing movie records; identity checks look for duplicate active or archived films within that group. The group workflow remains distinct from the external catalogue.",
      tags: ["TMDB API", "Async HTTP", "Movie identity"],
      media: ["friday-night/movie-search"],
    },
    {
      id: "security-tests",
      label: "Security & delivery",
      headline: "Permission-boundary tests & deployment",
      summary:
        "Focused tests exercise missing and invalid CSRF tokens, guessed movie IDs, stale membership cookies, and permissions across group boundaries. The public application is served over HTTPS.",
      detail:
        "The current test source includes cross-group trash operations, member-only restrictions, owner-role protection and login-failure throttling. Production configuration rejects a missing or development signing key and requires secure cookies. Nginx in front of Uvicorn is the documented deployment setup; only the public HTTPS endpoint was inspected here, not the live server configuration. Test presence and assertions were reviewed, not re-executed for this portfolio.",
      tags: ["Permission-boundary tests", "Production configuration", "HTTPS"],
      media: ["friday-night/desktop", "friday-night/mobile"],
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
  cardSummary:
    "Sole programmer and producer of a three-person space-exploration game.",
  deck: "A poetic zero-gravity journey through light, memory and unfamiliar space. I programmed the game and coordinated production for a three-person core team, taking its systems from spacecraft control through the ending.",
  tags: ["GML", "GameMaker Studio", "GLSL ES"],
  hero: "wayjia/hero",
  systems: [
    {
      id: "flight",
      label: "Physics & exploration",
      headline: "Spacecraft physics & exploration",
      summary:
        "Force-driven thrust, torque and inertial movement give the spacecraft its character. Radar reveals targets; resonance interactions activate stars and advance the journey.",
      detail:
        "The player controller applies mass-scaled forces and torque, limits linear and angular speed, and decays motion after input. A radar cooldown gates scan creation. Nearby-star interaction accumulates a hold duration, marks the star as activated and updates shared progression. Region-specific code adds underwater behavior, black-hole attraction and white-hole transitions.",
      tags: ["Forces & torque", "Radar", "Resonance"],
      media: ["wayjia/gameplay", "wayjia/hero", "wayjia/exploration"],
    },
    {
      id: "rendering",
      label: "Rendering & shader adaptation",
      headline: "Shader adaptation & rendering",
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
        "I implemented region progression, dialogue, voice playback, cutscenes, menus, and the ending, alongside the spacecraft controller and visual effects.",
      detail:
        "The final local project contains the room flow, narrative controllers, audio playback and end-state objects. As producer, I coordinated the technical work with the team’s art and narrative. The final-game credits below preserve the wider contributors’ authorship.",
      tags: ["Game flow", "Dialogue & audio", "Production"],
      media: ["wayjia/credits"],
    },
  ],
};
export const projects = [rivering, friday, wayjia];
