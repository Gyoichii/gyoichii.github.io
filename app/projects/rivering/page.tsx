import type { Metadata } from "next";
import { rivering } from "../../../src/data/projects";
import { ProjectPage } from "../../../src/components/ProjectPage";
export const dynamic = "force-static";
export const metadata: Metadata = {
  alternates: { canonical: "/projects/rivering/" },
  title: "Project Rivering — Combat, Movement & Procedural Worlds",
  description:
    "An independent UE5 action game: C++ combat arbitration, animation-timed melee sweeps, GASP / Mover integration, material work and native PCG buildings.",
  openGraph: {
    url: "/projects/rivering/",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    title: "Project Rivering — Weihan Chen",
    description: "An action game, built from the systems up.",
  },
};
export default function Page() {
  return <ProjectPage project={rivering} />;
}
