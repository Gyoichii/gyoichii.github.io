"use client";

import { useState } from "react";

type AvatarSample = {
  id: string; title: string; result: "Block" | "Allow"; description: string;
  frameSize: [number,number]; flag?: "Injury" | "Referral";
  alt: string; credit: string; source?: string; license?: string; licenseUrl?: string;
};
const comparisons: { title: string; samples: AvatarSample[] }[] = [
  { title: "Referral & QR", samples: [
    { id: "study-ad", title: "Study materials ad", frameSize: [640,360], flag: "Referral", result: "Block", description: "The banner asks readers to scan a WeChat code for study materials. The referral check flagged the original crop. The displayed image masks the code and account name.",
      alt: "Chinese study materials promotion with its QR code and account name covered", credit: "CSDN · article 144385444, redacted excerpt" },
    { id: "travel-poster", title: "Yangtze Gorges travel poster", frameSize: [299,480], result: "Allow", description: "This illustrated travel advertisement also contains promotional text. All four checks passed on its square crop.",
      alt: "Vintage Yangtze Gorges travel poster with a river illustration and printed lettering", credit: "Butterfield & Swire · Library of Congress", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Beauty_and_grandeur,_the_Yangtze_gorges,_travel_poster,_ca._1930.jpg" },
  ] },
  { title: "Visible injury", samples: [
    { id: "scraped-knee", title: "Uncovered knee abrasion", frameSize: [640,355], flag: "Injury", result: "Block", description: "The original crop triggered the injury check. Both published views are pixelated.",
      alt: "Pixelated injury example with the wound details obscured", credit: "Editor B · Wikimedia Commons · pixelated here", source: "https://commons.wikimedia.org/wiki/File:Scraped_Knee.jpg", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/" },
    { id: "bandaged-knee", title: "Knee with an adhesive bandage", frameSize: [629,480], result: "Allow", description: "The bandage covers the abrasion in this separate photograph. All four checks passed.",
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
    {fullFrame && <small className="crop-key">The outlined square is the region the model reviewed.</small>}
    <div className="avatar-pair" aria-live="polite">
      {comparisons[index].samples.map((sample) => <figure key={sample.id}>
        <div className="review-frame">
          <img src={`/media/avatar-review/${sample.id}${fullFrame ? "" : "-crop"}.webp${sample.id === "scraped-knee" ? "?view=pixelated" : ""}`} alt={sample.alt} width={400} height={400} />
          {fullFrame && <span aria-hidden="true" className="crop-outline" style={{width:`${100*Math.min(...sample.frameSize)/Math.max(...sample.frameSize)}%`}} />}
        </div>
        <figcaption>
          <strong className={sample.result === "Block" ? "blocked" : "allowed"}>{sample.result}</strong>
          <h3>{sample.title}</h3>
          <p>{sample.description}</p>
          <ul className="avatar-signals" aria-label="Recorded category outputs">
            {["Explicit", "Injury", "Referral", "Identity"].map(label => {
              const triggered = sample.flag === label;
              return <li key={label} className={triggered ? "triggered" : undefined}><span aria-hidden="true">{triggered ? "●" : "○"}</span> {label}<span className="signal-text">{triggered ? " flagged" : " clear"}</span></li>;
            })}
          </ul>
          <small>{sample.source ? <a href={sample.source}>{sample.credit}</a> : sample.credit}
            {sample.license && <> · {sample.licenseUrl ? <a href={sample.licenseUrl}>{sample.license}</a> : sample.license}</>}
          </small>
        </figcaption>
      </figure>)}
    </div>
  </div>;
}

const modelPaths = [
  {label:"Explicit content", features:"Frozen SigLIP vision features from the avatar crop", classifier:"Linear support vector classifier", why:"The decision depends on what remains visible after cropping. We fitted a separate classifier to reviewed crops so its boundary could be adjusted independently of the injury check."},
  {label:"Violence or injury", features:"Frozen visual features and signals from the injury detector", classifier:"Linear support vector classifier", why:"An uncovered abrasion and a bandaged knee share a subject. Labels follow the visible injury. On the evaluation set this branch caught all three positive cases and incorrectly flagged three negatives."},
  {label:"Referral or QR", features:"SigLIP 2 image features, RapidOCR text and QR decoding", classifier:"Visual and text classifiers plus decoded-code evidence", why:"The ad and the travel poster both have prominent lettering. Reading the invitation and checking for a machine-readable code supplies evidence that their visual layout alone cannot give. The text model uses character n-grams and logistic regression."},
  {label:"Listed identities", features:"InsightFace reference matches and SigLIP 2 image–text similarity", classifier:"A separate support vector classifier for each listed person", why:"We kept face matching for photographs. For drawings and edits, we also compare the full avatar and four overlapping corner crops with name prompts for listed people and likely lookalikes. Several people can be present in the same image."},
];

export function AvatarModels() {
  const [index,setIndex] = useState(2);
  const branch = modelPaths[index];
  return <div className="exercise-demo avatar-path">
    <div className="demo-controls" role="group" aria-label="Inspect a model branch">{modelPaths.map((m,i) =>
      <button type="button" key={m.label} aria-pressed={i === index} onClick={()=>setIndex(i)}>{m.label}</button>)}</div>
    <div aria-live="polite">
      <ol className="model-path-steps">
        <li><small>Input</small><b>Center square</b><span>256 × 256 avatar, with a higher-resolution view of the same region for detail checks.</span></li>
        <li><small>Evidence</small><b>{branch.features}</b></li>
        <li><small>Decision</small><b>{branch.classifier}</b></li>
      </ol>
      {branch.label === "Listed identities" && <figure className="identity-views">
        <div className="identity-views-strip" aria-hidden="true">
          <span className="whole-avatar" />
          <span style={{backgroundPosition:"left top"}} /><span style={{backgroundPosition:"right top"}} />
          <span style={{backgroundPosition:"left bottom"}} /><span style={{backgroundPosition:"right bottom"}} />
        </div>
        <figcaption>The travel poster illustrates the five views of the same avatar. The complete square is followed by four overlapping corner crops, each spanning about 62% of its width.</figcaption>
      </figure>}
      <p>{branch.why}</p>
    </div>
  </div>;
}

export function AvatarErrors() {
  const [misses,setMisses] = useState(false);
  const n = misses ? 26 : 41;
  const counts = misses ? [4,8] : [19,2];
  return <figure className="exercise-demo avatar-errors">
    <div className="demo-controls" role="group" aria-label="Compare identity errors">
      <button type="button" aria-pressed={!misses} onClick={()=>setMisses(false)}>False blocks</button>
      <button type="button" aria-pressed={misses} onClick={()=>setMisses(true)}>Missed identities</button>
    </div>
    <div aria-live="polite">
      <p className="error-heading">{misses ? "26 crops that contained a listed person" : "41 related images that contained no listed person"}</p>
      {counts.map((count,i) => <div className="error-row" key={i}>
        <span>{i ? "Revised model" : "Earlier model"}</span><div className="error-strip" aria-hidden="true">{Array.from({length:n},(_,j)=><i className={j < count ? "error" : ""} key={j}/>)}</div><b>{count} / {n}</b>
      </div>)}
    </div>
    <figcaption>Each square represents one image. Orange squares count errors. Rows are sorted by outcome.</figcaption>
  </figure>;
}

export function AvatarMetrics() {
  return <div className="avatar-results">
    <table className="case-table outcome-table"><caption>Final decisions on 140 fully labeled crops</caption>
      <thead><tr><th scope="col">Human review</th><th scope="col">Model allowed</th><th scope="col">Model blocked</th></tr></thead>
      <tbody><tr><th scope="row">Should allow · 82</th><td>75</td><td className="outcome-error">7 false blocks</td></tr>
        <tr><th scope="row">Should block · 58</th><td className="outcome-error">9 missed blocks</td><td>49</td></tr></tbody>
    </table>
    <table className="case-table"><caption>Individual checks on the same 162-image set</caption>
      <thead><tr><th scope="col">Check</th><th scope="col">Correct</th><th scope="col">False blocks</th><th scope="col">Misses</th></tr></thead>
      <tbody>{[
        ["Explicit content","161 / 161","0","0"],["Violence or injury","148 / 151","3","0"],
        ["Referral or QR","156 / 159","1","2"],["Listed identities","140 / 151","3","8"],
      ].map(([name,correct,fp,fn]) => <tr key={name}><th scope="row">{name}</th><td>{correct}</td><td>{fp}</td><td>{fn}</td></tr>)}
      </tbody>
    </table>
  </div>;
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
