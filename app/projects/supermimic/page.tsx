import { supermimic } from "../../../src/data/supermimic";
import { ProjectPage } from "../../../src/components/ProjectPage";
export const metadata = {
  title: "Body Control with SuperMimic",
  description: supermimic.cardSummary,
  alternates: { canonical: "/projects/supermimic/" },
};
export default function Page() {
  return <ProjectPage project={supermimic} />;
}
