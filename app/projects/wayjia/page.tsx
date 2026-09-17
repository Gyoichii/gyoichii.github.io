import type { Metadata } from "next";
import { wayjia } from "../../../src/data/projects";
import { ProjectPage } from "../../../src/components/ProjectPage";
export const dynamic = "force-static";
export const metadata: Metadata = {
  alternates: { canonical: "/projects/wayjia/" },
  title: "WayJia — Game Programming & Production",
  description:
    "A poetic zero-gravity space-exploration game. Weihan Chen was the sole programmer and producer on a three-person core team, implementing physics, game flow and GLSL ES shader adaptation.",
  openGraph: {
    url: "/projects/wayjia/",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    title: "WayJia — Weihan Chen",
    description: "A little spacecraft. A long way home.",
  },
};
export default function Page() {
  return <ProjectPage project={wayjia} />;
}
