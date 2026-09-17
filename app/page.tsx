import Link from "next/link";
import { projects } from "../src/data/projects";
import { ProjectCard } from "../src/components/ProjectCard";
export const metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <main id="main">
      <section className="home-hero wrap">
        <div className="hero-topline">
          <p className="eyebrow">
            <span className="status-dot" /> GAMEPLAY / SOFTWARE ENGINEER
          </p>
          <span className="eyebrow hero-location">
            ATLANTA, GA · GEORGIA TECH
          </span>
        </div>
        <h1>
          Weihan Chen<span className="accent">.</span>
        </h1>
        <div className="hero-lower">
          <h2>
            I build the systems
            <br />
            that make worlds <em>work.</em>
          </h2>
          <div>
            <p>
              Gameplay with intent. Procedural places.
              <br />
              Software that brings people together.
            </p>
            <div className="hero-actions">
              <Link href="/projects/rivering" className="button button-accent">
                View Rivering <span aria-hidden="true">↗</span>
              </Link>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                View résumé ↗
              </a>
            </div>
          </div>
        </div>
        <div className="hero-bottom">
          <a href="#work" className="eyebrow">
            SCROLL TO EXPLORE <span aria-hidden="true">↓</span>
          </a>
          <div>
            <a
              href="https://github.com/Gyoichii"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
            <a href="#contact">Get in touch ↗</a>
          </div>
        </div>
      </section>
      <section className="selected-work wrap" id="work">
        <div className="section-heading">
          <span className="eyebrow">01 / SELECTED WORK</span>
          <div>
            <h2>
              Three projects.
              <br />
              Different kinds of engineering.
            </h2>
            <p>
              From the frame-by-frame details of combat
              <br />
              to the state behind a shared movie night.
            </p>
          </div>
        </div>
        <ProjectCard project={projects[0]} featured />
        <div className="secondary-projects">
          <ProjectCard project={projects[1]} />
          <ProjectCard project={projects[2]} />
        </div>
      </section>
      <section id="about" className="about-section wrap">
        <div className="section-heading">
          <span className="eyebrow">02 / THE APPROACH</span>
          <h2>
            Technical depth.
            <br />
            <em>Creative range.</em>
          </h2>
        </div>
        <div className="about-intro">
          <p>
            I’m Weihan, a Computational Media student at Georgia Tech. I build
            gameplay systems, the tools around them, and web applications with a
            purpose.
          </p>
          <p>
            I like work where the details have something to do with the
            experience: how an attack connects, how a building comes together,
            or how a group makes a decision.
          </p>
        </div>
        <div className="focus-grid">
          <article>
            <span className="focus-symbol" aria-hidden="true">
              [ → ]
            </span>
            <h3>Gameplay systems</h3>
            <p>
              Combat state, movement, collision and animation working as one
              interaction.
            </p>
            <span className="eyebrow">C++ / UE5 / GAS / MOVER</span>
          </article>
          <article>
            <span className="focus-symbol" aria-hidden="true">
              [ + ]
            </span>
            <h3>Worlds & tooling</h3>
            <p>
              Modular assets, procedural buildings and material controls that
              support iteration.
            </p>
            <span className="eyebrow">PCG / PYTHON / BLENDER</span>
          </article>
          <article>
            <span className="focus-symbol" aria-hidden="true">
              [ / ]
            </span>
            <h3>Software engineering</h3>
            <p>
              Web applications and backend systems built around a clear user
              workflow.
            </p>
            <span className="eyebrow">PYTHON / FASTAPI / SQL</span>
          </article>
        </div>
        <div className="education">
          <span className="eyebrow">EDUCATION</span>
          <div>
            <h3>Georgia Institute of Technology</h3>
            <p>B.S. Computational Media · Expected Dec 2027</p>
            <span>GPA 3.83 / 4.00</span>
          </div>
          <div>
            <h3>University of Utah</h3>
            <p>Previous undergraduate study in Games</p>
            <span>GPA 4.00 / 4.00</span>
          </div>
        </div>
        <div className="skills-line">
          <span className="eyebrow">ALSO IN THE TOOLBOX</span>
          <p>
            C · Java · Django · SQLite · Git · Unreal Blueprint · Enhanced Input
          </p>
        </div>
      </section>
      <section id="contact" className="contact-section wrap">
        <p className="eyebrow">03 / LET’S TALK</p>
        <div className="contact-heading">
          <h2>
            Good work starts
            <br />
            with a <em>conversation.</em>
          </h2>
          <span className="contact-arrow" aria-hidden="true">
            ↗
          </span>
        </div>
        <p>
          Gameplay, tools, or software. I’d like to hear what you’re building.
        </p>
        <a className="email-link" href="mailto:weihan.chen.dev@outlook.com">
          weihan.chen.dev@outlook.com <span aria-hidden="true">↗</span>
        </a>
        <div className="contact-links">
          <a
            href="https://github.com/Gyoichii"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            View résumé ↗
          </a>
          <span>Based in Atlanta, GA</span>
        </div>
      </section>
    </main>
  );
}
