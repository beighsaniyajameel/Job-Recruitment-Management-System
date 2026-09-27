import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import {
  FileText,
  Clock3,
  CheckCircle2,
  Search,
  ArrowRight,
  BriefcaseBusiness,
  MapPin,
} from 'lucide-react'
import './JobSeekerDashboard.css'

function JobSeekerDashboard() {
  const [applications, setApplications] = useState([])
  const [recommendedJobs, setRecommendedJobs] = useState([])

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const applicationsResponse = await api.get('/applications/me')

      setApplications(
        applicationsResponse.data.applications || []
      )

      const jobsResponse = await api.get('/jobs')

      const jobs = (jobsResponse.data.jobs || []).map((job) => ({
        id: job._id,
        title: job.jobTitle,
        company: job.company,
        location: job.location,
        salary: job.salary
          ? `₹${(job.salary / 100000).toFixed(1)} LPA`
          : 'Not specified',
        type: job.jobType,
      }))

      setRecommendedJobs(jobs.slice(0, 3))
    } catch (err) {
      console.error(
        'Failed to load job seeker dashboard:',
        err
      )
    }
  }

  fetchDashboardData()
}, [])

  const underReview = applications.filter(
    (application) => application.status === 'Under Review'
  ).length

  const shortlisted = applications.filter(
    (application) => application.status === 'Shortlisted'
  ).length

  return (
    <main className="dashboard-page">

      <div className="container">

        {/* Welcome */}

        <section className="dashboard-welcome">

          <div>
            <span className="dashboard-label">
              JOB SEEKER DASHBOARD
            </span>

            <h1>Welcome back!</h1>

            <p>
              Here's what's happening with your job search.
            </p>
          </div>

          <Link
            to="/jobs"
            className="dashboard-find-button"
          >
            <Search size={17} />
            Find Jobs
          </Link>

        </section>

        {/* Statistics */}

        <section className="dashboard-stats">

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon">
              <FileText size={21} />
            </div>

            <div>
              <span>Applications</span>
              <strong>{applications.length}</strong>
            </div>

          </div>

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon">
              <Clock3 size={21} />
            </div>

            <div>
              <span>Under Review</span>
              <strong>{underReview}</strong>
            </div>

          </div>

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>Shortlisted</span>
              <strong>{shortlisted}</strong>
            </div>

          </div>

        </section>

        {/* Recent Applications */}

        <section className="dashboard-section">

          <div className="dashboard-section-header">

            <div>
              <h2>Recent Applications</h2>
              <p>Your latest job applications</p>
            </div>

            <Link to="/applications">
              View All
              <ArrowRight size={15} />
            </Link>

          </div>

          {applications.length === 0 ? (

            <div className="dashboard-empty">

              <div className="dashboard-empty-icon">
                <BriefcaseBusiness size={27} />
              </div>

              <h3>No applications yet</h3>

              <p>
                Start exploring jobs and submit your first
                application.
              </p>

              <Link to="/jobs">
                Browse Jobs
                <ArrowRight size={16} />
              </Link>

            </div>

          ) : (

            <div className="dashboard-applications">

              {applications.slice(0, 3).map((application) => (

                <div
                  className="dashboard-application-card"
                  key={application._id ||application.id || application.jobId}
                >

                  <div className="dashboard-company-icon">
                    {application.jobDetails?.company?.charAt(0) || application.company?.charAt(0) || '?' }
                  </div>

                  <div className="dashboard-application-info">

                    <h3>
                      {application.jobDetails?.jobTitle ||
                        application.jobTitle ||
                        application.jobId ||
                        'Job Title'}
                    </h3>

                    <p>
                      {application.jobDetails?.company ||
                        application.company ||
                        'Company'}
                    </p>

                    <span>
                      Applied {application.applicationDate ||
                        application.appliedAt ||
                        'Recently'}
                    </span>

                  </div>

                  <div className="dashboard-application-right">

                    <span
                      className={`dashboard-status ${
                        application.status === 'Shortlisted'
                          ? 'dashboard-status-shortlisted'
                          : application.status === 'Under Review'
                          ? 'dashboard-status-review'
                          : 'dashboard-status-applied'
                      }`}
                    >
                      {application.status}
                    </span>

                    <Link
                      to={`/jobs/${application.jobId}`}
                    >
                      View Job
                      <ArrowRight size={15} />
                    </Link>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* Recommended Jobs */}

        <section className="dashboard-section">

          <div className="dashboard-section-header">

            <div>
              <h2>Recommended Jobs</h2>
              <p>Opportunities you may be interested in</p>
            </div>

            <Link to="/jobs">
              Explore All
              <ArrowRight size={15} />
            </Link>

          </div>

          <div className="recommended-jobs">

            {recommendedJobs.map((job) => (

              <article
                className="recommended-job-card"
                key={job.id}
              >

                <div className="recommended-job-top">

                  <div className="recommended-company-icon">
                    {job.company.charAt(0)}
                  </div>

                  <span className="job-type-badge">
                    {job.type}
                  </span>

                </div>

                <h3>{job.title}</h3>

                <p className="recommended-company">
                  {job.company}
                </p>

                <div className="recommended-meta">

                  <span>
                    <MapPin size={14} />
                    {job.location}
                  </span>

                  <span>{job.salary}</span>

                </div>

                <Link
                  to={`/jobs/${job.id}`}
                  className="recommended-view-button"
                >
                  View Details
                  <ArrowRight size={15} />
                </Link>

              </article>

            ))}

          </div>

        </section>

      </div>

    </main>
  )
}

export default JobSeekerDashboard