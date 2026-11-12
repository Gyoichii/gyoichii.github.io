"use client";

import { useState } from "react";
import manifest from "../data/media.generated.json";
import { Gallery } from "./MediaViewer";

const routes = [
  { label: "Power mains", map: manifest["rivering/cable-plan-power"], text: "I start from buildings with residential power boxes. Each run advances along the alley, alternating between supports on facing facades. This replaced isolated hops across the street. The longest run passes seven supports and advances 61.7 m along the alley." },
  { label: "Shop crossings", map: manifest["rivering/cable-plan-cross"], text: "A shop entrance makes a communication crossing more likely. I consider facing frontages with a clear span and favour pairs with shops on both sides. Shifting the crossing probability changes this layer independently of the four power routes." },
  { label: "Eaves connections", map: manifest["rivering/cable-plan-eaves"], text: "An entrance beneath an overhang can carry a shared communication bundle. At the end of a frontage I look for a nearby end facing the same way. Eight joins bridge a gap directly. At two offset facades the direct path crosses the building footprint, so the line follows the outside corner." },
  { label: "Box feeds", map: manifest["rivering/cable-plan-box"], text: "I place a residential box beside a doorway where the wall has room for it. From an overhead support, a riser descends outside the upper floor and follows the facade to the box feed. A short final segment lands on top of the cabinet." },
];
const connections = ["cable-detail-rack", "cable-detail-split", "cable-detail-cross", "cable-detail-coil"] as const;

export function CableRoutes() {
  const [selected, setSelected] = useState(0);
  const route = routes[selected];
  return <div className="cable-study">
    <h4>Follow a route through District60</h4>
    <p>The plan uses the saved routes and footprints of 23 buildings. Switch layers to see what each connection serves.</p>
    <fieldset className="cable-layers"><legend>Route layer</legend>
      {routes.map((item, index) => <label key={item.label}><input type="radio" name="cable-layer" checked={index === selected} onChange={() => setSelected(index)} /> {item.label}</label>)}
    </fieldset>
    <p aria-live="polite">{route.text}</p>
    <Gallery key={route.label} items={[route.map]} />
    <h4>What each cable represents</h4>
    <dl className="cable-roles">
      <dt>Communication trunk</dt><dd>A shared run carries the route along several frontages to a building distribution point.</dd>
      <dt>Subscriber drop</dt><dd>A smaller branch represents the last stretch from a distribution point to an individual subscriber.</dd>
      <dt>Low-voltage power</dt><dd>The overhead main, facade riser and cabinet feed represent successive parts of a building’s power service.</dd>
      <dt>Support messenger</dt><dd>A load-bearing line gives a suspended bundle something to hang from. Its endpoints are supports.</dd>
    </dl>
    <p>These are service roles in the generator. The saved district plan uses communication and low-voltage power. Subscriber drops and support messengers are available in the cable model.</p>
    <h4>What happens at a support?</h4>
    <p>In the Unreal reference map I can follow the same strand through a rack, along a separate support, or into a coil. A bundle can stay tightly grouped at its clamps and still hang in a deep arc. Clamp spacing controls the grouping, while spare length controls the sag. Later installation batches can have their own spacing and slack.</p>
    <Gallery items={connections.map(id => manifest[`rivering/${id}`])} />
  </div>;
}
