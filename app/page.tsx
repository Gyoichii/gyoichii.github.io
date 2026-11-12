import { ProjectDirectory } from "../src/components/ProjectDirectory";
import { Icon } from "../src/components/Navigation";
export const metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return <main id="main">
    <ProjectDirectory />
    <div className="profile-grid">
      <section id="about" className="profile-panel">
        <h2 className="pane-label"><Icon name="computer" />About Weihan</h2>
        <div className="profile-copy">
          <p>I’m a Computational Media student at Georgia Tech. I develop gameplay systems and procedural worlds in Unreal Engine, build web applications, and evaluate machine learning models. I was the sole programmer and producer on the three-person WayJia team.</p>
          <dl><dt>Georgia Tech</dt><dd>B.S. Computational Media · Expected Dec 2027 · GPA 3.83</dd>
          <dt>University of Utah</dt><dd>Previous undergraduate study in Games · GPA 4.00</dd></dl>
          <details className="profile-skills"><summary>Skills &amp; tools</summary>
            <dl><dt>Gameplay</dt><dd>C++ · UE5 · GAS · Mover · Control Rig · Enhanced Input</dd>
            <dt>Environments</dt><dd>Native PCG · Python · Blender · Unreal Blueprint</dd>
            <dt>Software</dt><dd>Java · Spring Boot · PostgreSQL · FastAPI · Django · SQLite · C · Git</dd></dl>
          </details>
        </div>
      </section>
      <section id="contact" className="profile-panel">
        <h2 className="pane-label"><Icon name="mail" />Contact</h2>
        <div className="profile-copy">
          <p>For gameplay, tools, and software engineering opportunities.</p>
          <a href="mailto:weihan.chen.dev@outlook.com">weihan.chen.dev@outlook.com</a>
          <div className="contact-actions"><a href="https://github.com/Gyoichii" target="_blank" rel="noopener noreferrer"><Icon name="network" />GitHub ↗</a>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">View résumé ↗</a></div>
        </div>
      </section>
    </div>
  </main>;
}
