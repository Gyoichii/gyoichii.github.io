import type { Metadata } from "next";
import { friday } from "../../../src/data/projects";
import { ProjectPage } from "../../../src/components/ProjectPage";
export const dynamic = "force-static";
export const metadata: Metadata = {
  alternates: { canonical: "/projects/friday-night/" },
  title: "Friday Night — Shared Watchlists & Watch Parties",
  description:
    "Browse a DVD shelf and filmstrip, then join friends in a shared 3D room to watch a film. A project by Weihan Chen.",
  openGraph: {
    url: "/projects/friday-night/",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    title: "Friday Night — Weihan Chen",
    description:
      "Shared watchlists, a virtual DVD shelf, and synchronized playback in 3D rooms.",
  },
};
export default function Page() {
  return <ProjectPage project={friday} />;
}
