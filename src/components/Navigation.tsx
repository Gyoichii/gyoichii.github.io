"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { projects } from "../data/projects";

export function Icon({ name }: { name: "computer" | "folder" | "film" | "mail" | "network" }) {
  return <img className="pixel-icon" src={`/icons/${name}.svg`} alt="" width="20" height="20" />;
}

export function Navigation() {
  const pathname = usePathname();
  const current = projects.find((project) => pathname.split("/")[2] === project.slug);
  const [wide, setWide] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("wide-window", wide);
    return () => document.documentElement.classList.remove("wide-window");
  }, [wide]);
  return <header className="window-header">
    <div className="title-bar">
      <Link href="/"><Icon name="computer" />Weihan Chen — Portfolio Explorer</Link>
      <button type="button" className="window-size" aria-pressed={wide}
        aria-label={wide ? "Restore window width" : "Maximize window width"}
        title={wide ? "Restore window width" : "Maximize window width"} onClick={() => setWide(!wide)}>
        <span aria-hidden="true" />
      </button>
    </div>
    <nav className="tool-strip" aria-label="Primary">
      <Link href="/#work"><Icon name="folder" />Projects</Link>
      <Link href="/#about"><Icon name="computer" />About</Link>
      <Link href="/#contact"><Icon name="mail" />Contact</Link>
      <a className="resume-link" href="/resume.pdf" target="_blank" rel="noopener noreferrer">Résumé ↗</a>
    </nav>
    <nav className="address" aria-label="Breadcrumb">
      <span>Address</span><ol><li><Icon name="computer" /><Link href="/">Portfolio</Link></li>
        {current && <li><Link href="/#work">Projects</Link></li>}
        <li aria-current="page">{current?.title ?? (pathname === "/" ? "Projects" : "Page not found")}</li>
      </ol>
    </nav>
  </header>;
}

type Section = { id: string; label: string };
export type NavGroup = { id: string; label: string; sections: Section[] };
export function ChapterNav({ groups, title, slug }: { groups: NavGroup[]; title: string; slug: string }) {
  const [active, setActive] = useState("overview");
  useEffect(() => {
    const sections = ["overview", ...groups.flatMap(g => g.sections.map(s => s.id))].map(id => document.getElementById(id));
    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + 4;
      let id = "overview";
      for (const section of sections) {
        if (!section) continue;
        if (section.getBoundingClientRect().top > offset) break;
        id = section.id;
      }
      setActive(id);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
    };
  }, [groups]);
  return <nav className="chapter-nav" aria-label="Project chapters">
    <div className="tree-window">
      <div className="pane-label"><Icon name="folder" />Contents</div>
      <div className="tree-list">
        <a className="tree-overview" href="#overview" aria-current={active === "overview" ? "location" : undefined}>{title}</a>
        {groups.map(group => <div className="chapter-branch" key={group.id}>
          <a className="branch-label" href={`#${group.id}`}><Icon name="folder" />{group.label}</a>
          <ul>{group.sections.map(section => <li key={section.id}>
            <a href={`#${section.id}`} aria-current={active === section.id ? "location" : undefined}>{section.label}</a>
          </li>)}</ul>
        </div>)}
      </div>
      <Link className="tree-back" href={`/?project=${slug}#work`}>← All projects</Link>
    </div>
    <div className="chapter-select">
      <Link className="up-folder" href={`/?project=${slug}#work`} aria-label="Back to project folders"><Icon name="folder" />↑</Link>
      <label htmlFor="chapter-picker">Chapter</label>
      <select id="chapter-picker" value={active} onChange={event => {
        const target = document.getElementById(event.target.value);
        if (!target) return;
        window.location.hash = target.id;
        target.focus({ preventScroll: true });
        target.scrollIntoView();
      }}>
        <option value="overview">{title} · Overview</option>
        {groups.map(group => <optgroup key={group.id} label={group.label}>
          {group.sections.map(section => <option key={section.id} value={section.id}>{section.label}</option>)}
        </optgroup>)}
      </select>
    </div>
  </nav>;
}
