import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../services/api'
import {
  ArrowLeft,
  Upload,
  CheckCircle2,
  FileText,
} from 'lucide-react'
import './ApplyJob.css'

const jobData = {
  1: {
    title: 'Software Engineer',
    company: 'TechNova Solutions',
  },
  2: {
    title: 'Data Analyst',
    company: 'DataWorks',
  },
  3: {
    title: 'Frontend Developer',
    company: 'PixelCraft',
  },
  4: {
    title: 'Cloud Engineer',
    company: 'CloudCore Technologies',
  },
  5: {
    title: 'Cybersecurity Intern',
    company: 'SecureNet',
  },
  6: {
    title: 'Backend Developer',
    company: 'CodeSphere',
  },
}

function ApplyJob() {
  const { id } = useParams()
  
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
  })

  useEffect(() => {
  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}`)

      const backendJob = response.data.job

      setJob({
        id: backendJob._id,
        title: backendJob.jobTitle,
        company: backendJob.company,
      })
    } catch (err) {
      console.error('Failed to fetch job:', err)
    } finally {
      setLoading(false)
    }
  }

  fetchJob()
}, [id])

  const [resume, setResume] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleResumeChange = (e) => {
    const file = e.target.files[0]

    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document.')
      setResume(null)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Resume size must be less than 5 MB.')
      setResume(null)
      return
    }

    setError('')
    setResume(file)
  }

  const handleSubmit = async(e) => {
    e.preventDefault()

    if (!formData.fullName.trim()) {
      setError('Please enter your full name.')
      return
    }

    if (!formData.email.trim()) {
      setError('Please enter your email address.')
      return
    }

    if (!formData.phone.trim()) {
      setError('Please enter your phone number.')
      return
    }

    if (!resume) {
      setError('Please upload your resume.')
      return
    }

    if (!confirmed) {
      setError('Please confirm that the information provided is correct.')
      return
    }

    setError('')

try {
  const response = await api.post('/applications', {
    jobId: id,
    coverLetter: formData.coverLetter,
  })

  console.log('Application API response:', response.data)

  setSubmitted(true)
} catch (err) {
  console.error('Application submission failed:', err)

  setError(
    err.response?.data?.message ||
    'Unable to submit your application. Please try again.'
  )
}

setSubmitted(true)
  }

  if (loading) {
  return (
    <main className="apply-page">
      <div className="container apply-not-found">
        <h2>Loading job...</h2>
      </div>
    </main>
  )
}

  if (!job) {
    return (
      <main className="apply-page">
        <div className="container apply-not-found">
          <h2>Job Not Found</h2>
          <p>The job you are trying to apply for does not exist.</p>
          <Link to="/jobs" className="apply-back-button">
            <ArrowLeft size={17} />
            Back to Jobs
          </Link>
        </div>
      </main>
    )
  }

  if (submitted) {
    return (
      <main className="apply-page">
        <div className="container">
          <div className="application-success">

            <div className="success-icon">
              <CheckCircle2 size={42} />
            </div>

            <span className="success-label">
              APPLICATION SUBMITTED
            </span>

            <h1>Application Submitted!</h1>

            <p>
              Your application for{' '}
              <strong>{job.title}</strong> at{' '}
              <strong>{job.company}</strong> has been
              submitted successfully.
            </p>

            <div className="success-actions">
              <Link
                to="/applications"
                className="primary-success-button"
              >
                View My Applications
              </Link>

              <Link
                to="/jobs"
                className="secondary-success-button"
              >
                Back to Jobs
              </Link>
            </div>

          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="apply-page">

      <div className="container">

        <Link to={`/jobs/${id}`} className="back-to-job">
          <ArrowLeft size={17} />
          Back to Job Details
        </Link>

        <div className="apply-layout">

          {/* LEFT SIDE */}

          <section className="application-form-card">

            <div className="application-header">
              <span className="application-label">
                JOB APPLICATION
              </span>

              <h1>Apply for this position</h1>

              <p>
                Complete the form below to submit your
                application.
              </p>
            </div>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="form-section">
                <h3>Personal Information</h3>

                <div className="form-grid">

                  <div className="form-group">
                    <label htmlFor="fullName">
                      Full Name <span>*</span>
                    </label>

                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      Email Address <span>*</span>
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    Phone Number <span>*</span>
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <div className="form-section">

                <h3>Resume</h3>

                <label
                  htmlFor="resume"
                  className="resume-upload"
                >

                  <input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                  />

                  <div className="upload-icon">
                    {resume ? (
                      <FileText size={25} />
                    ) : (
                      <Upload size={25} />
                    )}
                  </div>

                  <div className="upload-content">

                    {resume ? (
                      <>
                        <strong>{resume.name}</strong>
                        <span>
                          Resume selected successfully
                        </span>
                      </>
                    ) : (
                      <>
                        <strong>
                          Upload your resume
                        </strong>

                        <span>
                          PDF or Word document • Max 5 MB
                        </span>
                      </>
                    )}

                  </div>

                </label>

              </div>

              <div className="form-section">

                <h3>Cover Letter</h3>

                <div className="form-group">

                  <label htmlFor="coverLetter">
                    Cover Letter
                  </label>

                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    rows="7"
                    placeholder="Tell the employer why you're a good fit for this position..."
                    value={formData.coverLetter}
                    onChange={handleChange}
                  />

                  <small>
                    Optional — introduce yourself and explain
                    why you're interested in this role.
                  </small>

                </div>

              </div>

              <div className="confirmation-box">

                <input
                  id="confirmation"
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) =>
                    setConfirmed(e.target.checked)
                  }
                />

                <label htmlFor="confirmation">
                  I confirm that the information provided
                  in this application is accurate and
                  complete.
                </label>

              </div>

              <button
                type="submit"
                className="submit-application-button"
              >
                Submit Application
              </button>

            </form>

          </section>

          {/* RIGHT SIDE */}

          <aside className="application-sidebar">

            <div className="job-summary-card">

              <span className="summary-label">
                APPLYING FOR
              </span>

              <div className="company-initial">
                {job.company.charAt(0)}
              </div>

              <h2>{job.title}</h2>

              <p>{job.company}</p>

              <div className="summary-divider"></div>

              <div className="application-info">
                <span>Position</span>
                <strong>{job.title}</strong>
              </div>

              <div className="application-info">
                <span>Company</span>
                <strong>{job.company}</strong>
              </div>

            </div>

            <div className="application-tip">

              <h3>Application Tips</h3>

              <ul>
                <li>Keep your resume updated.</li>
                <li>Use a professional email address.</li>
                <li>Highlight relevant skills.</li>
                <li>Review your application before submitting.</li>
              </ul>

            </div>

          </aside>

        </div>

      </div>

    </main>
  )
}

export default ApplyJob