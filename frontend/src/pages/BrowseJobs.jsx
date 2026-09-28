import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import {
  Search,
  MapPin,
  SlidersHorizontal,
  BriefcaseBusiness,
  Clock3,
  ChevronDown,
  ArrowRight,
  X,
} from 'lucide-react'
import './BrowseJobs.css'

const demoJobs = [
  {
    id: 1,
    title: 'Software Engineer',
    company: 'TechNova Solutions',
    location: 'Bengaluru',
    type: 'Full-time',
    experience: 'Fresher',
    salary: '₹6–10 LPA',
    skills: ['Python', 'React', 'MongoDB'],
    posted: '2 days ago',
  },
  {
    id: 2,
    title: 'Data Analyst',
    company: 'DataWorks',
    location: 'Hyderabad',
    type: 'Full-time',
    experience: '1–3 years',
    salary: '₹5–8 LPA',
    skills: ['SQL', 'Python', 'Power BI'],
    posted: '3 days ago',
  },
  {
    id: 3,
    title: 'Frontend Developer',
    company: 'PixelCraft',
    location: 'Bengaluru',
    type: 'Full-time',
    experience: '1–3 years',
    salary: '₹7–11 LPA',
    skills: ['React', 'JavaScript', 'CSS'],
    posted: '1 day ago',
  },
  {
    id: 4,
    title: 'Cloud Engineer',
    company: 'CloudCore Technologies',
    location: 'Chennai',
    type: 'Full-time',
    experience: '1–3 years',
    salary: '₹7–12 LPA',
    skills: ['AWS', 'Docker', 'Linux'],
    posted: '5 days ago',
  },
  {
    id: 5,
    title: 'Cybersecurity Intern',
    company: 'SecureNet',
    location: 'Pune',
    type: 'Internship',
    experience: 'Fresher',
    salary: '₹20K–30K/month',
    skills: ['Networking', 'Python', 'Security'],
    posted: '4 days ago',
  },
  {
    id: 6,
    title: 'Backend Developer',
    company: 'CodeSphere',
    location: 'Mumbai',
    type: 'Full-time',
    experience: '3–5 years',
    salary: '₹10–16 LPA',
    skills: ['Node.js', 'Express', 'MongoDB'],
    posted: '1 week ago',
  },
]

const recruiterJobs = JSON.parse(localStorage.getItem('recruiterJobs')) || []

