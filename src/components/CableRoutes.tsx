"use client";

import { useState } from "react";
import manifest from "../data/media.generated.json";
import { Gallery } from "./MediaViewer";

const routes = [
  { label: "Power mains", map: manifest["rivering/cable-plan-power"], view: manifest["rivering/cable-street-main"], text: "I start from buildings with residential power boxes. Each run advances along the alley, alternating between supports on facing facades. This replaced isolated hops across the street. The longest run passes seven supports and advances 61.7 m along the alley." },
  { label: "Shop crossings", map: manifest["rivering/cable-plan-cross"], view: manifest["rivering/district-cables-crossing"], text: "A shop entrance makes a communication crossing more likely. I consider facing frontages with a clear span and favour pairs with shops on both sides. Shifting the crossing probability changes this layer independently of the four power routes." },
  { label: "Eaves connections", map: manifest["rivering/cable-plan-eaves"], view: manifest["rivering/district-cables-corner"], text: "An entrance beneath an overhang can carry a shared communication bundle. At the end of a frontage I look for a nearby end facing the same way. Eight joins bridge a gap directly. At two offset facades the direct path crosses the building footprint, so the line follows the outside corner." },
  { label: "Box feeds", map: manifest["rivering/cable-plan-box"], view: manifest["rivering/district-cables-box"], text: "I place a residential box beside a doorway where the wall has room for it. From an overhead support, a riser descends outside the upper floor and follows the facade to the box feed. A short final segment lands on top of the cabinet." },
];

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
    <Gallery key={route.label} items={[route.map, route.view]} />
  </div>;
}
