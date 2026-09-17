import type { Metadata } from "next";
import { friday } from "../../../src/data/projects";
import { ProjectPage } from "../../../src/components/ProjectPage";
export const dynamic = "force-static";
export const metadata: Metadata = {
  alternates: { canonical: "/projects/friday-night/" },
  title: "Friday Night — Collaborative Movie Planning",
  description:
    "A collaborative movie-discovery and planning web application built with Python, FastAPI and SQLAlchemy. A project by Weihan Chen.",
  openGraph: {
    url: "/projects/friday-night/",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    title: "Friday Night — Weihan Chen",
    description:
      "FastAPI movie planning with shared lists, voting, and group-based authorization.",
  },
};
export default function Page() {
  return <ProjectPage project={friday} />;
}
