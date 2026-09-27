import { Link } from 'react-router-dom'
import{useEffect, useState} from 'react'
import api from '../../services/api'
import {
  BriefcaseBusiness,
  Users,
  FileText,
  Plus,
  ArrowRight,
  MapPin,
  MoreHorizontal,
} from 'lucide-react'
import './RecruiterDashboard.css'

function RecruiterDashboard() {
    const [ openMenu, setOpenMenu ] = useState(null)

    const [applications, setApplications] = useState([])
    const [recruiterJobs, setRecruiterJobs] = useState([])
    const [dashboardStats, setDashboardStats] = useState({
      totalJobs: 0,
      totalApplications: 0,
      statusBreakdown: [],
})

const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

useEffect(() => {
  const fetchRecruiterDashboard = async () => {
    try {
      setLoading(true)
      setError('')

      const [jobsResponse, dashboardResponse] = await Promise.all([
        api.get('/recruiter/jobs'),
        api.get('/recruiter/dashboard'),
      ])

      setRecruiterJobs(jobsResponse.data.jobs || [])

      const jobs = jobsResponse.data.jobs || []

      const applicationResponses = await Promise.all(
        jobs.map((job) =>
          api.get(`/applications/job/${job.jobId}`)
  )
)

      const allApplications = applicationResponses.flatMap(
        (response) => response.data.applications || []
)

      setApplications(allApplications)

      setDashboardStats({
        totalJobs: dashboardResponse.data.totalJobs || 0,
        totalApplications:
          dashboardResponse.data.totalApplications || 0,
        statusBreakdown:
          dashboardResponse.data.statusBreakdown || [],
      })
    } catch (err) {
      console.error(
        'Failed to fetch recruiter dashboard:',
        err
      )

      setError(
        err.response?.data?.message ||
        'Unable to load recruiter dashboard.'
      )
    } finally {
      setLoading(false)
    }
  }

  fetchRecruiterDashboard()
}, [])


const handleDeleteJob = (jobId) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this job?'
  )

  if (!confirmed) {
    return
  }

  const updatedJobs = recruiterJobs.filter(
    (job) => String(job.id) !== String(jobId)
  )

  localStorage.setItem(
    'recruiterJobs',
    JSON.stringify(updatedJobs)
  )

  setRecruiterJobs(updatedJobs)
}

  return (
    <main className="recruiter-dashboard">

      <div className="container">

        {/* Header */}

        <section className="recruiter-welcome">

          <div>
            <span className="recruiter-label">
              RECRUITER DASHBOARD
            </span>

            <h1>Welcome back!</h1>

            <p>
              Manage your job postings and find the right talent.
            </p>
          </div>

          <Link
            to="/recruiter/post-job"
            className="post-job-button"
          >
            <Plus size={18} />
            Post a Job
          </Link>

        </section>

        {/* Statistics */}

        <section className="recruiter-stats">

          <div className="recruiter-stat-card">

            <div className="recruiter-stat-icon">
              <BriefcaseBusiness size={21} />
            </div>

            <div>
              <span>Active Jobs</span>
              <strong>{dashboardStats.totalJobs}</strong>
            </div>

          </div>

          <div className="recruiter-stat-card">

            <div className="recruiter-stat-icon">
              <Users size={21} />
            </div>

            <div>
              <span>Total Applicants</span>
              <strong>{dashboardStats.totalApplications}</strong>
            </div>

          </div>

          <div className="recruiter-stat-card">

            <div className="recruiter-stat-icon">
              <FileText size={21} />
            </div>

            <div>
              <span>Applications</span>
              <strong>{dashboardStats.totalApplications}</strong>
            </div>

          </div>

          <div className="recruiter-stat-card">

            <div className="recruiter-stat-icon">
              <Users size={21} />
            </div>

            <div>
              <span>Shortlisted</span>
              <strong>
                {dashboardStats.statusBreakdown.find(
                  (item) => item._id === 'Shortlisted'
              )?.count || 0}
            </strong>
            </div>

          </div>

        </section>

        {/* Job Listings */}

        <section className="recruiter-section">

          <div className="recruiter-section-header">

            <div>
              <h2>My Job Postings</h2>
              <p>
                Manage your current job openings.
              </p>
            </div>

            <Link to="/recruiter/jobs">
              View All
              <ArrowRight size={15} />
            </Link>

          </div>

          <div className="recruiter-jobs">

            {recruiterJobs.map((job) => (

              <article
                className="recruiter-job-card"
                key={job._id || job.jobId}
              >

                <div className="recruiter-job-icon">
                  {job.jobTitle?.charAt(0) ||'J'}
                </div>

                <div className="recruiter-job-info">

                  <h3>{job.jobTitle}</h3>

                  <p>
                    <MapPin size={14} />
                    {job.location}
                  </p>

                  <span>
                    Posted{' '}
                    {new Date(job.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>

                </div>

                <div className="recruiter-job-applicants">

                  <strong>-</strong>

                  <span>Applicants</span>

                </div>

                <span className="job-active-status">
                  Active
                </span>

                <div className="job-menu-wrapper">

  <button
    className="job-menu-button"
    aria-label="Job options"
    onClick={() =>
      setOpenMenu(
        openMenu === job.id ? null : job.id
      )
    }
  >
    <MoreHorizontal size={19} />
  </button>

  {openMenu === job.id && (
    <div className="job-options-menu">

      <Link
        to={`/recruiter/jobs/${job._id}/edit`}
        onClick={() => setOpenMenu(null)}
      >
        Edit Job
      </Link>

      <button
        onClick={() => {
          setOpenMenu(null)
          handleDeleteJob(job.id)
        }}
      >
        Delete Job
      </button>

    </div>
  )}

</div>

              </article>

            ))}

          </div>

        </section>

        {/* Recent Applications */}

        <section className="recruiter-section">

          <div className="recruiter-section-header">

            <div>
              <h2>Recent Applications</h2>
              <p>
                Candidates who recently applied to your jobs.
              </p>
            </div>

            <Link to="/recruiter/applications">
              View All
              <ArrowRight size={15} />
            </Link>

          </div>

          <div className="recent-candidates">

  {applications.length > 0 ? (
    applications.slice(0, 5).map((application) => (
      <div className="candidate-row" key={application._id}>

        <div className="candidate-avatar">
          {application.applicantEmail
          ?.charAt(0)
          .toUpperCase() || 'A'}
        </div>

        <div className="candidate-info">
          <strong>
            {application.applicantEmail || 'Applicant'}
          </strong>

          <span>
            Job ID: {application.jobId}
          </span>
        </div>

        <span className="candidate-status">
          {application.status}
        </span>

        <Link
          to={`/recruiter/applications/${application._id}`}
          className="candidate-view"
        >
          View
        </Link>

      </div>
    ))
  ) : (
    <div className="no-applications">
      <p>No applications received yet.</p>
    </div>
  )}

</div>

        </section>

      </div>

    </main>
  )
}

export default RecruiterDashboard