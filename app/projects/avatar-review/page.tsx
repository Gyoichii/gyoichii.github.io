import { avatar } from "../../../src/data/projects";
import { ProjectPage } from "../../../src/components/ProjectPage";
export const metadata = {
  title: "Avatar Review",
  description: avatar.cardSummary,
  alternates: { canonical: "/projects/avatar-review/" },
};
export default function Page() {
  return <ProjectPage project={avatar} />;
}
