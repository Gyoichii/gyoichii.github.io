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
            Gameplay systems.
            <br />
            Procedural environments.
            <br />
            <span className="accent">Software.</span>
          </h2>
          <div>
            <p>C++ / Unreal Engine 5 · Python / FastAPI</p>
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
              An Unreal Engine project, a web application,
              <br />
              and a completed GameMaker game.
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
          <span className="eyebrow">02 / ABOUT</span>
          <h2>What I work on</h2>
        </div>
        <div className="about-intro">
          <p>
            I’m Weihan, a Computational Media student at Georgia Tech. I’m
            currently developing Project Rivering, an Unreal Engine 5 action
            game.
          </p>
          <p>
            My work includes C++ combat systems, procedural building tools, and
            Python web applications. I was also the sole programmer and producer
            of WayJia, a three-person game project.
          </p>
        </div>
        <div className="focus-grid">
          <article>
            <span className="focus-symbol" aria-hidden="true">
              [ → ]
            </span>
            <h3>Gameplay systems</h3>
            <p>
              Combat state, action arbitration, animation-timed collision, and
              movement integration.
            </p>
            <span className="eyebrow">C++ / UE5 / GAS / MOVER</span>
          </article>
          <article>
            <span className="focus-symbol" aria-hidden="true">
              [ + ]
            </span>
            <h3>Procedural environments</h3>
            <p>
              Native PCG building generation, Python / Blender asset tools, and
              parameterized materials.
            </p>
            <span className="eyebrow">PCG / PYTHON / BLENDER</span>
          </article>
          <article>
            <span className="focus-symbol" aria-hidden="true">
              [ / ]
            </span>
            <h3>Software engineering</h3>
            <p>
              Backend APIs, relational data, authentication, group permissions,
              and external API integration.
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
        <p className="eyebrow">03 / CONTACT</p>
        <div className="contact-heading">
          <h2>Get in touch</h2>
          <span className="contact-arrow" aria-hidden="true">
            ↗
          </span>
        </div>
        <p>For gameplay, tools, and software engineering opportunities.</p>
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
