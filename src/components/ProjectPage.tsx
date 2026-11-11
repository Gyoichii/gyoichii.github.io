import Link from "next/link";
import { type Project, type System, projects } from "../data/projects";
import manifest from "../data/media.generated.json";
import { Gallery, type MediaItem } from "./MediaViewer";
import { GroupedProjectNav, ProjectNav } from "./Navigation";
import { Diagram } from "./Diagrams";
import { AvatarExamples, AvatarMetrics, BulletinExercise } from "./CaseEvidence";
const data = manifest as Record<string, MediaItem>;

function ProjectChapter({ system, slug, index }: { system: System; slug: string; index?: number }) {
  const Heading = index === undefined ? "h3" : "h2";
  return (
    <section className="project-chapter" id={system.id} tabIndex={-1}>
      {index !== undefined && (
        <p className="eyebrow">
          <span className="accent">{String(index + 1).padStart(2, "0")}</span> / {system.label}
        </p>
      )}
      <Heading>{system.headline}</Heading>
      <p className="chapter-summary">{system.summary}</p>
      {slug === "avatar-review" && system.id === "visible-crop" && <AvatarExamples />}
      {slug === "avatar-review" && system.id === "four-checks" && <AvatarMetrics />}
      {slug === "disaster-chatbot" && system.id === "bulletins" && <BulletinExercise />}
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
  );
}

export function ProjectPage({ project }: { project: Project }) {
  const hero = data[project.hero].sources.length
    ? data[project.hero]
    : project.slug === "rivering"
      ? data["rivering/pcg-variants"]
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
          {!project.groups && <span className="project-big-index" aria-hidden="true">
            /{project.number}
          </span>}
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
              Visit fridaynight.love ↗
            </a>
          ) : (
            <a href="#systems" className="text-link">
              Project contents ↓
            </a>
          )}
        </div>
      </div>
      {project.groups ? (
        <div className="system-overview wrap" id="systems">
          <nav className="system-index" aria-label="System directory">
            <h2>System directory</h2>
            {project.groups.map((group) => (
              <div key={group.id}>
                <h3><span className="folder-icon" aria-hidden="true" /><a href={`#${group.id}`}>{group.label}</a></h3>
                <ul>{group.systems.map((system) => (
                  <li key={system.id}><a href={`#${system.id}`}>{system.label}</a></li>
                ))}</ul>
              </div>
            ))}
          </nav>
          <Gallery items={[hero]} featured />
        </div>
      ) : (
        <>
          <div className="project-hero-media wrap">
            <Gallery items={[hero]} featured />
          </div>
          <section id="systems" className="systems-overview wrap">
            <div className="section-heading">
              <span className="eyebrow">Contents</span>
              <h2>
                {project.slug === "wayjia"
                    ? "Programming & production"
                    : project.slug === "avatar-review" ? "Samples & evaluation"
                    : project.slug === "disaster-chatbot" ? "Queries & subscriptions"
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
        </>
      )}
      <div className="project-body wrap">
        {project.groups ? (
          <GroupedProjectNav groups={project.groups.map(({ id, label, systems }) => ({
            id, label, sections: systems.map(({ id, label }) => ({ id, label })),
          }))} />
        ) : (
          <ProjectNav sections={project.systems.map(({ id, label }) => ({ id, label }))} />
        )}
        <div className="project-chapters">
          {project.groups ? project.groups.map((group) => (
            <section className="system-group" id={group.id} key={group.id} aria-labelledby={`${group.id}-title`}>
              <h2 id={`${group.id}-title`}>{group.label}</h2>
              {group.systems.map((system) => (
                <ProjectChapter key={system.id} system={system} slug={project.slug} />
              ))}
            </section>
          )) : project.systems.map((system, i) => (
            <ProjectChapter key={system.id} system={system} slug={project.slug} index={i} />
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
                : project.slug === "avatar-review" ? "Evaluation scope"
                : project.slug === "disaster-chatbot" ? "Exercise data"
                : "Application screenshots"}
          </h2>
          <p>
            {project.slug === "rivering"
              ? "The editor recordings show authoring tools. The gameplay and Niagara clips show their respective in-engine test scenes."
              : project.slug === "wayjia"
                ? "I was the programmer and producer. The in-game credits list the contributors to art, writing, music and voice acting."
                : project.slug === "avatar-review" ? "The two illustrated samples were run separately from the evaluation set. Each percentage uses only images with a usable label for that category."
                : project.slug === "disaster-chatbot" ? "Eastbank, Riverside and the exercise bulletins are fictional. The walkthrough uses the team project’s test data, with an independent local simulation for the delivery benchmark."
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
