export function Diagram({
  type,
}: {
  type: "combat" | "sweep" | "occlusion" | "pcg" | "auth" | "recommend" | "memory" | "mcp" | "worldmodel" | "bodyruntime";
}) {
  const config = {
    auth: {
      label: "Authorization checks for group operations",
      steps: [
        "Signed identity",
        "Group membership",
        "Resource + role",
        "Authorized change",
      ],
      note: "A group selector is context. Membership and resource checks grant access.",
    },
    combat: {
      label: "Combat input processing",
      steps: [
        "Player intent",
        "Action arbitration",
        "Movement + facing",
        "Animation / feedback",
      ],
      note: "The current combat state determines which movement and animation responses can run.",
    },
    sweep: {
      label: "Continuous collision query for a swing",
      steps: [
        "Blade poses and cutting direction",
        "Fit the blade trajectory",
        "Solve for contact within the window",
        "Accept the target once",
      ],
      note: "The contact point and surface normal use the target collider’s pose at the time of impact.",
    },
    occlusion: {
      label: "Occlusion query and material clipping",
      steps: [
        "Camera → capsule",
        "Original geometry",
        "Visibility decision",
        "Material clip",
      ],
      note: "Original collision geometry remains available to the next query.",
    },
    recommend: {
      label: "Recommendation steps",
      steps: [
        "Ratings, reviews + what was said",
        "Competing taste hypotheses",
        "Rate each candidate per hypothesis",
        "Quality gate + media quotas",
      ],
      note: "An adversarial reviewer challenges the hypotheses before a profile version is published.",
    },
    memory: {
      label: "Memory write steps, after the reply",
      steps: [
        "Signal from the routing call",
        "Extractor quotes the reader",
        "Policy in plain code",
        "Memory, evidence or nothing",
      ],
      note: "Every dropped operation records its reason. Inferred taste stays weaker than a rating.",
    },
    mcp: {
      label: "MCP authorization and access",
      steps: [
        "Dynamic registration",
        "PKCE + reader consent",
        "Scoped, rotating tokens",
        "Audited, rate-limited tools",
      ],
      note: "Clients may read and recommend. They cannot change the journal, ratings or profile.",
    },
    worldmodel: {
      label: "One SuperMimic training round (method by Liao et al.)",
      steps: [
        "Parallel bodies in MuJoCo Warp",
        "Replay of real transitions",
        "World model fit on 8-step windows",
        "Policy gradient through 32 imagined steps",
      ],
      note: "Imagined rollouts start from replayed states and end with a critic value. The physics simulator itself is never differentiated.",
    },
    bodyruntime: {
      label: "One control step in Unreal",
      steps: [
        "Mover fixed tick",
        "ONNX policy through NNE",
        "Finite motors + MuJoCo, 20 × 1 ms",
        "Pose snapshots → Hermite bones",
      ],
      note: "While the mode is active it is the only writer of the pawn transform.",
    },
    pcg: {
      label: "Procedural building generation",
      steps: [
        "Blender modules",
        "Building controls",
        "Native PCG layout",
        "Owned mesh output",
      ],
      note: "Generation and cleanup share a component owner.",
    },
  }[type];
  return (
    <figure className={`system-diagram diagram-${type}`}>
      <figcaption className="eyebrow">{config.label}</figcaption>
      <ol>
        {config.steps.map((step, i) => (
          <li key={step}>
            <span className="diagram-index">0{i + 1}</span>
            {step}
            {i < 3 && (
              <span className="diagram-arrow" aria-hidden="true">
                →
              </span>
            )}
          </li>
        ))}
      </ol>
      <p>{config.note}</p>
    </figure>
  );
}
