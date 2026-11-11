"use client";

import { useState } from "react";

const samples = [
  { id: "landscape", title: "Landscape illustration", result: "Allow", reason: "All four checks passed." },
  { id: "code-card", title: "Printed code card", result: "Block", reason: "The referral / QR check flagged the centered code." },
];

export function AvatarExamples() {
  const [index, setIndex] = useState(0);
  const sample = samples[index];
  return <div className="exercise-demo">
    <div className="demo-controls" aria-label="Select an evaluated sample">
      {samples.map((s,i) => <button type="button" key={s.id} aria-pressed={index === i} onClick={() => setIndex(i)}>{s.title}</button>)}
    </div>
    <div className="sample-pair">
      <figure><img src={`/media/avatar-review/${sample.id}.png`} alt={sample.title} width={840} height={420}/><figcaption>Original upload</figcaption></figure>
      <figure><img src={`/media/avatar-review/${sample.id}-crop.png`} alt={`Square crop of ${sample.title}`} width={420} height={420}/><figcaption>Visible avatar</figcaption></figure>
    </div>
    <p aria-live="polite"><strong>{sample.result}</strong> · {sample.reason} Recorded offline model output.</p>
  </div>;
}

export function AvatarMetrics() {
  return <table className="case-table"><caption>Offline review set · 162 images</caption>
    <thead><tr><th scope="col">Category</th><th scope="col">Correct</th><th scope="col">Accuracy</th></tr></thead>
    <tbody>{[
      ["Explicit content","161 / 161","100%"],["Violence or injury","148 / 151","98.01%"],
      ["Referral or QR","156 / 159","98.11%"],["Listed identities","140 / 151","92.72%"],
      ["Final allow / block","124 / 140","88.57%"],
    ].map(([name,correct,accuracy]) => <tr key={name}><th scope="row">{name}</th><td>{correct}</td><td>{accuracy}</td></tr>)}</tbody>
  </table>;
}

const bulletins = [
  {time:"08:00",title:"Original flood bulletin",text:"A flood warning is in effect for Eastbank and Riverside until 12:00, unless superseded by a later update.",summary:"Eastbank and Riverside are both under the exercise warning."},
  {time:"10:00",title:"Flood bulletin update",text:"The flood warning for Eastbank was cancelled at 10:00. The Riverside flood warning remains in effect until 12:00.",summary:"Eastbank’s warning has been cancelled. The warning still applies to Riverside."},
];

export function BulletinExercise() {
  const [index,setIndex] = useState(0);
  const bulletin=bulletins[index];
  return <div className="exercise-demo">
    <h3>Eastbank · fictional exercise</h3>
    <p>The project’s November 9 fixture asks, “Does the flood warning still apply to Eastbank now?”</p>
    <div className="demo-controls">{bulletins.map((b,i) => <button key={b.time} type="button" aria-pressed={i===index} onClick={()=>setIndex(i)}>{b.time} · {i ? "Update" : "Original"}</button>)}</div>
    <p aria-live="polite">{bulletin.summary}</p>
    <details key={bulletin.time}><summary>Read source · {bulletin.title}</summary>
      <blockquote>{bulletin.text}</blockquote><p>Exercise Weather Office · November 9, {bulletin.time} ET</p>
    </details>
  </div>;
}
