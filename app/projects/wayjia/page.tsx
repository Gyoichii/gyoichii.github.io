import type { Metadata } from "next";
import { wayjia } from "../../../src/data/projects";
import { ProjectPage } from "../../../src/components/ProjectPage";
export const dynamic = "force-static";
export const metadata: Metadata = {
  alternates: { canonical: "/projects/wayjia/" },
  title: "WayJia — Game Programming & Production",
  description:
    "Spacecraft physics, game progression and GLSL ES shader adaptation in a three-person GameMaker project.",
  openGraph: {
    url: "/projects/wayjia/",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    title: "WayJia — Weihan Chen",
    description: "Game programming and production for a space-exploration game in GameMaker.",
  },
};
export default function Page() {
  return <ProjectPage project={wayjia} />;
}
