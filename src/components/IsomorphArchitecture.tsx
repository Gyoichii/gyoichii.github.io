const path = [
  {
    name: "Reader",
    where: "Chat sidebar beside the Atlas, or an MCP client",
    edge: "SSE stream · turn ID · interrupt · resume",
  },
  {
    name: "Gateway",
    where: "FastAPI",
    items: ["Friday Night sign-in", "Prefetch memory, profile summary, conversation state"],
    edge: "sentence + recent turns",
  },
  {
    name: "Router",
    where: "Jev classifier",
    items: ["Chitchat · theory · recommend · card feedback · out of scope", "Memory signal in the same call"],
    edge: "route decides the tools",
  },
  {
    name: "Agent loop",
    where: "DeepSeek · LangGraph",
    budgets: ["6 steps", "20–32 s", "tokens", "dollars"],
    tools: [
      { level: "read", names: ["theory_search", "work_profile", "catalog_lookup", "taste_profile", "diagnose_rejections"] },
      { level: "propose", names: ["recommend", "revise_round"] },
      { level: "ui", names: ["show_cards", "focus_atlas"] },
      { level: "sub-agent", names: ["deep_dive"] },
    ],
    items: ["Loop detection · failover provider"],
    edge: "complete sentences",
  },
  {
    name: "Output guard",
    where: "Per sentence, before it streams",
    items: ["Titles linked to the catalogue", "Citations from this turn’s sources", "Length and style checks"],
  },
];

const lanes = [
  {
    name: "Recommendation pipeline",
    note: "called through recommend",
    steps: ["Versioned taste profile", "Rate candidates per hypothesis", "Quality gate + quotas", "Prepared card stock"],
  },
  {
    name: "After the reply",
    note: "asynchronous, off the response path",
    steps: ["Memory gate", "Extractor", "Policy in code", "Memory · evidence · profile refresh"],
  },
  {
    name: "Learning loop",
    note: "local runs, gated in CI",
    steps: ["Traces + harvested failures", "Golden set · judge · simulated readers", "Prompt fingerprint comparison"],
  },
];

const store = ["Utterance events", "LangGraph checkpoints", "agent_run traces + cost ledger", "Versioned works and profiles", "pgvector"];

export function IsomorphArchitecture() {
  return (
    <figure className="iso-arch" aria-labelledby="iso-arch-title">
      <figcaption id="iso-arch-title" className="eyebrow">Architecture of one conversation turn</figcaption>
      <div className="iso-arch-grid">
        <ol className="iso-path" aria-label="Request path">
          {path.map((node) => (
            <li key={node.name}>
              <div className={`iso-node${node.tools ? " iso-node-loop" : ""}`}>
                <p className="iso-node-head"><strong>{node.name}</strong><span>{node.where}</span></p>
                {node.budgets && (
                  <ul className="iso-chips iso-budgets" aria-label="Per-turn budgets">
                    {node.budgets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                )}
                {node.tools && (
                  <dl className="iso-tools">
                    {node.tools.map((group) => (
                      <div key={group.level}>
                        <dt>{group.level}</dt>
                        <dd><ul className="iso-chips">{group.names.map((n) => <li key={n}><code>{n}</code></li>)}</ul></dd>
                      </div>
                    ))}
                  </dl>
                )}
                {node.items && <ul className="iso-items">{node.items.map((i) => <li key={i}>{i}</li>)}</ul>}
              </div>
              {node.edge && <p className="iso-edge"><span aria-hidden="true">↓</span> {node.edge}</p>}
            </li>
          ))}
        </ol>
        <div className="iso-lanes">
          {lanes.map((lane) => (
            <section className="iso-lane" key={lane.name} aria-label={lane.name}>
              <p className="iso-node-head"><strong>{lane.name}</strong><span>{lane.note}</span></p>
              <ol>{lane.steps.map((s) => <li key={s}>{s}</li>)}</ol>
            </section>
          ))}
        </div>
      </div>
      <div className="iso-store">
        <strong>PostgreSQL</strong>
        <ul className="iso-chips">{store.map((s) => <li key={s}>{s}</li>)}</ul>
      </div>
      <p>Each route loads only its own tools, and an out-of-scope turn loads none. Write access belongs to the memory policy; the agent never holds it.</p>
    </figure>
  );
}
