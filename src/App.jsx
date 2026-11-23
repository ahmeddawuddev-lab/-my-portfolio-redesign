import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("http://localhost:5000/api/projects");

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error loading projects:", error);
      }
    }

    async function fetchSkills() {
      try {
        const response = await fetch("http://localhost:5000/api/skills");

        if (!response.ok) {
          throw new Error("Failed to fetch skills");
        }

        const data = await response.json();
        setSkills(data);
      } catch (error) {
        console.error("Error loading skills:", error);
      }
    }

    fetchProjects();
    fetchSkills();
  }, []);
  return (
    <div className="portfolio">
      <nav className="navbar">
        <a href="#" className="logo">
          AD<span>.</span>
        </a>

        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact" className="nav-contact">
            Contact Me
          </a>
        </div>
      </nav>
      <main className="hero section-container">
        <div className="hero-content">
          <p className="eyebrow">HELLO, I'M AHMED DAWUD</p>

          <h1>
            Turning ideas into
            <br />
            responsive, full-stack
            <br />
            <span className="gradient-text">web applications.</span>
          </h1>

          <p className="hero-description">
            I'm a Full-Stack Developer with hands-on experience building web
            applications using React, Node.js, Express.js, and MySQL. I enjoy
            turning ideas into practical, responsive, and user-friendly digital
            solutions.
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="button primary-button">
              Explore My Work ↗
            </a>

            <a href="#contact" className="button secondary-button">
              Contact Me
            </a>
          </div>

          <div className="hero-socials">
            <a
              href="https://github.com/ahmeddawuddev-lab"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
            <a
              href="https://www.linkedin.com/in/ahmed-dawud-b6b542442/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="portrait-placeholder">
            <img src="/Ahmed.jpg" alt="Ahmed Dawud - Full-Stack Developer" />
          </div>
          <div className="floating-card">
            <span className="status-dot"></span>
            Available for opportunities
          </div>
        </div>
      </main>
      {/* ABOUT SECTION */}

      {/* ABOUT SECTION */}

      <section id="about" className="about section-container">
        <div className="about-layout">
          <div className="about-content">
            <p className="eyebrow">GET TO KNOW ME</p>

            <h2>
              About <span className="gradient-text">Me.</span>
            </h2>

            <h3>Building meaningful digital experiences.</h3>

            <p>
              I'm a Junior Full-Stack Developer and an Electrical and Computer
              Engineering graduate from the University of Gondar, passionate
              about building modern, responsive, and user-friendly web
              applications.
            </p>

            <p>
              I work with React, JavaScript, Node.js, Express.js, and MySQL to
              develop complete web applications, from frontend interfaces to
              backend services and database integration.
            </p>

            <p>
              I enjoy solving problems, turning ideas into practical solutions,
              and continuously improving my technical skills. I'm looking
              forward to contributing to real-world projects and growing as a
              software engineer.
            </p>
          </div>

          <div className="about-highlight">
            <div className="highlight-card">
              <span className="gradient-text">01</span>
              <h3>Frontend</h3>
              <p>React · JavaScript</p>
            </div>

            <div className="highlight-card">
              <span className="gradient-text">02</span>
              <h3>Backend</h3>
              <p>Node.js · Express.js</p>
            </div>

            <div className="highlight-card">
              <span className="gradient-text">03</span>
              <h3>Database</h3>
              <p>MySQL · SQL</p>
            </div>

            <div className="highlight-card">
              <span className="gradient-text">04</span>
              <h3>Growth</h3>
              <p>Learning · Problem solving</p>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}

      <section id="skills" className="skills section-container">
        <div className="section-heading">
          <p className="eyebrow">WHAT I WORK WITH</p>
          <h2>
            My <span className="gradient-text">Skills.</span>
          </h2>
          <p>
            Technologies and tools I use to build responsive, full-stack web
            applications.
          </p>
        </div>

        <div className="skills-grid">
          {Object.entries(
            skills.reduce((groups, skill) => {
              if (!groups[skill.category]) {
                groups[skill.category] = [];
              }

              groups[skill.category].push(skill.name);
              return groups;
            }, {}),
          ).map(([category, skillNames]) => (
            <div className="skill-card" key={category}>
              <h3>{category}</h3>

              <div className="skill-list">
                {skillNames.map((skillName) => (
                  <span key={skillName}>{skillName}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS SECTION */}

      <section id="projects" className="projects section-container">
        <div className="section-heading">
          <p className="eyebrow">MY RECENT WORK</p>
          <h2>
            Featured <span className="gradient-text">Projects.</span>
          </h2>
          <p>
            Some applications I've built while developing my full-stack skills.
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.id}>
              <div className="project-image">
                <img
                  src={
                    project.image?.startsWith("http")
                      ? project.image
                      : [
                            "chatgpt screen shoot.png",
                            "evangadi forum screen shot.png",
                            "Netflixclone screenshoot.png",
                          ].includes(project.image)
                        ? `/images/${encodeURIComponent(project.image)}`
                        : `http://localhost:5000/uploads/${encodeURIComponent(
                            project.image || "",
                          )}`
                  }
                  alt={`${project.title} screenshot`}
                />
              </div>

              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>

                <div className="project-tech">
                  {project.technologies?.split(",").map((technology, index) => (
                    <span key={index}>{technology.trim()}</span>
                  ))}
                </div>

                <div className="project-links">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub ↗
                    </a>
                  )}

                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noreferrer">
                      Live Demo ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}

      <section id="contact" className="contact">
        <div className="section-container">
          <div className="contact-heading">
            <p className="eyebrow">LET'S CONNECT</p>
            <h2>
              Let's build something{" "}
              <span className="gradient-text">great.</span>
            </h2>
            <p>
              Have an idea, an opportunity, or a project in mind? I'd love to
              hear from you.
            </p>
          </div>

          <div className="contact-layout">
            {/* LEFT: CONTACT INFORMATION */}
            <div className="contact-info">
              <span className="contact-status">
                <span className="contact-status-dot"></span>
                Open to opportunities
              </span>

              <h3>Let's work together.</h3>

              <p className="contact-description">
                I'm a junior full-stack developer passionate about building
                useful, modern web applications. I'm open to junior developer
                roles, collaborations, and freelance opportunities.
              </p>

              <div className="contact-detail">
                <span className="contact-detail-icon">@</span>
                <div>
                  <small>Email me at</small>
                  <a href="mailto:ahmed.dawud.dev@gmail.com">
                    ahmed.dawud.dev@gmail.com
                  </a>
                </div>
              </div>

              <div className="contact-socials">
                <a
                  href="https://github.com/ahmeddawuddev-lab"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub <span>↗</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/ahmed-dawud-b6b542442/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn <span>↗</span>
                </a>
              </div>
            </div>

            {/* RIGHT: CONTACT FORM */}
            <form
              className="contact-form"
              onSubmit={(event) => {
                event.preventDefault();

                const formData = new FormData(event.currentTarget);

                const name = String(formData.get("name"));
                const email = String(formData.get("email"));
                const subject = String(formData.get("subject"));
                const message = String(formData.get("message"));

                const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;

                window.location.href = `mailto:ahmed.dawud.dev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
              }}
            >
              <h3>Send me a message</h3>
              <p>I'll be happy to hear from you.</p>

              <div className="contact-form-row">
                <div className="form-group">
                  <label htmlFor="contact-name">Your name</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email">Your email</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  placeholder="How can we work together?"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">Your message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  placeholder="Tell me about your project or opportunity..."
                  required
                />
              </div>

              <button type="submit" className="contact-submit">
                Send Message <span>↗</span>
              </button>

              <small className="contact-form-note">
                Your message will open in your email application.
              </small>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Ahmed Dawud. All rights reserved.</p>
        <a href="#" className="back-to-top">
          Back to top ↑
        </a>
      </footer>
    </div>
  );
}

export default App;
