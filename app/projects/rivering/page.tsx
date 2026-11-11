import type { Metadata } from "next";
import { rivering } from "../../../src/data/projects";
import { ProjectPage } from "../../../src/components/ProjectPage";
export const dynamic = "force-static";
export const metadata: Metadata = {
  alternates: { canonical: "/projects/rivering/" },
  title: "Project Rivering — Unreal Engine Systems",
  description:
    "Procedural environments, rendering, combat and character animation in an independent Unreal Engine 5 action game.",
  openGraph: {
    url: "/projects/rivering/",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    title: "Project Rivering — Weihan Chen",
    description:
      "C++ combat systems, GASP / Mover integration, and procedural building generation in Unreal Engine 5.",
  },
};
export default function Page() {
  return <ProjectPage project={rivering} />;
}
