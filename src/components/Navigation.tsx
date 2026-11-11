"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState("work");
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  useEffect(() => {
    if (pathname !== "/") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting)
            setSection(
              entry.target.classList.contains("home-hero")
                ? "work"
                : entry.target.id,
            );
      },
      { rootMargin: "-20% 0px -55% 0px" },
    );
    for (const id of ["work", "about", "contact"]) {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    }
    const hero = document.querySelector(".home-hero");
    if (hero) observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);
  const links = [
    { href: "/#work", label: "Work", id: "work" },
    { href: "/#about", label: "About", id: "about" },
    { href: "/#contact", label: "Contact", id: "contact" },
  ];
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="identity" aria-label="Weihan Chen, home">
          <span className="identity-mark" aria-hidden="true">
            ↗
          </span>
          <span>Weihan Chen</span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}{" "}
          <span aria-hidden="true">{open ? "×" : "+"}</span>
        </button>
        <nav
          id="primary-navigation"
          aria-label="Primary"
          className={open ? "is-open" : ""}
        >
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.id}
              onClick={() => setOpen(false)}
              aria-current={
                (pathname !== "/" && link.id === "work") ||
                (pathname === "/" && section === link.id)
                  ? "location"
                  : undefined
              }
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-resume"
          >
            Résumé <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

type NavGroup = {
  id: string;
  label: string;
  sections: { id: string; label: string }[];
};

export function GroupedProjectNav({ groups }: { groups: NavGroup[] }) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const targets = groups.flatMap((group) => [
      { id: group.id, activeId: group.sections[0].id },
      ...group.sections.map(({ id }) => ({ id, activeId: id })),
    ]).map(({ id, activeId }) => ({ node: document.getElementById(id), activeId }));
    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + 2;
      let current = "";
      for (const { node, activeId } of targets) {
        if (!node) continue;
        if (node.getBoundingClientRect().top > offset) break;
        current = activeId;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [groups]);

  return (
    <nav className="system-nav" aria-label="Project chapters">
      <div className="system-tree">
        {groups.map((group) => (
          <div key={group.id}>
            <a className="system-tree-group" href={`#${group.id}`}>{group.label}</a>
            <ul>{group.sections.map((section) => (
              <li key={section.id}><a href={`#${section.id}`}
                aria-current={active === section.id ? "location" : undefined}>{section.label}</a></li>
            ))}</ul>
          </div>
        ))}
      </div>
      <label className="system-picker">
        <span>Section</span>
        <select value={active} onChange={(event) => {
          const id = event.target.value;
          const target = document.getElementById(id);
          if (!target) return;
          window.location.hash = id;
          target.focus({ preventScroll: true });
          target.scrollIntoView();
        }}>
          <option value="" disabled>Choose a section</option>
          {groups.map((group) => (
            <optgroup key={group.id} label={group.label}>
              {group.sections.map((section) => <option key={section.id} value={section.id}>{section.label}</option>)}
            </optgroup>
          ))}
        </select>
      </label>
    </nav>
  );
}
export function ProjectNav({
  sections,
}: {
  sections: { id: string; label: string }[];
}) {
  const [active, setActive] = useState(sections[0]?.id);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    for (const section of sections) {
      const node = document.getElementById(section.id);
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, [sections]);
  return (
    <nav className="project-nav" aria-label="Project chapters">
      <span className="eyebrow">On this page</span>
      {sections.map((section, i) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          aria-current={active === section.id ? "location" : undefined}
        >
          <span>{String(i + 1).padStart(2, "0")}</span>
          {section.label}
        </a>
      ))}
    </nav>
  );
}
