import type { Project, SystemGroup } from "./projects";

const groups: SystemGroup[] = [
  {
    id: "product",
    label: "Atlas & journal",
    systems: [
      {
        id: "atlas",
        label: "Taste Atlas",
        headline: "Placing works on a terrain map",
        summary:
          "The Atlas lays sixteen works over a field of green points. Selecting Stalker opens the inspector on the right: its elevation profile, the version of its published profile, and three connected works. Roadside Picnic and Solaris are joined by factual links, an ambient album by a semantic one.",
        paragraphs: [
          "Each work has a public elevation, so the ground has to pass exactly through every cover. I build broad relief from five rotated noise octaves and then solve a Gaussian interpolation for what remains, which lets a simple work sit on a high, smooth summit. Roads are searched with A* over the resting terrain. Steep segments cost more, so a long route climbs gradually and folds back instead of cutting straight up a ridge.",
          "The points ripple when a work is selected. Dots, roads, labels and the click-picking pass all run the same vertex program, so a road never floats above the ground it was drawn on.",
        ],
        detail:
          "Three.js on WebGL 2. Elevation 0–1 maps to 0–2,000 m. The demo snapshot’s coordinates and elevations are illustrative; the inspector reads each work’s versioned public profile from the API. Reduced-motion preferences freeze the terrain and skip the camera flight.",
        tags: ["Three.js", "Procedural terrain", "A* routing"],
        media: ["isomorph/atlas"],
      },
      {
        id: "journal",
        label: "Journal & cards",
        headline: "Recommending from journal ratings",
        summary:
          "The journal holds nine entries: three imported from a Douban watched list and six rated by hand. The watchlist on the right keeps four works saved from the first round. In the card view, Akira is on top. Drag right for interested, left to pass, down if it has already been seen.",
        paragraphs: [
          "A rating alone does not say why someone liked a film. I keep several taste hypotheses with weights, each citing the journal entries it rests on, and let an adversarial reviewer challenge them before a profile version is published. Every candidate is then rated once per hypothesis. A card is dealt only if its predicted rating and acceptance clear a quality gate, and the slate keeps a quota across film, books and music.",
          "Rating the candidates and writing the reason on each card take time. A background worker prepares the next hand while the reader is away and shows the first three cards as soon as they are written. When the profile changes, the prepared hand is discarded rather than served stale.",
        ],
        detail:
          "Profiles, works and recommendation rounds are immutable versions in PostgreSQL, and every POST takes an idempotency key. An offline chronological evaluation compares seven arms on the same folds: genre overlap, embedding neighbours, structured aspects, a single LLM profile, competing hypotheses, hypotheses updated by feedback, and hypotheses that also read what the reader said in conversation.",
        tags: ["Competing hypotheses", "Background card stock", "Offline evaluation"],
        media: ["isomorph/journal", "isomorph/cards"],
        diagram: "recommend",
      },
    ],
  },
  {
    id: "harness",
    label: "Agent harness",
    systems: [
      {
        id: "turn",
        label: "One conversation turn",
        headline: "How one conversation turn runs",
        summary:
          "The companion opens in a sidebar beside the map. Asked for something to watch tonight, it deals cards into the chat. Asked about the long takes in Stalker, it looks up sources and cites them. Everything a turn may do is decided by code around the model, not by the model.",
        paragraphs: [
          "A small classifier routes each sentence first: chitchat, theory, a request for recommendations, feedback on cards, or out of scope. The route decides which tools the model even sees. A theory turn cannot deal cards, and an out-of-scope turn gets no tools at all. Inside the loop, every turn has four budgets: model steps, wall-clock time, tokens and dollars. Repeating the same call with the same arguments is refused. When a budget runs out, the turn answers from what it already has and says what is missing.",
          "Replies stream sentence by sentence through an output guard. A sentence is released only once it is complete. A title that matches neither the catalogue nor this turn’s sources is marked unverified, and a citation number that points nowhere is removed. The reader never sees text that is later taken back.",
          "With prepared cards, the first card reached the screen in 2.35 s at the 95th percentile across twelve live requests. Routing took about 0.4 s, the model’s decision to call the tool 0.8–1.7 s, and claiming the prepared cards about 0.1 s.",
        ],
        detail:
          "Each turn is a LangGraph run with a PostgreSQL checkpoint after every node. Turns run under a lease with a heartbeat; after a crash a sweeper resumes from the last checkpoint, up to three attempts. A client turn ID makes a resent sentence replay the same turn, a new sentence interrupts the running one, and the SSE stream resumes from Last-Event-ID after a dropped connection. Stable context goes first so the provider’s prefix cache hits; everything that changes per turn goes last. The model fails over to a second provider behind a circuit breaker.",
        tags: ["LangGraph", "SSE", "Budgets & guards", "Prefix caching"],
        media: [],
      },
      {
        id: "deep-dive",
        label: "Deep questions",
        headline: "Handing longer questions to a sub-agent",
        summary:
          "Comparing a film with the novel it adapts takes more reading than one turn should hold. For questions like that, the main agent calls deep_dive. The sub-agent starts with only the question, a short note on what the reader has seen, and four read-only tools.",
        paragraphs: [
          "It has its own budget of six steps and 45 seconds, and it returns one cited report. The report shares the turn’s source numbering, so the guard checks its citations like any other. None of the sub-agent’s intermediate steps enter the main conversation.",
          "The offline tests passed long before it worked live. The provider rejected the sub-agent’s second step because I carried forward text that had no reasoning attached. Its last step sometimes wrote tool-call markup instead of a report. Once both were fixed, the main agent began filling gaps in the report from memory. I added a note to the report saying not to. The sub-agent now takes 13–15 s, and a deep turn takes 35–50 s. One adaptation case still drifts into plot recalled from memory, and I count it as open.",
        ],
        detail:
          "The sub-agent has its own tool registry and thread pool and is offered only on theory turns the router marks as deep. Its spend is absorbed into the turn’s budget without using main-loop steps. Tests assert that its requests carry none of the main history and that the main agent’s context contains only the report.",
        tags: ["Sub-agent", "Context isolation", "Shared citations"],
        media: [],
      },
      {
        id: "memory",
        label: "Memory",
        headline: "Deciding what to remember, and forgetting it",
        summary:
          "The memory panel explains what the companion keeps and lets the reader search, edit or delete it, or switch memory off. Each item shows where it came from. Here the reader has only ratings, so the panel lists the taste profile and the latest change between profile versions.",
        paragraphs: [
          "Memory is written after the reply, off the response path. The same classifier call that routes the sentence also asks whether it carries a memory signal. An extractor proposes up to four operations, each quoting the reader’s words. Then plain code decides. A quote that is not in the sentence is dropped. So is something said about a friend, a hypothetical, or an analysis that is not a preference, as well as anything sensitive the reader did not ask to keep. An inference that would rule out a whole category is held until the reader confirms it.",
          "Forgetting has to reach every copy. Deleting an item also erases the turns it came from, later turns that repeated it, their checkpoints, summaries and episodic memories. In the test the reader says where they work, the companion repeats it, an episode is written and then the reader asks to forget. A scan of every text, JSON, array and binary column in the database found no trace of the workplace.",
          "What the reader says about their taste also reaches the profile, but more weakly than ratings. A single remark never rebuilds the profile. A rebuild starts after three remarks, or when the classifier says a remark directly contradicts the strongest hypothesis in both answer orders.",
        ],
        detail:
          "On a 45-case memory set covering other people’s opinions, hypotheticals, analysis, fictional characters, sensitive topics and forget requests, four live runs had false-memory rates of 0%, 3.7%, 0% and 0% against a 5% red line, with 100% recall and no wrong deletions. The event log is append-only except for an explicit erase declared inside the same transaction.",
        tags: ["Write policy", "Right to forget", "Conversation evidence"],
        media: ["isomorph/memory"],
        diagram: "memory",
      },
      {
        id: "evaluation",
        label: "Evaluation gate",
        headline: "Comparing each prompt change with the last version",
        summary:
          "Every piece of text that shapes the model is hashed into a fingerprint: the persona, route notes, tool schemas, guard word lists and the memory prompts. CI fails if a new fingerprint has no evaluation report and no comparison with the last accepted version.",
        paragraphs: [
          "The golden set has 43 conversations with checks on route, tool calls, arguments and the answer itself. A judge from a different model family scores each reply and compares two versions in both orders. A disagreement between the orders counts as a tie. Simulated readers with six temperaments hold short conversations toward a goal.",
          "The first pass through the loop showed why the gate matters. A version that raised the pass rate began paraphrasing interviews from memory in the grounding cases. The gate marked it as a regression and I did not accept it. Four versions later the pass rate went from 82.0% to 87.2%, the grounding group from 75% to 100%, and budget cut-offs from three to zero. That last change came from a harness bug the evaluation found: the out-of-scope route’s token limit equalled the reserve kept for the final answer.",
          "I also labelled replies myself and found the judge too generous to answers that were correct but shallow, fragmented or defensive. Its rubric was rewritten around those failures. Running the comparison of a version against itself gave 11 to 17, which is the noise floor I now read pairwise results against.",
        ],
        detail:
          "The comparison report lists changed prompt parts, cases that flipped, paired bootstrap 95% intervals per judge dimension and the pairwise record. A regression fails CI unless it is accepted with a written reason. CI holds no keys and calls no paid model; reports are produced locally and committed. Problem turns from real conversations can be harvested into draft golden cases, skipping anything the reader asked to forget.",
        tags: ["Golden set", "Cross-family judge", "Regression gate"],
        media: [],
      },
      {
        id: "mcp",
        label: "MCP server",
        headline: "Exposing the catalogue and recommendations over MCP",
        summary:
          "Isomorph also runs as an MCP server, so an assistant such as Claude can search the catalogue or ask for recommendations on the reader’s behalf. The reader approves the connection on a page signed in with their own account and can disconnect it from Settings.",
        paragraphs: [
          "Outside clients can read and recommend but cannot change the journal, ratings or profile. I used OAuth 2.1 with dynamic client registration and PKCE. Authorization codes are single-use and expire in 60 seconds, and a replayed code revokes every token issued from it. Refresh tokens rotate on use. If an old one appears again, the whole chain is revoked.",
          "Recommendations requested over MCP use the same pipeline as the chat and appear in the reader’s Isomorph history, where they can still be swiped. Every call is audited. The same table limits each reader to 120 calls an hour and 30 recommendations a day.",
        ],
        detail:
          "Stateless Streamable HTTP mounted on the FastAPI app. Tokens are opaque and stored only as SHA-256 hashes, bound to reader, client, scope and resource. An end-to-end test drives discovery, registration, PKCE, consent, token exchange and a tool call through the official SDK’s OAuth client over real HTTP.",
        tags: ["MCP", "OAuth 2.1", "Rate limits & audit"],
        media: [],
        diagram: "mcp",
      },
    ],
  },
];

export const isomorph: Project = {
  slug: "isomorph",
  number: "07",
  title: "Isomorph",
  category: "AI agents / Recommendation",
  period: "Nov 2026",
  role: "Sole developer",
  team: "Personal project",
  intro: "A taste journal with recommendations and a conversational agent.",
  cardSummary:
    "A journal for films, books and music that models taste from ratings, recommends works as cards and adds a conversational agent with its own harness.",
  deck: "Isomorph keeps a reader’s ratings of films, books and music, models their taste as competing hypotheses and deals recommendations as cards. A conversational companion sits beside the map. I built the harness around it myself: what each turn may do, how much it may spend, what it is allowed to remember, and how a prompt change is measured before it ships.",
  tags: ["Python", "FastAPI", "LangGraph", "PostgreSQL", "pgvector", "DeepSeek", "MCP", "Three.js", "TypeScript"],
  hero: "isomorph/atlas",
  groups,
  systems: groups.flatMap((group) => group.systems),
};
