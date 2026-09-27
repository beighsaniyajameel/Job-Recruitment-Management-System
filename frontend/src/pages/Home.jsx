import {
  Search,
  MapPin,
  ArrowRight,
  BriefcaseBusiness,
  Users,
  Building2,
  TrendingUp,
} from 'lucide-react'
import './Home.css'

function Home() {
  return (
    <main>

      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-background"></div>

        <div className="container hero-container">

          <div className="hero-content">

            <div className="hero-label">
              <span className="hero-label-dot"></span>
              Your next opportunity starts here
            </div>

            <h1>
              Find work that
              <span> moves you forward.</span>
            </h1>

            <p className="hero-description">
              Discover meaningful career opportunities from companies
              looking for talented people like you.
            </p>

            {/* Search Box */}

            <div className="job-search">

              <div className="search-field">
                <Search size={20} />

                <div>
                  <label>Job title or keyword</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer"
                  />
                </div>
              </div>

              <div className="search-divider"></div>

              <div className="search-field">
                <MapPin size={20} />

                <div>
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru"
                  />
                </div>
              </div>

              <button className="search-button">
                Search Jobs
                <ArrowRight size={18} />
              </button>

            </div>

            <p className="popular-searches">
              Popular:
              <span>Software Engineer</span>
              <span>Data Analyst</span>
              <span>UI/UX Designer</span>
            </p>

          </div>

          {/* Hero visual */}

          <div className="hero-visual">

            <div className="hero-card-main">

              <div className="hero-card-header">
                <div className="hero-card-icon">
                  <BriefcaseBusiness size={22} />
                </div>

                <div>
                  <strong>Career opportunities</strong>
                  <p>Matched to your skills</p>
                </div>
              </div>

              <div className="opportunity-item">
                <div className="company-logo">T</div>

                <div>
                  <strong>Software Engineer</strong>
                  <p>TechNova • Bengaluru</p>
                </div>

                <ArrowRight size={17} />
              </div>

              <div className="opportunity-item">
                <div className="company-logo">D</div>

                <div>
                  <strong>Data Analyst</strong>
                  <p>DataWorks • Hyderabad</p>
                </div>

                <ArrowRight size={17} />
              </div>

              <div className="opportunity-item">
                <div className="company-logo">C</div>

                <div>
                  <strong>Cloud Engineer</strong>
                  <p>CloudCore • Chennai</p>
                </div>

                <ArrowRight size={17} />
              </div>

            </div>

            <div className="floating-stat">
              <div className="floating-stat-icon">
                <TrendingUp size={18} />
              </div>

              <div>
                <strong>92%</strong>
                <span>Successful matches</span>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ================= STATS ================= */}

      <section className="stats-section">

        <div className="container stats-grid">

          <div className="stat-item">
            <div className="stat-icon">
              <BriefcaseBusiness size={21} />
            </div>

            <div>
              <strong>10,000+</strong>
              <span>Active Jobs</span>
            </div>
          </div>


          <div className="stat-item">
            <div className="stat-icon">
              <Building2 size={21} />
            </div>

            <div>
              <strong>2,500+</strong>
              <span>Companies</span>
            </div>
          </div>


          <div className="stat-item">
            <div className="stat-icon">
              <Users size={21} />
            </div>

            <div>
              <strong>50,000+</strong>
              <span>Job Seekers</span>
            </div>
          </div>


          <div className="stat-item">
            <div className="stat-icon">
              <TrendingUp size={21} />
            </div>

            <div>
              <strong>92%</strong>
              <span>Success Rate</span>
            </div>
          </div>

        </div>

      </section>


      {/* ================= CATEGORIES ================= */}

      <section className="categories-section section">

        <div className="container">

          <div className="section-heading">

            <div>
              <p className="section-label">
                EXPLORE OPPORTUNITIES
              </p>

              <h2>
                Find jobs by category
              </h2>
            </div>

            <a href="/jobs" className="view-all">
              View all jobs
              <ArrowRight size={17} />
            </a>

          </div>


          <div className="category-grid">

            <div className="category-card">
              <div className="category-icon">
                <BriefcaseBusiness size={22} />
              </div>

              <h3>Software Development</h3>

              <p>1,240 jobs</p>
            </div>


            <div className="category-card">
              <div className="category-icon">
                <TrendingUp size={22} />
              </div>

              <h3>Data Science</h3>

              <p>860 jobs</p>
            </div>


            <div className="category-card">
              <div className="category-icon">
                <Building2 size={22} />
              </div>

              <h3>Cloud & DevOps</h3>

              <p>640 jobs</p>
            </div>


            <div className="category-card">
              <div className="category-icon">
                <Users size={22} />
              </div>

              <h3>UI / UX Design</h3>

              <p>420 jobs</p>
            </div>

          </div>

        </div>

      </section>

    </main>
  )
}

export default Home