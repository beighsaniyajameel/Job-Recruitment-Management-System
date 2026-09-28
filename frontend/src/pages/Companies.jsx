import { useEffect, useState } from 'react'
import { Building2, MapPin } from 'lucide-react'
import api from '../services/api'
import './Companies.css'

function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/companies')

        setCompanies(response.data.companies || [])
      } catch (err) {
        console.error('Failed to fetch companies:', err)
        setError('Unable to load companies from the server.')
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  return (
    <main className="companies-page">

      <section className="companies-hero">
        <div className="container">
          <p className="section-label">TOP EMPLOYERS</p>

          <h1>Explore Companies</h1>

          <p>
            Discover companies, explore their opportunities,
            and find a workplace where your career can grow.
          </p>
        </div>
      </section>

      <section className="companies-section">
        <div className="container">

          <div className="companies-header">
            <div>
              <h2>Featured Companies</h2>
              <p>Explore companies hiring talented professionals.</p>
            </div>

            <span className="company-count">
              {companies.length} Companies
            </span>
          </div>

          {loading && (
            <div className="empty-jobs">
              <h2>Loading companies...</h2>
            </div>
          )}

          {error && (
            <div className="empty-jobs">
              <h2>Unable to load companies</h2>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && companies.length === 0 && (
            <div className="empty-jobs">
              <h2>No companies found</h2>
              <p>
                There are currently no companies available.
              </p>
            </div>
          )}

          {!loading && !error && companies.length > 0 && (
            <div className="companies-grid">

              {companies.map((company) => (
                <article
                  className="company-card"
                  key={company._id}
                >

                  <div className="company-card-top">

                    <div className="company-icon">
                      {company.companyName?.charAt(0)}
                    </div>

                    <div>
                      <h3>{company.companyName}</h3>

                      <span className="company-industry">
                        {company.industry || 'Technology'}
                      </span>
                    </div>

                  </div>

                  <div className="company-details">

                    <div>
                      <MapPin size={16} />
                      <span>{company.location}</span>
                    </div>

                  </div>

                  <div className="company-footer">

                    <span>
                      <Building2 size={16} />
                      Company
                    </span>

                    <button>
                      View Company
                    </button>

                  </div>

                </article>
              ))}

            </div>
          )}

        </div>
      </section>

    </main>
  )
}

export default Companies