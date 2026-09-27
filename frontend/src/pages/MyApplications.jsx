import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import {
  BriefcaseBusiness,
  CalendarDays,
  ArrowRight,
  FileText,
  Search,
} from 'lucide-react'
import './MyApplications.css'

function MyApplications() {
  const [applications, setApplications] = useState([])

  useEffect(() => {
  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/me')

      setApplications(response.data.applications || [])
    } catch (err) {
      console.error(
        'Failed to fetch applications:',
        err
      )
    }
  }

  fetchApplications()
}, [])

  const getStatusClass = (status) => {
    switch (status) {
      case 'Applied':
        return 'status-applied'

      case 'Under Review':
        return 'status-review'

      case 'Shortlisted':
        return 'status-shortlisted'

      case 'Rejected':
        return 'status-rejected'

      default:
        return 'status-applied'
    }
  }

  return (
    <main className="applications-page">

      <div className="container">

        {/* Header */}

        <div className="applications-header">

          <div>
            <span className="applications-label">
              JOB SEEKER
            </span>

            <h1>My Applications</h1>

            <p>
              Track and manage the jobs you have applied for.
            </p>
          </div>

          <Link
            to="/jobs"
            className="browse-jobs-button"
          >
            <Search size={17} />
            Find More Jobs
          </Link>

        </div>

        {/* Statistics */}

        <div className="application-stats">

          <div className="application-stat-card">
            <div className="stat-icon">
              <FileText size={20} />
            </div>

            <div>
              <span>Total Applications</span>
              <strong>{applications.length}</strong>
            </div>
          </div>

          <div className="application-stat-card">
            <div className="stat-icon">
              <BriefcaseBusiness size={20} />
            </div>

            <div>
              <span>Active Applications</span>
              <strong>
                {
                  applications.filter(
                    (app) =>
                      app.status !== 'Rejected'
                  ).length
                }
              </strong>
            </div>
          </div>

          <div className="application-stat-card">
            <div className="stat-icon">
              <CalendarDays size={20} />
            </div>

            <div>
              <span>Latest Application</span>

              <strong>
                {applications.length > 0
                  ? applications[0].appliedAt
                  : '—'}
              </strong>
            </div>
          </div>

        </div>

        {/* Applications */}

        <section className="applications-section">

          <div className="section-heading">
            <h2>Your Applications</h2>

            <span>
              {applications.length}{' '}
              {applications.length === 1
                ? 'application'
                : 'applications'}
            </span>
          </div>

          {applications.length === 0 ? (

            <div className="empty-applications">

              <div className="empty-icon">
                <BriefcaseBusiness size={30} />
              </div>

              <h2>No Applications Yet</h2>

              <p>
                You haven't applied for any jobs yet.
                Start exploring opportunities and submit
                your first application.
              </p>

              <Link
                to="/jobs"
                className="empty-button"
              >
                Browse Jobs
                <ArrowRight size={17} />
              </Link>

            </div>

          ) : (

            <div className="applications-list">

              {applications.map((application) => (

                <article
                  className="application-card"
                  key={application._id || application.id || application.jobId}
                >

                  <div className="application-company-icon">
                    {application.jobDetails?.company?.charAt(0) || '?'}
                  </div>

                  <div className="application-main">

                    <div className="application-title-row">

                      <div>
                        <h3>
                          {application.jobDetails?.jobTitle || 'Job Title'}
                        </h3>

                        <p>
                          {application.jobDetails?.company || 'Company'}
                        </p>
                      </div>

                      <span
                        className={`application-status ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>

                    </div>

                    <div className="application-meta">

                      <span>
                        <CalendarDays size={15} />
                        Applied {application.applicationDate || 'Recently'}
                      </span>

                      <span>
                        <FileText size={15} />
                        {application.resumeName}
                      </span>

                    </div>

                    <div className="application-card-footer">

                      <span className="application-note">
                        Application submitted successfully
                      </span>

                      <Link
                        to={`/jobs/${application.jobId}`}
                        className="view-application-job"
                      >
                        View Job
                        <ArrowRight size={16} />
                      </Link>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </div>

    </main>
  )
}

export default MyApplications