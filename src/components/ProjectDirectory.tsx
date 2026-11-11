"use client";

import Link from "next/link";
import { useState } from "react";
import { type Project, projects } from "../data/projects";
import manifest from "../data/media.generated.json";
import { MediaPreview, type MediaItem } from "./MediaViewer";

const groups = [
  { name: "Unreal Engine", slugs: ["rivering"] },
  { name: "Software & ML", slugs: ["friday-night", "avatar-review", "disaster-chatbot"] },
  { name: "Games", slugs: ["wayjia"] },
];

export function ProjectDirectory() {
  const [selected, setSelected] = useState<Project>(projects[0]);
  const item = (manifest as Record<string, MediaItem>)[selected.hero];
  return (
    <section className="directory wrap" id="work" aria-label="Project directory">
      <div className="directory-bar"><span className="folder-icon" aria-hidden="true" />Project directory</div>
      <div className="directory-layout">
        <nav className="directory-tree" aria-label="Browse projects">
          {groups.map((group) => (
            <div className="tree-group" key={group.name}>
              <h2><span className="folder-icon" aria-hidden="true" />{group.name}</h2>
              {group.slugs.map((slug) => {
                const project = projects.find((p) => p.slug === slug)!;
                return <button key={slug} type="button" aria-pressed={selected.slug === slug}
                  aria-controls="project-preview" onClick={() => setSelected(project)}>
                  {project.title}
                </button>;
              })}
            </div>
          ))}
        </nav>
        <div id="project-preview" className="directory-preview" key={selected.slug}>
          <Link href={`/projects/${selected.slug}/`} className="directory-image" aria-label={`Open ${selected.title}`}>
            <MediaPreview item={item} paused priority />
          </Link>
          <div className="preview-description">
            <h2>{selected.title}</h2>
            <p>{selected.cardSummary}</p>
            <Link className="classic-button" href={`/projects/${selected.slug}/`}>Open project <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </div>
      <nav className="directory-status" aria-label="Jump to a project chapter">
        {selected.systems.slice(0, 6).map((section) => <Link key={section.id} href={`/projects/${selected.slug}/#${section.id}`}>{section.label}</Link>)}
      </nav>
    </section>
  );
}
