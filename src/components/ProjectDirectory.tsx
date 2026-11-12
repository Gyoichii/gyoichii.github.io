"use client";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { projects } from "../data/projects";
import manifest from "../data/media.generated.json";
import { MediaPreview, type MediaItem } from "./MediaViewer";
import { Icon } from "./Navigation";

const folders = [
  { name: "Unreal Engine", slugs: ["rivering"] },
  { name: "Software & ML", slugs: ["friday-night", "avatar-review", "disaster-chatbot"] },
  { name: "Games", slugs: ["wayjia"] },
];
function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener("projectselect", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("projectselect", callback);
  };
}
function selectProject(slug: string) {
  const url = new URL(window.location.href);
  if (url.searchParams.get("project") === slug) return;
  url.searchParams.set("project", slug);
  window.history.pushState(null, "", url);
  window.dispatchEvent(new Event("projectselect"));
}
export function ProjectDirectory() {
  const slug = useSyncExternalStore(subscribe, () => new URLSearchParams(window.location.search).get("project"), () => null);
  const selected = projects.find(p => p.slug === slug) ?? projects[0];
  const base = `/projects/${selected.slug}/`;
  const media = (manifest as Record<string, MediaItem>)[selected.hero];
  const groups = selected.groups ?? [{ id: "systems", label: "Chapters", systems: selected.systems }];
  return <section className="home-browser" id="work" aria-label="Project directory">
    <aside className="folder-pane">
      <div className="pane-label"><Icon name="folder" />Project folders</div>
      <nav className="project-folders" aria-label="Browse projects">
        {folders.map(group => <details open key={group.name}>
          <summary><Icon name="folder" />{group.name}</summary>
          <ul>{group.slugs.map(id => {
            const p = projects.find(project => project.slug === id)!;
            return <li key={id}><button type="button" aria-pressed={selected.slug === id}
              aria-controls="project-preview" onClick={() => selectProject(id)}>{p.title}</button></li>;
          })}</ul>
        </details>)}
      </nav>
      <div className="folder-count">{projects.length} projects</div>
      <label className="mobile-projects">Project
        <select value={selected.slug} onChange={e => selectProject(e.target.value)}>
          {folders.map(group => <optgroup key={group.name} label={group.name}>{group.slugs.map(id =>
            <option key={id} value={id}>{projects.find(p => p.slug === id)!.title}</option>)}</optgroup>)}
        </select>
      </label>
    </aside>
    <div className="preview-pane" id="project-preview">
      <div className="preview-head">
        <div><p className="category">{selected.category}</p><h1>{selected.title}</h1></div>
        <Link className="command primary-command" href={base}>Open project →</Link>
      </div>
      <p className="project-summary">{selected.cardSummary}</p>
      <div className="preview-content">
        <figure className="project-preview-image" key={selected.slug}>
          <Link href={base} aria-label={`Open ${selected.title} overview`}><MediaPreview item={media} paused priority /></Link>
          <figcaption><Icon name={media.sources[0]?.type === "video" ? "film" : "computer"} />{media.title}</figcaption>
        </figure>
        <nav className="contents-list" aria-label={`${selected.title} chapters`}>
          {groups.map(group => <div key={group.id}><h2><Icon name="folder" />{group.label}</h2>
            <ul>{group.systems.map(s => <li key={s.id}><Link href={base + "#" + s.id}>{s.label}</Link></li>)}</ul>
          </div>)}
        </nav>
      </div>
      <div className="preview-meta"><span>{selected.role}</span><span>{selected.period}</span></div>
    </div>
  </section>;
}
