import {
  BriefcaseBusiness,
  Users,
  Target,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import './About.css'

function About() {
  return (
    <main className="about-page">

      {/* Hero */}
      <section className="about-hero">
        <div className="container">

          <p className="section-label">ABOUT CAREERCONNECT</p>

          <h1>
            Connecting talent with
            <span> opportunity.</span>
          </h1>

          <p className="about-hero-text">
            CareerConnect is a recruitment platform designed to make
            finding jobs and discovering talented professionals simpler,
            faster, and more accessible.
          </p>

        </div>
      </section>

      {/* Mission */}
      <section className="about-mission">
        <div className="container about-mission-grid">

          <div className="mission-content">
            <p className="section-label">OUR MISSION</p>

            <h2>Making the recruitment journey simpler.</h2>

            <p>
              CareerConnect brings job seekers and recruiters together
              through a single platform. Job seekers can discover relevant
              opportunities and manage their applications, while recruiters
              can create job postings and manage candidates.
            </p>

            <p>
              Our goal is to create a clear and organized recruitment
              experience for everyone involved.
            </p>

            <Link to="/jobs" className="about-button">
              Explore Jobs
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="mission-card">

            <div className="mission-icon">
              <Target size={28} />
            </div>

            <h3>Our Focus</h3>

            <p>
              Connecting the right candidates with the right
              opportunities through a simple and structured platform.
            </p>

          </div>

        </div>
      </section>

      {/* Features */}
      <section className="about-features">
        <div className="container">

          <div className="about-section-heading">
            <p className="section-label">WHY CAREERCONNECT</p>

            <h2>Built for both sides of recruitment.</h2>

            <p>
              A platform designed around the needs of job seekers
              and recruiters.
            </p>
          </div>

          <div className="about-features-grid">

            <article className="about-feature-card">

              <div className="feature-icon">
                <BriefcaseBusiness size={24} />
              </div>

              <h3>For Job Seekers</h3>

              <p>
                Search for opportunities, view job details, submit
                applications, and track application progress.
              </p>

            </article>

            <article className="about-feature-card">

              <div className="feature-icon">
                <Users size={24} />
              </div>

              <h3>For Recruiters</h3>

              <p>
                Create job postings, review applicants, and manage
                candidates throughout the recruitment process.
              </p>

            </article>

            <article className="about-feature-card">

              <div className="feature-icon">
                <ShieldCheck size={24} />
              </div>

              <h3>Organized Experience</h3>

              <p>
                Keep job postings, applications, candidate information,
                and recruitment activities organized in one place.
              </p>

            </article>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">

          <h2>Ready to find your next opportunity?</h2>

          <p>
            Explore available jobs and take the next step in your
            career journey.
          </p>

          <Link to="/jobs" className="about-cta-button">
            Find Jobs
            <ArrowRight size={17} />
          </Link>

        </div>
      </section>

    </main>
  )
}

export default About