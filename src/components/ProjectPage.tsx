import Link from "next/link";
import { type Project, type System, projects } from "../data/projects";
import manifest from "../data/media.generated.json";
import { Gallery, type MediaItem } from "./MediaViewer";
import { ChapterNav, Icon } from "./Navigation";
import { Diagram } from "./Diagrams";
import { AvatarErrors, AvatarExamples, AvatarMetrics, AvatarModels, BulletinExercise } from "./CaseEvidence";
import { FridayStyles } from "./FridayStyles";
import { CableRoutes } from "./CableRoutes";

const data = manifest as Record<string, MediaItem>;
const scope: Record<string, { title: string; text: string }> = {
  rivering: { title: "Development status", text: "The editor recordings show authoring tools. The gameplay and Niagara clips show their respective in-engine test scenes." },
  wayjia: { title: "Team & credits", text: "I was the programmer and producer. The in-game credits list the contributors to art, writing, music and voice acting." },
  "avatar-review": { title: "Evaluation scope", text: "The four example photos and graphics were scored separately from the 162-image evaluation. The frozen model saw the original center crops. The published injury and referral examples are redacted." },
  "disaster-chatbot": { title: "Exercise data", text: "The screenshots come from the local Django project. The exercise supplies fictional bulletins, model replies, shelter listings, road closures and routing responses. The interface, citation validation, closure check, subscription matching and event history run in the app. The delivery chart is a separate local simulation." },
  "friday-night": { title: "Capture details", text: "The English-language captures use demonstration accounts and a sample film club. The seven watchlist styles share the same group, palette, appearance and desktop viewport. The login screens show the public site." },
};

function ProjectChapter({ system, slug }: { system: System; slug: string }) {
  const gallery = system.media.length > 0 && <Gallery items={system.media.map(id => data[id])} showTitles={system.id === "street-cables"} />;
  const footageFirst = slug === "friday-night" || ["melee-sweep", "street-cables", "three-gorges-mountains", "limestone-cliffs", "landscape-materials", "biomes"].includes(system.id);
  return <section className="project-chapter" id={system.id} tabIndex={-1}>
    <h3>{system.headline}</h3>
    <p className="chapter-summary">{system.summary}</p>
    {footageFirst && gallery}
    {system.paragraphs?.map(paragraph => <p className="chapter-explanation" key={paragraph}>{paragraph}</p>)}
    {system.id === "street-cables" && <CableRoutes />}
    {slug === "friday-night" && system.id === "visual-styles" && <FridayStyles />}
    {slug === "avatar-review" && system.id === "visible-crop" && <AvatarExamples />}
    {slug === "avatar-review" && system.id === "model-selection" && <AvatarModels />}
    {slug === "avatar-review" && system.id === "identity-errors" && <AvatarErrors />}
    {slug === "avatar-review" && system.id === "four-checks" && <AvatarMetrics />}
    {slug === "disaster-chatbot" && system.id === "bulletins" && <BulletinExercise />}
    {!footageFirst && gallery}
    {system.diagram && <Diagram type={system.diagram} />}
    <details className="engineering-detail"><summary>Implementation notes</summary>
      <p>{system.detail}</p><ul className="tags">{system.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
    </details>
  </section>;
}

export function ProjectPage({ project }: { project: Project }) {
  const groups = project.groups ?? [{ id: "chapters", label: "Chapters", systems: project.systems }];
  const next = projects[(projects.findIndex(p => p.slug === project.slug) + 1) % projects.length];
  const notes = scope[project.slug];
  return <main id="main" className={`reader project-${project.slug}`}>
    <ChapterNav slug={project.slug} title={project.title} groups={groups.map(({ id, label, systems }) => ({
      id, label, sections: systems.map(({ id, label }) => ({ id, label })),
    }))} />
    <article className="reader-pane">
      <header id="overview" className="reader-overview" tabIndex={-1}>
        <div className="overview-text">
          <p className="category">{project.category}</p><h1>{project.title}</h1>
          <p className="intro">{project.intro}</p><p>{project.deck}</p>
          <dl className="project-facts"><dt>Role</dt><dd>{project.role}</dd>
            <dt>Context</dt><dd>{project.team}</dd><dt>Period</dt><dd>{project.period}</dd>
            <dt>Tools</dt><dd>{project.tags.join(" · ")}</dd></dl>
          {project.slug === "friday-night" && <a className="command" href="https://fridaynight.love" target="_blank" rel="noopener noreferrer">Visit fridaynight.love ↗</a>}
        </div>
        <Gallery items={[data[project.hero]]} featured />
      </header>
      <div id="systems">
        {groups.map(group => <section className="system-group" id={group.id} key={group.id} aria-labelledby={group.id + "-label"}>
          <h2 className="pane-label" id={group.id + "-label"}><Icon name="folder" />{group.label}</h2>
          {group.systems.map(system => <ProjectChapter key={system.id} system={system} slug={project.slug} />)}
        </section>)}
      </div>
      <aside className="project-note"><h2>{notes.title}</h2><p>{notes.text}</p></aside>
      <div className="reader-end"><Link href={`/?project=${project.slug}#work`}>← Project folders</Link>
        <Link href={`/projects/${next.slug}/`}>Next project · {next.title} →</Link></div>
    </article>
  </main>;
}
