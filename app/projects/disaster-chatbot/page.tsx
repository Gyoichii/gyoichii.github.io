import { disaster } from "../../../src/data/projects";
import { ProjectPage } from "../../../src/components/ProjectPage";
export const metadata = {
  title: "Disaster Chatbot",
  description: disaster.cardSummary,
  alternates: { canonical: "/projects/disaster-chatbot/" },
};
export default function Page() {
  return <ProjectPage project={disaster} />;
}
