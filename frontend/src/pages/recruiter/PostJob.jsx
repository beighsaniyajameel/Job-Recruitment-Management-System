import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import {
  ArrowLeft,
  BriefcaseBusiness,
  MapPin,
  IndianRupee,
  FileText,
  CheckCircle2,
} from 'lucide-react'
import './PostJob.css'

function PostJob() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    experience: 'Fresher',
    salary: '',
    skills: '',
    description: '',
  })

  const [error, setError] = useState('')
  const [published, setPublished] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !formData.title.trim() ||
      !formData.company.trim() ||
      !formData.location.trim() ||
      !formData.salary.trim() ||
      !formData.skills.trim() ||
      !formData.description.trim()
    ) {
      setError('Please fill in all required fields.')
      return
    }

    setError('')

    try {
  const response = await api.post('/jobs', {
    jobTitle: formData.title,
    company: formData.company,
    location: formData.location,
    jobType: formData.type,
    experience: formData.experience,
    salary: Number(formData.salary),
    skills: formData.skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean),
    description: formData.description,
  })

  setPublished(true)
} catch (err) {
  console.error('Failed to post job:', err)

  setError(
    err.response?.data?.message ||
    'Unable to publish this job.'
  )
}
  }

  if (published) {
    return (
      <main className="post-job-page">
        <div className="container">
          <div className="job-published-card">

            <div className="published-icon">
              <CheckCircle2 size={43} />
            </div>

            <span className="published-label">
              JOB PUBLISHED
            </span>

            <h1>Job Posted Successfully!</h1>

            <p>
              Your job posting for{' '}
              <strong>{formData.title}</strong> at{' '}
              <strong>{formData.company}</strong> is now
              available to job seekers.
            </p>

            <div className="published-actions">
              <button
                className="published-primary"
                onClick={() => navigate('/jobs')}
              >
                View Jobs
              </button>

              <button
                className="published-secondary"
                onClick={() => {
                  setPublished(false)
                  setFormData({
                    title: '',
                    company: '',
                    location: '',
                    type: 'Full-time',
                    experience: 'Fresher',
                    salary: '',
                    skills: '',
                    description: '',
                  })
                }}
              >
                Post Another Job
              </button>
            </div>

          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="post-job-page">

      <div className="container">

        <Link
          to="/recruiter/dashboard"
          className="post-job-back"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="post-job-layout">

          <section className="post-job-card">

            <div className="post-job-header">
              <span className="post-job-label">
                RECRUITER
              </span>

              <h1>Post a New Job</h1>

              <p>
                Create a job posting and connect with qualified
                candidates.
              </p>
            </div>

            {error && (
              <div className="post-job-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="post-form-section">

                <h3>Job Information</h3>

                <div className="post-form-group">
                  <label htmlFor="title">
                    Job Title <span>*</span>
                  </label>

                  <div className="post-input-wrapper">
                    <BriefcaseBusiness size={17} />

                    <input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="e.g. Software Engineer"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="post-form-group">
                  <label htmlFor="company">
                    Company Name <span>*</span>
                  </label>

                  <input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="e.g. TechNova Solutions"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>

                <div className="post-form-group">
                  <label htmlFor="location">
                    Location <span>*</span>
                  </label>

                  <div className="post-input-wrapper">
                    <MapPin size={17} />

                    <input
                      id="location"
                      name="location"
                      type="text"
                      placeholder="e.g. Bengaluru"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>

              </div>

              <div className="post-form-section">

                <h3>Job Details</h3>

                <div className="post-form-grid">

                  <div className="post-form-group">
                    <label htmlFor="type">
                      Job Type
                    </label>

                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option value="Full-time">Full Time</option>
                      <option value="Part-time">Part Time</option>
                      <option value="Internship">Internship</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>

                  <div className="post-form-group">
                    <label htmlFor="experience">
                      Experience
                    </label>

                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                    >
                      <option>Fresher</option>
                      <option>1–3 years</option>
                      <option>3–5 years</option>
                      <option>5+ years</option>
                    </select>
                  </div>

                </div>

                <div className="post-form-group">

                  <label htmlFor="salary">
                    Salary <span>*</span>
                  </label>

                  <div className="post-input-wrapper">
                    <IndianRupee size={17} />

                    <input
                      id="salary"
                      name="salary"
                      type="number"
                      placeholder="e.g. 600000"
                      value={formData.salary}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                <div className="post-form-group">

                  <label htmlFor="skills">
                    Required Skills <span>*</span>
                  </label>

                  <input
                    id="skills"
                    name="skills"
                    type="text"
                    placeholder="e.g. Python, React, MongoDB"
                    value={formData.skills}
                    onChange={handleChange}
                  />

                  <small>
                    Separate multiple skills using commas.
                  </small>

                </div>

              </div>

              <div className="post-form-section">

                <h3>Job Description</h3>

                <div className="post-form-group">

                  <label htmlFor="description">
                    Description <span>*</span>
                  </label>

                  <div className="post-textarea-wrapper">

                    <FileText size={17} />

                    <textarea
                      id="description"
                      name="description"
                      rows="8"
                      placeholder="Describe the role, responsibilities and requirements..."
                      value={formData.description}
                      onChange={handleChange}
                    />

                  </div>

                </div>

              </div>

              <button
                type="submit"
                className="publish-job-button"
              >
                Publish Job
              </button>

            </form>

          </section>

          <aside className="post-job-sidebar">

            <div className="posting-tips-card">

              <h3>Posting Tips</h3>

              <ul>
                <li>
                  Use a clear and specific job title.
                </li>
                <li>
                  Mention the most important required skills.
                </li>
                <li>
                  Clearly describe the responsibilities.
                </li>
                <li>
                  Provide a realistic salary range.
                </li>
                <li>
                  Review the posting before publishing.
                </li>
              </ul>

            </div>

            <div className="posting-info-card">

              <div className="info-icon">
                <BriefcaseBusiness size={21} />
              </div>

              <h3>Reach the right candidates</h3>

              <p>
                A detailed job description helps candidates
                understand the opportunity and apply with
                confidence.
              </p>

            </div>

          </aside>

        </div>

      </div>

    </main>
  )
}

export default PostJob