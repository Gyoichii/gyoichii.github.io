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
    "An urban village, editable river valleys, procedural lightning and katana locomotion in Unreal Engine 5.",
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
      id: "pcg-urban-village",
      label: "Urban village",
      headline: "From a commercial street to a residential entrance",
      summary:
        "The street planner selects a commercial corridor across a frozen layout of 231 buildings. In a separate Unreal district, shops face the street while residents enter from the side or rear. All 57 tested entrances in that 23-building scene passed capsule and support checks.",
      detail:
        "The C++ plugin exposes width, depth, floor count, entrances, stairs, seed, window options, and weighted material patterns. Layout combines fixed modules with adaptable infill. PCG owns the generated components; a binding component registers completed output with building visibility and releases it during cleanup. Circulation and visual refinement are ongoing.",
      tags: [
        "Native PCG element",
        "Deterministic generation",
        "Modular tooling",
      ],
      media: [
        "rivering/commercial-plan",
        "rivering/hero",
        "rivering/pcg-urban-village",
        "rivering/pcg-dimensions",
        "rivering/pcg-variants",
        "rivering/building-study",
        "rivering/module-kit",
        "rivering/pcg-graph",
      ],
      diagram: "pcg",
    },
    {
      id: "terrain",
      label: "Terrain foundations",
      headline: "Shaping the low ground in Guilin",
      summary: "The base terrain defines the broad slopes and lowlands beneath a landscape. Three fixed seeds show how the same low-relief recipe reads across an 8.064 km region and at local scale.",
      detail: "The rows use seeds 185, 741 and 2026. Each pair compares the original 15% relief setting with 30% while holding the horizontal layout, lighting and camera fixed. The low-relief regional base and its surface treatment are authored separately. Individual karst peaks belong to a later stage.",
      tags: ["Terrain authoring", "Regional presets"],
      media: ["rivering/guilin-overview", "rivering/guilin-local"],
    },
    {
      id: "large-river",
      label: "Large River mode",
      headline: "Moving a bend changes the whole river valley",
      summary: "The editor starts above the full 4.608 km × 4.608 km terrain. A middle spline point moves 320 m sideways. The generator rebuilds the channel and the adjoining terrain, then the camera descends to the changed bank.",
      detail: "The saved procedural valley has 11 control points. A script moves one point through the editor spline API. The generator detects the edit and publishes revision 10 after revision 9. Its own timing for this run was 4.56 seconds. The film retains the wait at normal speed. Discharge is set to 2,500 cubic metres per second.",
      tags: ["Unreal Editor", "Spline authoring", "Water"],
      media: ["rivering/large-river", "rivering/river-bank"],
    },
    {
      id: "lightning",
      label: "Procedural lightning",
      headline: "One branching channel, several flashes",
      summary: "The seed fixes the shape of the discharge. Watch the main channel grow toward the ground while smaller branches split off, then compare the geometry study with the Niagara discharge.",
      detail: "One generated tree carries the segment geometry, growth times and branch intensities into Niagara. A shared schedule lets later flashes illuminate the same path. The test uses fixed start and end positions and a horizontal landing surface.",
      tags: ["Niagara", "C++", "Seeded generation"],
      media: ["rivering/lightning-growth", "rivering/lightning-pie"],
    },
    {
      id: "gasp-block",
      label: "Katana guard turns",
      headline: "Turning with the katana held in guard",
      summary:
        "The character raises a katana, stays in guard and changes facing. Motion Matching selects the turn while the support foot stays planted through the pivot. Guarding also supports grounded movement.",
      detail:
        "GASP / Mover supplies the underlying locomotion and character-facing system. Rivering integrates block entry, loop and ending with that existing path, selecting movement and facing policies for combat. The walking integration consumes a desired facing and applies a bounded yaw response during blocking. The contribution shown here is combat-state integration with GASP / Mover.",
      tags: ["GASP", "Mover", "Block state"],
      media: ["rivering/gasp-block"],
    },
    {
      id: "material-sphere",
      label: "Wall tiles & glass",
      headline: "Weathering a tiled facade",
      summary:
        "Wall materials blend intact and weathered surfaces with height-driven boundaries. Glass instances expose separate controls for dirt, rain streaks, tint, and surface response.",
      detail:
        "An A/B wall-surface blend supports optional height-based coverage. A Substrate glass material separates dust, rain streaks, mud, and transmission parameters. Material instances expose these controls for look development.",
      tags: ["Substrate", "Material instances", "Surface blending"],
      media: [
        "rivering/wall-weathering",
        "rivering/material-sphere",
        "rivering/glass-transmission",
        "rivering/glass-variants",
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
      id: "combat-interaction",
      label: "Combat interaction",
      headline: "Combat state & action arbitration",
      summary:
        "Attacks, blocks, dashes and targeting share a combat state and input policy. The same decisions govern what can start, what can be buffered, and when movement or facing input is accepted.",
      detail:
        "Enhanced Input commands enter server-side combat handlers. The combat component tracks active actions, block phases, and hit-reaction state; GAS attributes and effects handle stamina spending and recovery. Blocking retains grounded movement input. Dashes lock facing. Attack phases can accept facing intent while suppressing ordinary translation.",
      tags: ["Action arbitration", "GAS attributes", "Input policy"],
      media: ["rivering/combat-interaction", "rivering/combat-contact"],
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
  intro: "Choose a film and watch it together.",
  cardSummary:
    "Browse a shared DVD shelf, vote on films, and watch together in a virtual living room.",
  deck: "Groups keep a shared watchlist and meet in 3D rooms to watch their selection. Spring Boot and PostgreSQL handle groups, movie lists, and real-time rooms. A Python service resolves and relays video.",
  tags: ["Java", "Spring Boot", "PostgreSQL", "Python", "WebSocket", "TMDB"],
  hero: "friday-night/watch-together",
  systems: [
    {
      id: "choosing-a-film",
      label: "DVD shelf & screening room",
      headline: "Choosing a film",
      summary: "The same group watchlist has two browsing modes. The DVD shelf opens each title as a case. The screening room pairs a scrolling filmstrip with a projector preview.",
      detail: "The desktop layout keeps the projector and filmstrip side by side. On a narrow screen, the projector folds away so the list has room for posters and film details.",
      tags: ["Desktop", "Mobile"],
      media: ["friday-night/dvd-shelf", "friday-night/theater-desktop", "friday-night/theater-mobile"],
    },
    {
      id: "shared-spaces",
      label: "Shared spaces",
      headline: "Places to watch together",
      summary: "Group members can walk through a courtyard, take a seat in a cinema, or meet on the sofa in the living room. The living-room recording above shows two members watching the same TV.",
      detail: "Each participant controls an avatar. The room shares seat occupancy and playback state, while each browser decodes the film and displays it on the TV.",
      tags: ["Multiplayer", "Shared playback"],
      media: ["friday-night/courtyard", "friday-night/cinema"],
    },
    {
      id: "shared-workflow",
      label: "Product & persistence",
      headline: "Shared movie lists & persistent state",
      summary:
        "Users join groups by code or a configured approval flow, recommend films, vote, and discuss them. PostgreSQL stores membership, movie state, comments and notification preferences.",
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
        "The current test source includes cross-group trash operations, member-only restrictions, owner-role protection and login-failure throttling. Production configuration rejects a missing or development signing key and requires secure cookies. The application separates the Java web service from the Python media worker.",
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
export const avatar: Project = {
  slug: "avatar-review",
  number: "04",
  title: "Avatar Review",
  category: "Machine learning / Computer vision",
  period: "Fall 2026",
  role: "Model development & evaluation",
  team: "Offline study",
  intro: "What the avatar crop actually shows",
  cardSummary: "A four-category image review pipeline evaluated on the visible avatar crop.",
  deck: "A wide upload is cropped to a square before review. The study measures each category separately, then checks the final allow or block decision.",
  tags: ["Python", "Computer vision", "Offline evaluation"],
  hero: "avatar-review/examples",
  systems: [
    {
      id: "visible-crop",
      label: "Visible crop",
      headline: "From an upload to the displayed avatar",
      summary: "Compare the full upload with the square image the reviewer sees. These two original portfolio samples were prepared specifically for this demonstration.",
      detail: "The preprocessing path accounts for image orientation and transparency, scales to the review size, then takes the centered square. The same crop feeds the category checks.",
      tags: ["Image preprocessing", "Crop policy"],
      media: [],
    },
    {
      id: "four-checks",
      label: "Evaluation",
      headline: "Four checks, one decision",
      summary: "A photo can trigger more than one category. Of 140 images with a complete set of labels, 124 received the correct final decision.",
      detail: "Out of 82 images that should pass, 7 were blocked. Out of 58 images that should be blocked, 9 passed. Per-category denominators differ because ambiguous labels were omitted for that category.",
      tags: ["Independent labels", "Error analysis"],
      media: [],
    },
  ],
};
export const disaster: Project = {
  slug: "disaster-chatbot",
  number: "05",
  title: "Disaster Chatbot",
  category: "Software / Retrieval-augmented generation",
  period: "Fall 2026",
  role: "Chat and notification workflows",
  team: "Georgia Tech team project",
  intro: "Following a changing local alert",
  cardSummary: "Source-grounded answers and location subscriptions in a Django chat application.",
  deck: "A notice can be updated in one town and remain active in the next. The project connects time-stamped evidence, conversation history and confirmed location subscriptions.",
  tags: ["Django", "LangChain", "Notifications"],
  hero: "disaster-chatbot/interface",
  systems: [
    {
      id: "bulletins",
      label: "Source updates",
      headline: "Which bulletin applies to Eastbank?",
      summary: "Explore two successive exercise bulletins. Open each source to see the change in location and validity.",
      detail: "Retrieved documents carry source IDs, publication times, affected areas and validity windows. The answer stage receives the conversation and the relevant documents. The example reproduces a fictional project fixture.",
      tags: ["RAG", "Versioned evidence"],
      media: [],
    },
    {
      id: "subscriptions",
      label: "Subscriptions",
      headline: "From a saved location to a timeline update",
      summary: "A user confirms a location and its coverage. Matching published events then appear in the conversation timeline. Device notifications are an additional opt-in.",
      detail: "A shared area version signals new publications. Private location matching and timeline writes happen after the version changes. The chart records a single-machine simulation and distinguishes public checks from user-specific update latency.",
      tags: ["Location matching", "Event delivery"],
      media: ["disaster-chatbot/subscription", "disaster-chatbot/delivery"],
    },
  ],
};
export const projects = [rivering, friday, wayjia, avatar, disaster];
