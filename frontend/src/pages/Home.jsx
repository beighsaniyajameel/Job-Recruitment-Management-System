import { useEffect, useState } from 'react'
import {
  Search,
  MapPin,
  ArrowRight,
  BriefcaseBusiness,
  Users,
  Building2,
  TrendingUp,
} from 'lucide-react'
import api from '../services/api'
import './Home.css'

function Home() {
  const [jobs, setJobs] = useState([])
  const [companies, setCompanies] = useState([])
  const [totalJobs, setTotalJobs] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [jobsResponse, companiesResponse] = await Promise.all([
          api.get('/jobs?limit=100'),
          api.get('/companies'),
        ])

        setJobs(jobsResponse.data.jobs || [])
        setTotalJobs(jobsResponse.data.total || 0)
        setCompanies(companiesResponse.data.companies || [])
      } catch (error) {
        console.error('Failed to fetch home page data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  /*
    Current MongoDB data:
    - 12 Jobs
    - 5 Companies
    - 8 Job Seekers
    - 4 Recruiters
    - 15 Applications
  */

  // Calculate category counts from the jobs received from MongoDB
  const softwareJobs = jobs.filter((job) =>
    [
      'Software Developer',
      'Frontend Developer',
      'Backend Developer',
      'Python Developer',
      'Java Developer',
    ].includes(job.jobTitle)
  ).length

  const dataJobs = jobs.filter((job) =>
    [
      'Data Analyst',
      'Data Scientist',
      'Machine Learning Intern',
      'Data Engineer',
    ].includes(job.jobTitle)
  ).length

  const cloudJobs = jobs.filter((job) =>
    ['Cloud Engineer', 'DevOps Engineer'].includes(job.jobTitle)
  ).length

  const designJobs = jobs.filter((job) =>
    ['UI/UX Designer'].includes(job.jobTitle)
  ).length

  return (
    <main>

      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-background"></div>

        <div className="container hero-container">

          {/* ================= HERO CONTENT ================= */}

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

            {/* ================= SEARCH BOX ================= */}

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

              <button
                className="search-button"
                onClick={() => {
                  window.location.href = '/jobs'
                }}
              >
                Search Jobs
                <ArrowRight size={18} />
              </button>

            </div>

            {/* ================= POPULAR SEARCHES ================= */}

            <p className="popular-searches">
              Popular:

              <span>Software Developer</span>

              <span>Data Analyst</span>

              <span>UI/UX Designer</span>
            </p>

          </div>


          {/* ================= HERO VISUAL ================= */}

          <div className="hero-visual">

            <div className="hero-card-main">

              <div className="hero-card-header">

                <div className="hero-card-icon">
                  <BriefcaseBusiness size={22} />
                </div>

                <div>
                  <strong>Career opportunities</strong>

                  <p>
                    {loading
                      ? 'Loading opportunities...'
                      : `${totalJobs} jobs available`}
                  </p>
                </div>

              </div>


              {/* ================= JOB LIST ================= */}

              {loading ? (

                <div className="opportunity-item">

                  <div className="company-logo">
                    ...
                  </div>

                  <div>
                    <strong>Loading jobs...</strong>
                    <p>Please wait</p>
                  </div>

                </div>

              ) : jobs.length > 0 ? (

                jobs.slice(0, 3).map((job) => (

                  <div
                    className="opportunity-item"
                    key={job._id}
                  >

                    <div className="company-logo">
                      {job.company?.charAt(0)?.toUpperCase() || '?'}
                    </div>

                    <div>

                      <strong>
                        {job.jobTitle}
                      </strong>

                      <p>
                        {job.company} • {job.location}
                      </p>

                    </div>

                    <ArrowRight size={17} />

                  </div>

                ))

              ) : (

                <div className="opportunity-item">

                  <div className="company-logo">
                    !
                  </div>

                  <div>
                    <strong>No jobs available</strong>
                    <p>Check back later</p>
                  </div>

                </div>

              )}

            </div>


            {/* ================= FLOATING STAT ================= */}

            <div className="floating-stat">

              <div className="floating-stat-icon">
                <TrendingUp size={18} />
              </div>

              <div>
                <strong>{totalJobs}</strong>
                <span>Jobs available</span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= STATS ================= */}

      <section className="stats-section">

        <div className="container stats-grid">


          {/* ACTIVE JOBS */}

          <div className="stat-item">

            <div className="stat-icon">
              <BriefcaseBusiness size={21} />
            </div>

            <div>

              <strong>
                {loading ? '...' : totalJobs}
              </strong>

              <span>
                Active Jobs
              </span>

            </div>

          </div>


          {/* COMPANIES */}

          <div className="stat-item">

            <div className="stat-icon">
              <Building2 size={21} />
            </div>

            <div>

              <strong>
                {loading ? '...' : companies.length}
              </strong>

              <span>
                Companies
              </span>

            </div>

          </div>


          {/* JOB SEEKERS */}

          <div className="stat-item">

            <div className="stat-icon">
              <Users size={21} />
            </div>

            <div>

              <strong>
                8
              </strong>

              <span>
                Job Seekers
              </span>

            </div>

          </div>


          {/* APPLICATIONS */}

          <div className="stat-item">

            <div className="stat-icon">
              <TrendingUp size={21} />
            </div>

            <div>

              <strong>
                15
              </strong>

              <span>
                Applications
              </span>

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


            <a
              href="/jobs"
              className="view-all"
            >
              View all jobs
              <ArrowRight size={17} />
            </a>

          </div>


          <div className="category-grid">


            {/* SOFTWARE DEVELOPMENT */}

            <div className="category-card">

              <div className="category-icon">
                <BriefcaseBusiness size={22} />
              </div>

              <h3>
                Software Development
              </h3>

              <p>
                {loading ? '...' : softwareJobs} jobs
              </p>

            </div>


            {/* DATA SCIENCE */}

            <div className="category-card">

              <div className="category-icon">
                <TrendingUp size={22} />
              </div>

              <h3>
                Data Science
              </h3>

              <p>
                {loading ? '...' : dataJobs} jobs
              </p>

            </div>


            {/* CLOUD & DEVOPS */}

            <div className="category-card">

              <div className="category-icon">
                <Building2 size={22} />
              </div>

              <h3>
                Cloud & DevOps
              </h3>

              <p>
                {loading ? '...' : cloudJobs} jobs
              </p>

            </div>


            {/* UI / UX */}

            <div className="category-card">

              <div className="category-icon">
                <Users size={22} />
              </div>

              <h3>
                UI / UX Design
              </h3>

              <p>
                {loading ? '...' : designJobs} jobs
              </p>

            </div>


          </div>

        </div>

      </section>

    </main>
  )
}

export default Home
