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
