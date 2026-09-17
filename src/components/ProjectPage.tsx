import Link from "next/link";
import { type Project, projects } from "../data/projects";
import manifest from "../data/media.generated.json";
import { Gallery, type MediaItem } from "./MediaViewer";
import { ProjectNav } from "./Navigation";
import { Diagram } from "./Diagrams";
export function ProjectPage({ project }: { project: Project }) {
  const data = manifest as Record<string, MediaItem>;
  const hero = data[project.hero].sources.length
    ? data[project.hero]
    : project.slug === "rivering"
      ? data["rivering/building-study"]
      : data[project.hero];
  const next =
    projects[
      (projects.findIndex((p) => p.slug === project.slug) + 1) % projects.length
    ];
  return (
    <main id="main" className={`project-page project-${project.slug}`}>
      <div className="project-heading wrap">
        <Link href="/#work" className="breadcrumb">
          ← Selected work
        </Link>
        <div className="project-title-row">
          <div>
            <p className="eyebrow">
              <span className="status-dot" />
              {project.category}
            </p>
            <h1>
              {project.title}
              <span className="accent">.</span>
            </h1>
          </div>
          <span className="project-big-index" aria-hidden="true">
            /{project.number}
          </span>
        </div>
        <div className="project-deck">
          <h2>{project.intro}</h2>
          <p>{project.deck}</p>
        </div>
        <div className="project-facts">
          <div>
            <span>ROLE</span>
            {project.role}
          </div>
          <div>
            <span>CONTEXT</span>
            {project.team}
          </div>
          <div>
            <span>WHEN</span>
            {project.period}
          </div>
          {project.slug === "friday-night" ? (
            <a
              href="https://fridaynight.love"
              target="_blank"
              rel="noopener noreferrer"
              className="button button-accent"
            >
              Visit live site ↗
            </a>
          ) : (
            <a href="#systems" className="text-link">
              Explore the systems ↓
            </a>
          )}
        </div>
      </div>
      <div className="project-hero-media wrap">
        <Gallery items={[hero]} featured />
      </div>
      <section id="systems" className="systems-overview wrap">
        <div className="section-heading">
          <span className="eyebrow">THE QUICK READ</span>
          <h2>
            {project.slug === "rivering"
              ? "Selected engineering systems."
              : project.slug === "wayjia"
                ? "Programming & production"
                : "Backend & application features"}
          </h2>
        </div>
        <div className="overview-grid">
          {project.systems.map((system, i) => (
            <a href={`#${system.id}`} key={system.id}>
              <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
              <h3>{system.label}</h3>
              <span aria-hidden="true">↘</span>
            </a>
          ))}
        </div>
        <div className="tags project-stack">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </section>
      <div className="project-body wrap">
        <ProjectNav
          sections={project.systems.map(({ id, label }) => ({ id, label }))}
        />
        <div className="project-chapters">
          {project.systems.map((system, i) => (
            <section className="project-chapter" id={system.id} key={system.id}>
              <p className="eyebrow">
                <span className="accent">{String(i + 1).padStart(2, "0")}</span>{" "}
                / {system.label}
              </p>
              <h2>{system.headline}</h2>
              <p className="chapter-summary">{system.summary}</p>
              <div className="tags">
                {system.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              {system.diagram && <Diagram type={system.diagram} />}
              <details className="engineering-detail">
                <summary>
                  Implementation notes <span aria-hidden="true">+</span>
                </summary>
                <p>{system.detail}</p>
              </details>
              {system.media.length > 0 && (
                <Gallery items={system.media.map((id) => data[id])} />
              )}
            </section>
          ))}
        </div>
      </div>
      <section className="project-closing wrap">
        <div>
          <p className="eyebrow">
            {project.slug === "rivering"
              ? "ONGOING DEVELOPMENT"
              : "PROJECT NOTES"}
          </p>
          <h2>
            {project.slug === "rivering"
              ? "Development status"
              : project.slug === "wayjia"
                ? "Team & credits"
                : "Application screenshots"}
          </h2>
          <p>
            {project.slug === "rivering"
              ? "This case study reflects the source available in September 2026. New gameplay captures and environment studies will follow as the game develops."
              : project.slug === "wayjia"
                ? "Programming and production were my responsibilities. The game’s identity also belongs to the artists, writers, musicians and voice contributors who helped make it."
                : "Screenshots show movie lists, search, discussion, group administration, and notifications in the original Chinese-language interface. Invite codes, account names, and private comment text are redacted."}
          </p>
        </div>
        <a href="mailto:weihan.chen.dev@outlook.com" className="button">
          Get in touch ↗
        </a>
      </section>
      <Link href={`/projects/${next.slug}`} className="next-project wrap">
        <span className="eyebrow">NEXT PROJECT / {next.number}</span>
        <span>{next.title}</span>
        <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}
