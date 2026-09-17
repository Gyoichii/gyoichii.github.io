export function Diagram({
  type,
}: {
  type: "combat" | "sweep" | "occlusion" | "pcg" | "auth";
}) {
  const config = {
    auth: {
      label: "Every mutation crosses an access boundary",
      steps: [
        "Signed identity",
        "Group membership",
        "Resource + role",
        "Authorized change",
      ],
      note: "A group selector is context. Membership and resource checks grant access.",
    },
    combat: {
      label: "One policy, multiple consumers",
      steps: [
        "Player intent",
        "Action arbitration",
        "Movement + facing",
        "Animation / feedback",
      ],
      note: "Combat state owns the decision. Presentation consumes it.",
    },
    sweep: {
      label: "From motion to an accepted hit",
      steps: [
        "Previous pose",
        "Current pose",
        "Sweep + validate",
        "Accept once",
      ],
      note: "An overlap alone is not a valid surface contact.",
    },
    occlusion: {
      label: "Visibility and geometry stay separate",
      steps: [
        "Camera → capsule",
        "Original geometry",
        "Visibility decision",
        "Material clip",
      ],
      note: "Original collision geometry remains available to the next query.",
    },
    pcg: {
      label: "From construction kit to generated world",
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
