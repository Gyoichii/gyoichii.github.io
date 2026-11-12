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
          "I build each floor from fixed-size modules and let infill pieces take up the remaining width. Shops open onto the commercial street, while residents enter from side or rear paths. I tested those paths against the generated geometry. At one building, low air conditioners and window cages blocked the route, so I adjusted those fittings. All 57 entry routes in the 23-building Unreal scene then cleared the character capsule and had floor support.",
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
        summary: "The Three Gorges slopes have narrow grooves that run down their faces. The Guilin lowlands roll into broad, smooth hollows. Both landscapes fill the same 8.064 km square. The difference I wanted to control was the shape of the ground at that scale.",
        paragraphs: [
          "The Three Gorges recipe starts with winding valleys and erodes their banks. Guilin starts with broad hills and lowlands. To see what the recipes contribute, I rendered all nine presets with the same seed, grey material, lighting and camera. The western Sichuan studies show the range from ridge shoulders to valley floors. The final Guilin pairs isolate a smaller edit. Increasing relief from 15% to 30% deepens the folds while the hills stay in place.",
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
          "I use the edited spline to rebuild the channel and the adjoining banks together. Otherwise an author moving the river would also have to reshape the old shoreline by hand. The recording keeps the wait in real time. On this 4.608 km square map, the editor reported 4.56 seconds for the rebuild before the camera moved down to the new bank.",
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
          "I wanted the forks to stay legible as the bolt spread into a triangular silhouette. The generator spaces two to four branches around their parent’s direction. Early forks open wide. Deeper forks grow at shorter intervals and narrower angles, so fine branches fill out the shape without obscuring the main channel.",
          "The strike has to land where the effect is placed. At each fork on the main channel, the child aimed closest to that point inherits 69–80% of the remaining charge budget. Its final approach steers into the exact endpoint. Side branches slow down near the ground and stop above it. That makes the chosen point the first and only ground contact.",
          "An early version let the upper channel fade while the tips were still growing. The branches looked detached from their source. I now keep a thin core visible along the main leader throughout the competition. Watch that line in the Unreal recording just before it widens and brightens on contact.",
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
          "For the wall, a coverage mask places the weathered area. Height information from the surfaces breaks up the transition along the tile relief. For the glass, separate material-instance controls let me change dust, rain streaks and tint independently. The panels share the same lighting so the effect of those edits stays visible.",
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
          "The camera checks sightlines to several points across the character capsule. Those checks identify obstructing geometry, while the building’s floor boundaries determine which storey to reveal indoors. I clip the rendered material and keep the wall’s collision in place. On the next frame the camera can still detect the same wall, so opening the view does not cause it to close again immediately.",
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
          "A short turn and a longer turn in the opposite direction can connect the same poses while passing on different sides of the dummy. I choose the arc whose initial motion at the middle of the blade best matches the cutting direction marked on the weapon. The base and tip rotate together about a fitted axis and can travel along it. That keeps the blade rigid and gives me its position at any time between samples.",
          "I evaluate the blade and the dummy’s moving colliders at the same instant. For a capsule, the surfaces meet when the distance from the blade segment to the capsule’s centerline reaches the sum of their radii. The solver finds the earliest valid entry in the animation’s active window and returns the surface point and normal. For the first swing, the recorded entry was 28.05% of the way through the sample interval, or 9.35 ms after the first pose. A target can register once per attack window.",
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
          "During preparation, I evaluate the authored swing against the target and choose a chest and upper-arm correction for the whole arc. Control Rig holds that correction through release so the pose does not chase the target halfway through the swing. GASP and Mover continue to handle facing. In each recording the ball flashes three times, once for each cut in the combo.",
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
  deck: "I built Friday Night so a film club could recommend a movie, decide what to watch and sit down together even when everyone was at home. In the recording, Alex and Mina share a sofa and a TV. Each browser plays the film locally, so the room has to keep track of what both viewers should be seeing.",
  tags: ["Java", "Spring Boot", "PostgreSQL", "Python", "WebSocket", "TMDB"],
  hero: "friday-night/watch-together",
  systems: [
    {
      id: "visual-styles",
      label: "Seven watchlist styles",
      headline: "One watchlist, seven interfaces",
      summary: "Switch between seven English views of the Friday Film Club’s list. Each opens on the same group with the same orange palette and dark appearance.",
      detail: "Visual style, palette and light or dark appearance are independent settings. The styles keep the same group, films and votes while changing how members browse them.",
      tags: ["Interface design", "Appearance settings"],
      media: [],
    },
    {
      id: "choosing-a-film",
      label: "DVD shelf & screening room",
      headline: "Picking a film off the shelf",
      summary: "In the DVD recording, In the Mood for Love slides out spine-first. Its cover swings open and the disc comes into view. In the phone recording, the viewer folds away the projector, scrolls to Her and taps its poster.",
      paragraphs: [
        "I wanted browsing to feel like running a finger along a shelf of films. On a phone, a finger can land on a spine to open it or to move past it. I wait to see whether the finger travels before opening the case. That lets someone drag across a crowded shelf and still pick out a single film with a tap.",
        "The screening room had a different problem. A projector and a strip of posters fit side by side on desktop, but the preview took up much of the phone screen. I gave the projector its own fold-away control and kept the filmstrip’s scroll position when it opens again.",
      ],
      detail: "I checked the shelf with drags starting on a case and in the gaps between cases. I also checked that a tap selected the intended film and a second tap opened its booklet. These interaction checks ran in a browser at a mobile viewport size.",
      tags: ["Desktop", "Mobile"],
      media: ["friday-night/dvd-shelf", "friday-night/theater-desktop", "friday-night/theater-mobile"],
    },
    {
      id: "shared-spaces",
      label: "Shared spaces",
      headline: "Sharing the TV controls",
      summary: "In the opening recording, Alex and Mina sit on the same sofa while Big Buck Bunny plays on the TV. The courtyard and cinema screenshots show two more places I built for members to meet.",
      paragraphs: [
        "Each viewer’s browser plays its own copy of the video. I share the room’s play state and position over WebSocket so either person at the TV can pause or seek for both. The tricky case was a delayed progress update arriving just after someone moved the playhead. Accepting it would send the room back to where it had been.",
        "I gave commands and progress reports an order. Once the room accepts a seek, it ignores older reports. If the browser reporting progress disconnects, the room pauses at its saved position and the next reporter starts there. The person who first switched on the TV can leave without taking the controls with them.",
      ],
      detail: "The server tracks who is present in the scene and which avatar occupies each seat. I tested alternating playback commands and a stale progress report with two clients. The sofa recording shows one viewer’s screen with two demo accounts and a locally cached clip.",
      tags: ["Multiplayer", "Shared playback"],
      media: ["friday-night/courtyard", "friday-night/cinema"],
    },
    {
      id: "shared-workflow",
      label: "Votes & discussion",
      headline: "Following a recommendation back to the film",
      summary: "In the watchlist, members can scan the votes and comment counts before choosing a film. The detail page for In the Mood for Love puts the club’s votes beside the film’s ratings. Later, Alex’s notification feed shows who joined the discussion. Both Mina and Theo commented on a film Alex added.",
      paragraphs: [
        "I kept votes and comments on the group’s own copy of each film. Two clubs can pick the same title and have entirely different discussions. Within a club, a second tap on the vote button cannot add another vote from the same person that day.",
        "A reply can outlive the link that first pointed to it. When someone opens their notifications, I look up the film that holds the comment now. If the film has moved, the link follows it. If the comment was deleted or the reader has left the group, the feed explains why it is unavailable.",
      ],
      detail: "PostgreSQL enforces the vote limit for each member, film and date. Each comment notification keeps a reference to the comment so the feed can resolve its current location and check the reader’s access.",
      tags: ["Relational models", "Group workflow", "Persistent state"],
      media: ["friday-night/group-workflow", "friday-night/movie-detail", "friday-night/notifications"],
    },
    {
      id: "access-control",
      label: "Group membership",
      headline: "Who can change the club’s settings?",
      summary: "The group picker shows an account that belongs to two clubs. Inside one club, its owner can change how people join and send invitations. I needed someone to be able to run one club and participate as an ordinary member in the other.",
      paragraphs: [
        "I attached the role to the membership between a person and a group. When someone saves a change, the server looks up that membership again. This matters if an owner removes someone while they still have the settings page open. Their old tab no longer gives them permission to act for the club.",
      ],
      detail: "The signed session identifies the person making the request. Membership and role checks use the group that owns the resource. I tested cross-group operations and access after membership removal.",
      tags: ["Signed cookies", "Role-based access", "CSRF protection"],
      media: ["friday-night/group-settings", "friday-night/group-selection"],
      diagram: "auth",
    },
    {
      id: "movie-data",
      label: "Film search",
      headline: "When two people recommend the same film",
      summary: "The search screenshot shows The Grand Budapest Hotel with its poster, synopsis and an Add to watchlist button. I used TMDB so a member can recognize the right film before adding it.",
      paragraphs: [
        "The catalogue knows which film this is. Only the club’s watchlist knows whether someone has already suggested it. When a member adds a title, I check for a matching TMDB ID or title and year in that group. If the film is already on the list, the recommendation counts as a vote on the existing entry, subject to the daily limit. If it was archived, I ask whether to bring it back. The earlier discussion stays with the film.",
      ],
      detail: "I store the chosen film and its metadata locally so votes and comments have a stable record. The search screenshot uses cached TMDB metadata for the demonstration.",
      tags: ["TMDB API", "Async HTTP", "Movie identity"],
      media: ["friday-night/movie-search"],
    },
    {
      id: "security-tests",
      label: "Backend migration",
      headline: "Moving the backend while keeping existing accounts",
      summary: "The desktop and phone screenshots show the public sign-in page. When I moved Friday Night from Python and SQLite to Spring Boot and PostgreSQL, members already had passwords, sessions and film lists they expected to find on the other side.",
      paragraphs: [
        "I kept the existing URLs, password format and signed sessions compatible, then imported the accounts and group data. To check the move, I compared the imported tables with a read-only snapshot and opened the watchlists and rooms in a browser using the imported data.",
        "I moved accounts, votes and room state into the Java service. I kept the video resolver and relay in Python because they already handled the different streaming formats. Java checks that a viewer belongs to the room before authorizing the media request.",
      ],
      detail: "The migration check compared 17 tables from a local snapshot, including group memberships, movie records, comments and avatar images. The public login captures show the entry point after deployment.",
      tags: ["Spring Boot", "PostgreSQL", "SQLite migration"],
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
  deck: "A study-materials banner and a travel poster both contain advertising. Only the first triggered the referral check. This offline study follows the visible crop through four classifiers and examines where their combined decision goes wrong.",
  tags: ["Python", "Computer vision", "Offline evaluation"],
  hero: "avatar-review/examples",
  systems: [
    {
      id: "visible-crop",
      label: "Model decisions",
      headline: "Blocked and allowed avatar crops",
      summary: "Compare a referral banner with a travel poster, or an uncovered abrasion with a bandaged knee. Each decision comes from the frozen model. The square images show the region it evaluated.",
      detail: "I correct the upload’s orientation, composite transparent pixels onto white and take the center square. The base avatar is 256 × 256. The frame toggle shows the wider upload for context. The recorded outputs in both views belong to the original square before publication redactions.",
      tags: ["Image preprocessing", "Crop policy"],
      media: [],
    },
    {
      id: "model-selection",
      label: "Model selection",
      headline: "How each check reads the crop",
      summary: "I chose SigLIP 2 because the same checkpoint can encode an avatar and a short text description. That lets me compare a drawing with descriptions of who it might depict. For faces in photographs, InsightFace compares against reference portraits. Keeping the encoders frozen let me fit and tune each moderation classifier separately.",
      detail: "The shared image–text checkpoint is Google’s SigLIP 2 Base, patch 16 at 224 pixels. The explicit-content and injury branches also use task-specific frozen SigLIP vision encoders. Grouped development comparisons selected linear support vector classifiers for explicit content, injury and referral. At inference, any positive check blocks the crop.",
      tags: ["SigLIP 2", "RapidOCR", "InsightFace", "scikit-learn"],
      media: [],
    },
    {
      id: "identity-errors",
      label: "Failure analysis",
      headline: "When a cartoon’s subject was mistaken for a person",
      summary: "A political cartoon can share the style and setting of a reference picture without depicting anyone on the list. The earlier model blocked 19 of 41 such images. Training with similar-looking people and examples from the same subject area brought that count down to two on the same comparison.",
      paragraphs: ["That improvement came at a cost. Among 26 crops that did contain someone on the list, missed blocks rose from four to eight. Tiny faces in crowds and stylized drawings remained difficult. In one animation the model blocked the image but named the wrong person. I therefore scored both the final block and the individual identity."],
      detail: "Four-fold grouped validation compared linear and radial-basis support vector classifiers for each person. On the held-out set, the revised identity check missed 8 of 26 positive crops and incorrectly flagged 3 of 125 negatives. Captions, creator names and web page titles were excluded from model input.",
      tags: ["Hard negatives", "Grouped validation"],
      media: [],
    },
    {
      id: "four-checks",
      label: "Evaluation",
      headline: "Which images were wrongly blocked or allowed?",
      summary: "Of 162 offline images, 140 had an unambiguous label for all four checks. The final decision matched human review on 124 of those 140 (88.57%). The two orange cells show how the other 16 split between false alarms and missed blocks.",
      detail: "Each check uses only images with a usable label for that category. The injury set contained 148 negatives and just 3 positives. All three positives were caught, so the 148 / 151 accuracy alone says little about performance on a wider range of injuries. One reviewer labeled the study set.",
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
  deck: "Ask about an alert, inspect its sources, save a watch area or look up a shelter from a starting point. These screenshots follow the current Django interface through fictional exercises.",
  tags: ["Django", "LangChain", "Notifications"],
  hero: "disaster-chatbot/chat-answer",
  systems: [
    {
      id: "bulletins",
      label: "Chat & citations",
      headline: "Which warning applies to Eastbank?",
      summary: "The 08:00 bulletin covers two districts. At 10:00 the same office lifts the warning for Eastbank only. In Chat, the reply links to the dated update. Opening View activity shows which documents were available and when the app checked the citations.",
      detail: "Retrieved documents carry source IDs, publication times, affected areas and validity windows. The answer stage receives the conversation and the relevant documents. The example reproduces a fictional project fixture.",
      tags: ["RAG", "Versioned evidence"],
      media: ["disaster-chatbot/chat-activity"],
    },
    {
      id: "source-check",
      label: "Compare reports",
      headline: "Checking a shelter report against two sources",
      summary: "The one-time lookup in Notifications can show which passages support a specific claim. In this exercise a city bulletin and a community report both say Maple Community Center opened at 09:00. Expanding Supporting passages reveals both quotations under that claim.",
      detail: "The server validates the quoted text against the retrieved documents and requires distinct source IDs for corroboration. Two updates from the same publisher cannot establish independent agreement. With too little evidence the lookup returns an insufficient-evidence status.",
      tags: ["Quoted evidence", "Source validation"],
      media: ["disaster-chatbot/source-check"],
    },
    {
      id: "subscriptions",
      label: "Subscriptions",
      headline: "Location subscriptions and event delivery",
      summary: "Search for a city, give the watch area a name and confirm its radius. The Atlanta exercise uses 25 km. A matching flood alert appears in Notifications. When the alert is lifted, the event keeps its earlier revision in an expandable timeline.",
      detail: "A shared area version signals new publications. Private location matching and timeline writes happen after the version changes. The chart records a single-machine simulation and distinguishes public checks from user-specific update latency.",
      tags: ["Location matching", "Event delivery"],
      media: ["disaster-chatbot/watch-area", "disaster-chatbot/revisions", "disaster-chatbot/subscription", "disaster-chatbot/delivery"],
    },
    {
      id: "evacuation",
      label: "Shelter routes",
      headline: "From a starting point to a shelter route",
      summary: "Find an evacuation route opens a trip planner inside Chat. The user can search for a place, use device location or pick a point on the map. In the wheelchair exercise, a reported closure intersects the first candidate route. The app requests a detour and draws the returned route to the exercise shelter.",
      paragraphs: ["The result distinguishes straight-line distance from the mapped trip length and shows the estimated time and route steps. The shelter, closure and routing responses in this example come from the project’s tests."],
      detail: "The local app combines shelter status, travel mode, reported closures and routing results. When the route or its final approach cannot be checked, the interface reports the gap. The screenshot uses an OpenStreetMap base layer.",
      tags: ["Leaflet", "Travel mode", "Closure checks"],
      media: ["disaster-chatbot/route-start", "disaster-chatbot/route-map", "disaster-chatbot/route-result"],
    },
    {
      id: "preferences",
      label: "Settings & preparation",
      headline: "Travel preferences and device notifications",
      summary: "Settings remembers a preferred travel mode and directions language on this device. Background notifications are a separate opt-in from saving a watch area. The captured local server reports that background delivery is unconfigured.",
      detail: "General preparation is a static reference under Notifications. It remains available independently of a model response or a saved alert location.",
      tags: ["Device preferences", "Web Push"],
      media: ["disaster-chatbot/preferences", "disaster-chatbot/device-push", "disaster-chatbot/preparation"],
    },
  ],
};
export const projects = [rivering, friday, wayjia, avatar, disaster];