function BrowseJobs() {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState([])
  const [experience, setExperience] = useState([])
  const [sortBy, setSortBy] = useState('relevance')

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs')

      const formattedJobs = (response.data.jobs || []).map((job) => ({
        id: job._id,
        title: job.jobTitle,
        company: job.company,
        location: job.location,
        type: job.jobType,
        experience: job.experience,
        salary: `₹${(job.salary / 100000).toFixed(1)} LPA`,
        skills: job.skills || [],
        description: job.description,
        posted: new Date(job.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
  }),
}))

      setJobs(formattedJobs)
    } catch (err) {
      console.error('Failed to fetch jobs:', err)
      setError('Unable to load jobs from the server.')
    } finally {
      setLoading(false)
    }
  }

  fetchJobs()
}, [])

  const toggleFilter = (value, setter) => {
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    )
  }

  const filteredJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      const searchText = search.toLowerCase().trim()
      const locationText = location.toLowerCase().trim()

      const matchesSearch =
        !searchText ||
        job.title.toLowerCase().includes(searchText) ||
        job.company.toLowerCase().includes(searchText) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(searchText),
        )

      const matchesLocation =
        !locationText ||
        job.location.toLowerCase().includes(locationText)

      const matchesType =
        jobType.length === 0 || jobType.includes(job.type)

      const matchesExperience =
        experience.length === 0 ||
        experience.includes(job.experience)

      return (
        matchesSearch &&
        matchesLocation &&
        matchesType &&
        matchesExperience
      )
    })

    if (sortBy === 'newest') {
      result = [...result].sort((a, b) => a.id - b.id)
    }

    if (sortBy === 'oldest') {
      result = [...result].sort((a, b) => b.id - a.id)
    }

    return result
  }, [jobs, search, location, jobType, experience, sortBy])

  const clearFilters = () => {
    setSearch('')
    setLocation('')
    setJobType([])
    setExperience([])
  }

  return (
    <main className="browse-page">

      {/* Header */}
      <section className="browse-header">
        <div className="container">

          <div className="browse-heading">
            <div>
              <p className="section-label">EXPLORE OPPORTUNITIES</p>

              <h1>Find your next opportunity</h1>

              <p>
                Search thousands of jobs and discover a role
                that matches your skills and ambitions.
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="browse-search">

            <div className="browse-search-field">
              <Search size={20} />

              <div>
                <label>Job title, skills or company</label>

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="e.g. Software Engineer"
                />
              </div>
            </div>

            <div className="browse-search-divider"></div>

            <div className="browse-search-field">
              <MapPin size={20} />

              <div>
                <label>Location</label>

                <input
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="e.g. Bengaluru"
                />
              </div>
            </div>

            <button className="browse-search-button">
              <Search size={18} />
              Search
            </button>

          </div>
        </div>
      </section>


      {/* Main */}
      <section className="browse-content">

        <div className="container browse-layout">

          {/* Filters */}
          <aside className="filters">

            <div className="filters-header">
              <div>
                <SlidersHorizontal size={18} />
                <h2>Filters</h2>
              </div>

              <button onClick={clearFilters}>
                Clear
              </button>
            </div>


            {/* Job Type */}
            <div className="filter-group">

              <h3>Job Type</h3>

              {['Full-time', 'Part-time', 'Internship', 'Contract'].map(
                (type) => (
                  <label className="checkbox-label" key={type}>
                    <input
                      type="checkbox"
                      checked={jobType.includes(type)}
                      onChange={() =>
                        toggleFilter(type, setJobType)
                      }
                    />

                    <span>
                      {type === 'Full-time'
                        ? 'Full Time'
                        : type === 'Part-time'
                        ? 'Part Time'
                        : type === 'Internship'
                        ? 'Internship'
                        : type === 'Contract'
                        ? 'Contract'
                        : type}
                    </span>
                  </label>
                ),
              )}

            </div>


            {/* Experience */}
            <div className="filter-group">

              <h3>Experience</h3>

              {['Fresher', '0-2 years', '1-2 years', '1-3 years'].map(
                (level) => (
                  <label className="checkbox-label" key={level}>
                    <input
                      type="checkbox"
                      checked={experience.includes(level)}
                      onChange={() =>
                        toggleFilter(level, setExperience)
                      }
                    />

                    <span>{level}</span>
                  </label>
                ),
              )}

            </div>


            {/* Location */}
            <div className="filter-group">

              <h3>Popular Locations</h3>

              {['Bengaluru', 'Hyderabad', 'Chennai', 'Mumbai', 'Pune'].map(
                (city) => (
                  <button
                    key={city}
                    className="location-filter"
                    onClick={() => setLocation(city)}
                  >
                    <MapPin size={14} />
                    {city}
                  </button>
                ),
              )}

            </div>

          </aside>


          {/* Job Results */}
          <div className="job-results">

            <div className="results-toolbar">

              <div>
                <strong>{filteredJobs.length}</strong> jobs found
              </div>

              <div className="sort-control">
                <span>Sort by</span>

                <div className="sort-select">
                  <select
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(event.target.value)
                    }
                  >
                    <option value="relevance">Relevance</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>

                  <ChevronDown size={15} />
                </div>
              </div>

            </div>


            {filteredJobs.length === 0 ? (

              <div className="empty-jobs">
                <div className="empty-icon">
                  <Search size={28} />
                </div>

                <h2>No jobs found</h2>

                <p>
                  Try changing your search terms or removing
                  some filters.
                </p>

                <button onClick={clearFilters}>
                  Clear all filters
                </button>
              </div>

            ) : (

              <div className="jobs-list">

                {filteredJobs.map((job) => (

                  <article className="job-card" key={job.id}>

                    <div className="job-card-top">

                      <div className="company-logo-large">
                        {job.company.charAt(0)}
                      </div>

                      <div className="job-card-title">

                        <h2>{job.title}</h2>

                        <p>{job.company}</p>

                      </div>

                    </div>


                    <div className="job-meta">

                      <span>
                        <MapPin size={15} />
                        {job.location}
                      </span>

                      <span>
                        <BriefcaseBusiness size={15} />
                        {job.type}
                      </span>

                      <span>
                        <Clock3 size={15} />
                        {job.posted}
                      </span>

                    </div>


                    <div className="job-card-bottom">

                      <div>

                        <strong className="salary">
                          {job.salary}
                        </strong>

                        <div className="skill-list">

                          {job.skills.map((skill) => (
                            <span key={`${job.id}-${skill}`}>
                              {skill}
                            </span>
                          ))}

                        </div>

                      </div>

                      <Link
                        to={`/jobs/${job.id}`}
                        className="view-job-button"
                     >
                        View Details
                        <ArrowRight size={16} />
                    </Link>

                    </div>

                  </article>

                ))}

              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  )
}

export default BrowseJobs