"use client";
import Link from "next/link";
import { useState } from "react";
import type { Project } from "../data/projects";
import manifest from "../data/media.generated.json";
import { MediaPreview, type MediaItem } from "./MediaViewer";
export function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const [paused, setPaused] = useState(false);
  const data = manifest as Record<string, MediaItem>;
  const hero = data[project.hero].sources.length
    ? data[project.hero]
    : project.slug === "rivering"
      ? data["rivering/pcg-variants"]
      : data[project.hero];
  return (
    <article
      className={`project-card card-${project.slug} ${featured ? "featured-card" : ""}`}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="project-card-link"
        aria-label={`Explore ${project.title}`}
      >
        <div className="project-card-media">
          <MediaPreview item={hero} paused={paused} />
          <div className="card-image-label">
            <span>
              {project.slug === "rivering"
                ? "DEVELOPMENT STUDY"
                : project.slug === "wayjia"
                  ? "FINAL GAME / 2025"
                  : "LIVE WEB APPLICATION"}
            </span>
            <span>
              {project.slug === "rivering"
                ? "UNREAL ENGINE 5"
                : project.slug === "wayjia"
                  ? "GAMEMAKER"
                  : "PYTHON / FASTAPI"}
            </span>
          </div>
          {project.slug === "rivering" && (
            <div className="card-title-art" aria-hidden="true">
              RIVERING<span>AN INDEPENDENT ACTION GAME</span>
            </div>
          )}
          <span className="card-enter" aria-hidden="true">
            ↗
          </span>
        </div>
        <div className="project-card-info">
          <div>
            <span className="eyebrow">
              {project.number} / {project.category}
            </span>
            <h3>{project.title}</h3>
            <p>{project.cardSummary}</p>
          </div>
          <div className="card-meta">
            <div className="tags">
              {project.tags.slice(0, featured ? 5 : 3).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <span className="text-link">
              Explore project <span aria-hidden="true">↗</span>
            </span>
          </div>
        </div>
      </Link>
      {["video", "gif"].includes(hero.sources[0]?.type) && (
        <button
          type="button"
          className="card-pause"
          onClick={() => setPaused(!paused)}
          aria-pressed={paused}
        >
          {paused ? "Play" : "Pause"} preview {paused ? "▷" : "Ⅱ"}
        </button>
      )}
    </article>
  );
}
