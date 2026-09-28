import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../../services/api'
import {
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  BriefcaseBusiness,
  CalendarDays,
} from 'lucide-react'
import './ApplicationDetails.css'

function ApplicationDetails() {
  const { id } = useParams()

  const [application, setApplication] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

useEffect(() => {
  const fetchApplication = async () => {
    try {
      setLoading(true)
      setError('')

      const jobsResponse = await api.get('/recruiter/jobs')

      const jobs = jobsResponse.data.jobs || []

      const applicationResponses = await Promise.all(
        jobs.map((job) =>
          api.get(`/applications/job/${job.jobId}`)
        )
      )

      const allApplications =
        applicationResponses.flatMap(
          (response) => response.data.applications || []
        )

      const foundApplication = allApplications.find(
        (item) => String(item._id) === String(id)
      )

      if (!foundApplication) {
        setError('Application not found.')
        return
      }

      const job = jobs.find(
        (item) => item.jobId === foundApplication.jobId
)

      setApplication({
        ...foundApplication,
        jobTitle: job?.jobTitle || foundApplication.jobId,
})

      setError(
        err.response?.data?.message ||
        'Unable to load application.'
      )
    } finally {
      setLoading(false)
    }
  }

  fetchApplication()
}, [id])

  if (loading) {
  return (
    <main className="application-details-page">
      <div className="container not-found">
        <h1>Loading application...</h1>
      </div>
    </main>
  )
}

if (error || !application) {
  return (
    <main className="application-details-page">
      <div className="container not-found">
        <h1>Application not found</h1>

        <p>{error}</p>

        <Link to="/recruiter/dashboard">
          Back to Dashboard
        </Link>
      </div>
    </main>
  )
}

  return (
    <main className="application-details-page">
      <div className="container">

        <Link
          to="/recruiter/dashboard"
          className="application-back-link"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <section className="application-details-card">

          <div className="application-details-header">

            <div className="applicant-avatar">
              {application.applicantEmail
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <p className="section-label">
                JOB APPLICATION
              </p>

              <h1>{application.applicantEmail}</h1>

              <p className="application-job">
                {application.jobTitle}
              </p>

              <div className="application-status-wrapper">
  <span className="status-label">
    Application Status
  </span>

  <select
    className="application-status-select"
    value={application.status}
    onChange={async (e) => {
      const newStatus = e.target.value

  try {
    const response = await api.put(
      `/applications/${application._id}/status`,
      {
        status: newStatus,
      }
    )

    setApplication((prev) => ({
      ...response.data.application,
      jobTitle: prev.jobTitle,
    }))
  } catch (err) {
    console.error(
      'Failed to update application status:',
      err
    )
  }
}}
  >
    <option value="Applied">Applied</option>
    <option value="Shortlisted">Shortlisted</option>
    <option value="Interview">Interview</option>
    <option value="Selected">Selected</option>
    <option value="Rejected">Rejected</option>
  </select>
</div>
            </div>

          </div>

          <div className="application-info-grid">

            <div className="application-info-item">
              <Mail size={19} />

              <div>
                <span>Email</span>
                <strong>{application.applicantEmail}</strong>
              </div>
            </div>

            <div className="application-info-item">
              <Phone size={19} />

              <div>
                <span>Phone</span>
                <strong>{application.applicantPhone || 'Not Provided'}</strong>
              </div>
            </div>

            <div className="application-info-item">
              <BriefcaseBusiness size={19} />

              <div>
                <span>Applied For</span>
                <strong>{application.jobTitle || application.jobId || 'Not Provided'}</strong>
              </div>
            </div>

            <div className="application-info-item">
              <CalendarDays size={19} />

              <div>
                <span>Applied On</span>
                <strong>{application.applicationDate}</strong>
              </div>
            </div>

          </div>

          <section className="application-section">

            <h2>
              <FileText size={20} />
              Resume
            </h2>

            <div className="resume-box">
              <FileText size={20} />

              <span>
                {application.resumeName || 'Resume.pdf'}
              </span>
            </div>

          </section>

          <section className="application-section">

            <h2>Cover Letter</h2>

            <p className="cover-letter">
              {application.coverLetter ||
                'No cover letter provided.'}
            </p>

          </section>

        </section>

      </div>
    </main>
  )
}

export default ApplicationDetails