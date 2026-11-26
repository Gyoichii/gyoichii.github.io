import { isomorph } from "../../../src/data/isomorph";
import { ProjectPage } from "../../../src/components/ProjectPage";
export const metadata = {
  title: "Isomorph",
  description: isomorph.cardSummary,
  alternates: { canonical: "/projects/isomorph/" },
};
export default function Page() {
  return <ProjectPage project={isomorph} />;
}
