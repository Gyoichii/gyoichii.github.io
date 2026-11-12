"use client";

import { useState } from "react";

type AvatarSample = {
  id: string; title: string; result: "Block" | "Allow"; description: string;
  alt: string; credit: string; source?: string; license?: string; licenseUrl?: string;
};
const comparisons: { title: string; samples: AvatarSample[] }[] = [
  { title: "Referral & QR", samples: [
    { id: "study-ad", title: "Study materials ad", result: "Block", description: "The banner asks readers to scan a WeChat code for study materials. The referral check flagged the original crop. The displayed image masks the code and account name.",
      alt: "Chinese study materials promotion with its QR code and account name covered", credit: "CSDN · article 144385444, redacted excerpt" },
    { id: "travel-poster", title: "Yangtze Gorges travel poster", result: "Allow", description: "This illustrated travel advertisement also contains promotional text. All four checks passed on its square crop.",
      alt: "Vintage Yangtze Gorges travel poster with a river illustration and printed lettering", credit: "Butterfield & Swire · Library of Congress", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Beauty_and_grandeur,_the_Yangtze_gorges,_travel_poster,_ca._1930.jpg" },
  ] },
  { title: "Visible injury", samples: [
    { id: "scraped-knee", title: "Uncovered knee abrasion", result: "Block", description: "A small area of scraped skin and visible blood triggered the injury check.",
      alt: "A close-up of a scraped knee with a small amount of visible blood", credit: "Editor B · Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Scraped_Knee.jpg", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/" },
    { id: "bandaged-knee", title: "Knee with an adhesive bandage", result: "Allow", description: "The bandage covers the abrasion in this separate photograph. All four checks passed.",
      alt: "An adhesive bandage on a knee", credit: "© Friedrich Haag / Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Erste_Hilfe_001_2023_09_03.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
  ] },
];

export function AvatarExamples() {
  const [index, setIndex] = useState(0);
  const [fullFrame, setFullFrame] = useState(false);
  return <div className="exercise-demo avatar-demo">
    <div className="demo-controls" role="group" aria-label="Compare model decisions">
      {comparisons.map((group,i) => <button type="button" key={group.title} aria-pressed={index === i} onClick={() => setIndex(i)}>{group.title}</button>)}
    </div>
    <label className="frame-toggle"><input type="checkbox" checked={fullFrame} onChange={(event) => setFullFrame(event.target.checked)} /> Show full frames</label>
    <div className="avatar-pair" aria-live="polite">
      {comparisons[index].samples.map((sample) => <figure key={sample.id}>
        <img src={`/media/avatar-review/${sample.id}${fullFrame ? "" : "-crop"}.webp`} alt={sample.alt} width={400} height={400} />
        <figcaption>
          <strong className={sample.result === "Block" ? "blocked" : "allowed"}>{sample.result}</strong>
          <h3>{sample.title}</h3>
          <p>{sample.description}</p>
          <small>{sample.source ? <a href={sample.source}>{sample.credit}</a> : sample.credit}
            {sample.license && <> · {sample.licenseUrl ? <a href={sample.licenseUrl}>{sample.license}</a> : sample.license}</>}
          </small>
        </figcaption>
      </figure>)}
    </div>
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
