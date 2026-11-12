export type System = {
  id: string;
  label: string;
  headline: string;
  summary: string;
  paragraphs?: string[];
  detail: string;
  tags: string[];
  media: string[];
  diagram?: "combat" | "sweep" | "occlusion" | "pcg" | "auth";
};
export type SystemGroup = {
  id: string;
  label: string;
  systems: System[];
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
  groups?: SystemGroup[];
  systems: System[];
};
const riveringGroups: SystemGroup[] = [
  {
    id: "world-generation",
    label: "Procedural environments",
    systems: [
      {
        id: "pcg-urban-village",
        label: "Urban village",
        headline: "Street layout and modular building generation",
        summary:
          "At street level the window cages and air conditioners hang out over a narrow alley. In the editor recording, adding a floor gives the pink building another row of windows and raises the roof. The windows need to keep their size as the envelope changes, and the alley below still has to be wide enough to walk through.",
        paragraphs: [
          "We build each floor from fixed-size modules and let infill pieces take up the remaining width. Shops open onto the commercial street, while residents enter from side or rear paths. We tested those paths against the generated geometry. At one building, low air conditioners and window cages blocked the route, so we adjusted those fittings. All 57 entry routes in the 23-building Unreal scene then cleared the character capsule and had floor support.",
        ],
        detail:
          "The plan shows a separate Python study that selects a commercial street in a fixed layout of 231 buildings. In Unreal, the native PCG element exposes footprint, floor count, entrances, stairs, windows, seed and material weights. It registers generated components with building visibility and releases them during cleanup.",
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
        headline: "Terrain foundations in western Sichuan, the Three Gorges and Guilin",
        summary: "The Three Gorges slopes have narrow grooves that run down their faces. The Guilin lowlands roll into broad, smooth hollows. Both landscapes fill the same 8.064 km square. The difference we wanted to control was the shape of the ground at that scale.",
        paragraphs: [
          "The Three Gorges recipe starts with winding valleys and erodes their banks. Guilin starts with broad hills and lowlands. To see what the recipes contribute, we rendered all nine presets with the same seed, grey material, lighting and camera. The western Sichuan studies show the range from ridge shoulders to valley floors. The final Guilin pairs isolate a smaller edit. Increasing relief from 15% to 30% deepens the folds while the hills stay in place.",
        ],
        detail: "The nine regional views use seed 185 and preserve each preset’s own elevation range. The separate Guilin relief experiment uses seeds 185, 741 and 2026, with regional and close views for each pair.",
        tags: ["Terrain authoring", "Regional presets"],
        media: [
          "rivering/terrain-chuanxi-mountains", "rivering/terrain-three-gorges", "rivering/terrain-rounded-hills",
          "rivering/terrain-chuanxi-plateau", "rivering/terrain-chuanxi-shoulders", "rivering/terrain-chuanxi-rock",
          "rivering/terrain-chuanxi-foothills", "rivering/terrain-chuanxi-valley", "rivering/terrain-gentle-lowland",
          "rivering/guilin-overview", "rivering/guilin-local",
        ],
      },
      {
        id: "large-river",
        label: "Large River mode",
        headline: "Spline-based river and bank generation",
        summary: "In the full-map recording, a green control point moves 320 m sideways. From that distance the edit looks like a small bend. Down at the shoreline it changes where the water meets the foot of the valley slope.",
        paragraphs: [
          "We use the edited spline to rebuild the channel and the adjoining banks together. Otherwise an author moving the river would also have to reshape the old shoreline by hand. The recording keeps the wait in real time. On this 4.608 km square map, the editor reported 4.56 seconds for the rebuild before the camera moved down to the new bank.",
        ],
        detail: "The editor script moves the sixth of 11 spline points. Discharge stays fixed at 2,500 cubic metres per second throughout the edit. The editor publishes the result as revision 10.",
        tags: ["Unreal Editor", "Spline authoring", "Water"],
        media: ["rivering/large-river", "rivering/river-bank"],
      },
    ],
  },
  {
    id: "rendering-effects",
    label: "Rendering & effects",
    systems: [
      {
        id: "lightning",
        label: "Procedural lightning",
        headline: "Procedural lightning",
        summary: "In slow-motion footage, faint lightning leaders trace competing paths through the air. When a leader connects to the ground, the discharge concentrates along that channel. A bright return stroke runs back up it while the other paths fade.",
        paragraphs: [
          "We wanted the forks to stay legible as the bolt spread into a triangular silhouette. The generator spaces two to four branches around their parent’s direction. Early forks open wide. Deeper forks grow at shorter intervals and narrower angles, so fine branches fill out the shape without obscuring the main channel.",
          "The strike has to land where the effect is placed. At each fork on the main channel, the child aimed closest to that point inherits 69–80% of the remaining charge budget. Its final approach steers into the exact endpoint. Side branches slow down near the ground and stop above it. That makes the chosen point the first and only ground contact.",
          "An early version let the upper channel fade while the tips were still growing. The branches looked detached from their source. We now keep a thin core visible along the main leader throughout the competition. Watch that line in the Unreal recording just before it widens and brightens on contact.",
        ],
        detail: "The C++ generator computes the contact time and stores a birth time for each segment. Niagara plays those timestamps, flashes the connected channel from the ground up, then reuses it for later strokes. Ground is the horizontal plane through the supplied endpoint. If a seed fails to connect, the effect does not spawn.",
        tags: ["Niagara", "C++", "Seeded generation"],
        media: ["rivering/lightning-pie", "rivering/lightning-growth"],
      },
      {
        id: "material-sphere",
        label: "Wall tiles & glass",
        headline: "Wall weathering and glass materials",
        summary:
          "On the tiled wall, wear gathers near the base and breaks up along the tile surface. In the glass comparison, a dark pane dims the character behind it while streaks catch the light on another pane. The placement of a mark and the amount of light that passes through are different things to control.",
        paragraphs: [
          "For the wall, a coverage mask places the weathered area. Height information from the surfaces breaks up the transition along the tile relief. For the glass, separate material-instance controls let us change dust, rain streaks and tint independently. The panels share the same lighting so the effect of those edits stays visible.",
        ],
        detail:
          "The wall instance exposes surface rotation, colour variation, coverage and displacement. The Substrate glass instance exposes transmission and surface treatments, including dust, mud and rain streaks.",
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
        headline: "Camera occlusion in buildings",
        summary:
          "Follow the character from the street into the stairwell. From this camera angle, a foreground wall can cover the character and the floor above can hide the next flight. The cutaway needs to follow the character while leaving enough of the building visible to tell which floor they are on.",
        paragraphs: [
          "The camera checks sightlines to several points across the character capsule. Those checks identify obstructing geometry, while the building’s floor boundaries determine which storey to reveal indoors. We clip the rendered material and keep the wall’s collision in place. On the next frame the camera can still detect the same wall, so opening the view does not cause it to close again immediately.",
        ],
        detail:
          "Walls, roofs, props and excluded components have distinct visibility rules. Generated buildings register their components with the system when PCG finishes and release them when their generated output is cleared.",
        tags: ["Geometry queries", "Material clipping", "Collision preserved"],
        media: ["rivering/occlusion-walkthrough", "rivering/occlusion"],
        diagram: "occlusion",
      },
      {
        id: "skill-vfx",
        label: "Weapon effects",
        headline: "Spin and displacement attack effects",
        summary:
          "In the spin, a silver crescent follows the blade around the character. In the displacement attack, arcs appear in succession along the route the character travels. The first effect needs to read as a turn. The second needs to show how far the character has moved.",
        paragraphs: [
          "During the spin, Niagara reads the same effective blade span the game uses for the move. The base-to-tip direction keeps the crescents facing outward, and an animation window stops new emission as the swing ends. For the displacement attack, ground dust follows the distance actually travelled. It fills the path behind the character and fades in place.",
        ],
        detail:
          "The trail component passes the blade midpoint and effective span to Niagara during the active spin. The effect waits for the reach override before spawning, which keeps its width consistent when the animation notifies arrive in a different order.",
        tags: ["Niagara", "Animation notifies", "Ground dust"],
        media: ["rivering/skill-vfx", "rivering/skill-displacement"],
      },
    ],
  },
  {
    id: "gameplay-animation",
    label: "Gameplay & animation",
    systems: [
      {
        id: "combat-interaction",
        label: "Combat interaction",
        headline: "Combat state & action arbitration",
        summary:
          "As the characters close the distance, a swing gives way to a hit reaction and one character goes down. A movement or attack input can arrive while that reaction is still playing. The game needs to decide whether to act on it now, queue it or ignore it.",
        paragraphs: [
          "The server makes that decision from the current combat state. A guard can keep accepting grounded movement, a dash holds its facing, and an attack phase can accept a turn while suppressing ordinary movement. Movement and animation use the same decision, so a buffered command starts when the current phase allows that transition.",
        ],
        detail:
          "Enhanced Input sends commands to the combat handlers. The combat component tracks the active action, block phase and hit reaction. Gameplay Ability System attributes and effects handle stamina spending and recovery.",
        tags: ["Action arbitration", "GAS attributes", "Input policy"],
        media: ["rivering/combat-interaction", "rivering/combat-contact"],
        diagram: "combat",
      },
      {
        id: "melee-sweep",
        label: "Melee hit detection",
        headline: "Continuous melee hit detection",
        summary:
          "In the overhead recording, the teal and cyan outlines show two consecutive blade poses. During the first swing, the blade turns 127.4° between samples just 33.3 ms apart. The orange fan shows its fitted path in between. The blade reaches the dummy before the second pose is sampled.",
        paragraphs: [
          "A short turn and a longer turn in the opposite direction can connect the same poses while passing on different sides of the dummy. We choose the arc whose initial motion at the middle of the blade best matches the cutting direction marked on the weapon. The base and tip rotate together about a fitted axis and can travel along it. That keeps the blade rigid and gives us its position at any time between samples.",
          "We evaluate the blade and the dummy’s moving colliders at the same instant. For a capsule, the surfaces meet when the distance from the blade segment to the capsule’s centerline reaches the sum of their radii. The solver finds the earliest valid entry in the animation’s active window and returns the surface point and normal. For the first swing, the recorded entry was 28.05% of the way through the sample interval, or 9.35 ms after the first pose. A target can register once per attack window.",
        ],
        detail:
          "The orange lines are samples drawn for the debug view. The server isolates candidate contact times, checks the gap on the finite shapes at each candidate and keeps the earliest eligible contact across the target’s colliders. When the blade points in the same direction at both samples, the fit uses translation. Thrusts use a separate query for the tip’s motion relative to the collider.",
        tags: ["Continuous collision detection", "Time of impact", "Unreal Engine"],
        media: ["rivering/melee-r22-pie", "rivering/melee-r22-trace"],
        diagram: "sweep",
      },
      {
        id: "gasp-block",
        label: "Katana guard turns",
        headline: "Katana guard locomotion",
        summary:
          "Watch the feet as the character turns with the katana raised. The support foot holds through the pivot while the other foot steps around. Rotating the character independently of that step would make the planted foot slide.",
        paragraphs: [
          "Guard sets the desired facing and allows grounded movement. Mover turns toward that facing at a bounded rate, and GASP Motion Matching selects the step for the changing direction. The combat system supplies the guard state through entry, hold and release, so walking and turning can continue with the katana raised.",
        ],
        detail:
          "Rivering’s guard integration chooses the movement and facing policy for each block phase. GASP and Mover provide the underlying locomotion and character orientation.",
        tags: ["GASP", "Mover", "Block state"],
        media: ["rivering/gasp-block"],
      },
      {
        id: "cr-facing",
        label: "Vertical aiming / Control Rig",
        headline: "Vertical aiming with Control Rig",
        summary:
          "The two recordings start the character the same distance from a white ball. The high ball sits above the usual swing and the low ball is near the floor. Watch the ball flash on contact. Facing it solves the horizontal alignment, but each cut still has to reach the right height.",
        paragraphs: [
          "During preparation, we evaluate the authored swing against the target and choose a chest and upper-arm correction for the whole arc. Control Rig holds that correction through release so the pose does not chase the target halfway through the swing. GASP and Mover continue to handle facing. In each recording the ball flashes three times, once for each cut in the combo.",
        ],
        detail:
          "The extra chest rotation ranges from −15° to +25° and the upper-arm rotation from −20° to +30°. The wrist follows the authored animation. The target logs record contact for each of the three distinct attack montages at both heights.",
        tags: ["Control Rig", "Vertical aiming", "Animation integration"],
        media: ["rivering/cr-facing", "rivering/cr-low"],
      },
    ],
  },
];
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
  groups: riveringGroups,
  systems: riveringGroups.flatMap((group) => group.systems),
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
      media: ["friday-night/group-workflow", "friday-night/movie-detail", "friday-night/notifications"],
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
  intro: "Spacecraft control and exploration in GameMaker.",
  cardSummary:
    "Sole programmer and producer of a three-person space-exploration game.",
  deck: "I programmed the spacecraft controller, star interactions, dialogue and region transitions in GML. I also coordinated production for the three-person core team.",
  tags: ["GML", "GameMaker Studio", "GLSL ES"],
  hero: "wayjia/hero",
  systems: [
    {
      id: "flight",
      label: "Physics & exploration",
      headline: "Spacecraft physics & exploration",
      summary:
        "Thrust and torque control the spacecraft’s motion. The player scans for nearby stars and holds an input to activate them and advance through each region.",
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
      headline: "Game progression and credits",
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
  intro: "Image moderation for square avatar crops.",
  cardSummary: "A four-category image review pipeline evaluated on the visible avatar crop.",
  deck: "A wide upload is cropped to a square before review. The study measures each category separately, then checks the final allow or block decision.",
  tags: ["Python", "Computer vision", "Offline evaluation"],
  hero: "avatar-review/examples",
  systems: [
    {
      id: "visible-crop",
      label: "Model decisions",
      headline: "Blocked and allowed avatar crops",
      summary: "Compare a referral banner with a travel poster, or an uncovered abrasion with a bandaged knee. Each decision comes from the frozen model. The square images show the region it evaluated.",
      detail: "The preprocessing path accounts for image orientation and transparency, scales to the review size, then takes the centered square. The same crop feeds the category checks.",
      tags: ["Image preprocessing", "Crop policy"],
      media: [],
    },
    {
      id: "four-checks",
      label: "Evaluation",
      headline: "Classification results and error counts",
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
  intro: "Location-based alerts in a Django chat application.",
  cardSummary: "Source-grounded answers and location subscriptions in a Django chat application.",
  deck: "The application retrieves dated bulletins for a location and records updates in the chat timeline for users who subscribe to that area.",
  tags: ["Django", "LangChain", "Notifications"],
  hero: "disaster-chatbot/interface",
  systems: [
    {
      id: "bulletins",
      label: "Source updates",
      headline: "Bulletin updates by location",
      summary: "In the exercise data, the second bulletin cancels the flood warning for Eastbank. The warning for Riverside remains in effect.",
      detail: "Retrieved documents carry source IDs, publication times, affected areas and validity windows. The answer stage receives the conversation and the relevant documents. The example reproduces a fictional project fixture.",
      tags: ["RAG", "Versioned evidence"],
      media: [],
    },
    {
      id: "subscriptions",
      label: "Subscriptions",
      headline: "Location subscriptions and event delivery",
      summary: "A user confirms a location and its coverage. Matching published events then appear in the conversation timeline. Device notifications are an additional opt-in.",
      detail: "A shared area version signals new publications. Private location matching and timeline writes happen after the version changes. The chart records a single-machine simulation and distinguishes public checks from user-specific update latency.",
      tags: ["Location matching", "Event delivery"],
      media: ["disaster-chatbot/subscription", "disaster-chatbot/delivery"],
    },
  ],
};
export const projects = [rivering, friday, wayjia, avatar, disaster];
