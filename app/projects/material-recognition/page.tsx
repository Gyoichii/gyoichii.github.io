import { ProjectPage } from "../../../src/components/ProjectPage";
import { material } from "../../../src/data/material";

export const metadata = {
  title: material.title,
  description: material.cardSummary,
  alternates: { canonical: "/projects/material-recognition/" },
};

export default function Page() {
  return <ProjectPage project={material} />;
}
