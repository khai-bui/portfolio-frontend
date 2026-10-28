import { useEffect, useState } from "react";
import { FaGithub, FaLinkedinIn, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { api } from "../api/client";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [avatarOk, setAvatarOk] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/profile"),
      api.get("/api/projects"),
      api.get("/api/skills"),
    ])
      .then(([profile, projects, skills]) =>
        setData({
          profile: (Array.isArray(profile) ? profile[0] : profile) ?? {},
          projects,
          skills,
        })
      )
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">Could not load data: {error}</p>;
  if (!data) return <main className="site"><p className="muted">Loading...</p></main>;

  const { profile, projects, skills } = data;

  const byCategory = skills.reduce((acc, s) => {
    (acc[s.category] ||= []).push(s);
    return acc;
  }, {});

  const initials = (profile.name || "?")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();

  return (
    <main className="site">
      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-text">
          <h1>
            Hi, I'm <span className="gradient-text">{profile.name || "there"}</span>
          </h1>
          {profile.headline && <h2 className="hero-headline">{profile.headline}</h2>}
          {profile.bio && <p className="hero-bio">{profile.bio}</p>}
          {profile.location && (
            <p className="muted hero-location">
              <FaMapMarkerAlt /> {profile.location}
            </p>
          )}

          <div className="hero-actions">
            <a
              className="btn btn-primary"
              href={profile.email ? `mailto:${profile.email}` : "#contact"}
            >
              Hire Me
            </a>
            <a className="btn btn-outline" href="#projects">View Work</a>
          </div>

          <div className="socials">
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <FaGithub />
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} aria-label="Email">
                <FaEnvelope />
              </a>
            )}
          </div>
        </div>

        <div className="hero-photo">
        <div className="avatar">
          {avatarOk ? (
            <img
              src="/avatar.jpg"
              alt={profile.name || "Avatar"}
              onError={() => setAvatarOk(false)}
            />
          ) : (
            <div className="avatar-fallback">{initials}</div>
          )}
        </div>
      </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="section">
        <h2 className="section-title">Skills</h2>
        {skills.length === 0 ? (
          <p className="muted center">No skills yet.</p>
        ) : (
          <div className="skill-groups">
            {Object.entries(byCategory).map(([category, list]) => (
              <div key={category} className="skill-card">
                <h3>{category}</h3>
                {list.map((s) => {
                  const level = Math.min(5, Math.max(0, Number(s.level) || 0));
                  return (
                    <div key={s.id} className="skill-row">
                      <div className="skill-head">
                        <span>{s.name}</span>
                        <span className="muted">{level}/5</span>
                      </div>
                      <div className="bar">
                        <span style={{ width: `${(level / 5) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section">
        <h2 className="section-title">Projects</h2>
        {projects.length === 0 ? (
          <p className="muted center">No projects yet.</p>
        ) : (
          <div className="grid">
            {projects.map((p) => (
              <article key={p.id} className="card">
                <img 
                  src={p.imageUrl}
                  alt={p.title} 
                />
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="card-links">
                  {p.githubUrl && (
                    <a className="btn btn-outline btn-small" href={p.githubUrl} target="_blank" rel="noreferrer">
                      Code
                    </a>
                  )}
                  {p.demoUrl && (
                    <a className="btn btn-primary btn-small" href={p.demoUrl} target="_blank" rel="noreferrer">
                      Demo
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CONTACT */}
      <section id="contact" className="section contact">
        <h2 className="section-title">Let's work together</h2>
        <p className="muted">
          I'm looking for a backend internship. Feel free to reach out.
        </p>
        {profile.email && (
          <a className="btn btn-primary" href={`mailto:${profile.email}`}>Email me</a>
        )}
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </main>
  );
}