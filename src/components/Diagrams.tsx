export function Diagram({
  type,
}: {
  type: "combat" | "sweep" | "occlusion" | "pcg" | "auth";
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
