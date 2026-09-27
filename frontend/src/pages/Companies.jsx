import { Building2, MapPin, Users } from 'lucide-react'
import './Companies.css'

const companies = [
  {
    name: 'TechNova Solutions',
    location: 'Bengaluru',
    industry: 'Technology',
    jobs: 24,
    employees: '500+',
  },
  {
    name: 'DataWorks',
    location: 'Hyderabad',
    industry: 'Data & Analytics',
    jobs: 18,
    employees: '250+',
  },
  {
    name: 'PixelCraft',
    location: 'Bengaluru',
    industry: 'Software Development',
    jobs: 12,
    employees: '150+',
  },
  {
    name: 'CloudCore Technologies',
    location: 'Chennai',
    industry: 'Cloud & DevOps',
    jobs: 16,
    employees: '300+',
  },
  {
    name: 'SecureNet',
    location: 'Pune',
    industry: 'Cybersecurity',
    jobs: 9,
    employees: '100+',
  },
  {
    name: 'CodeSphere',
    location: 'Mumbai',
    industry: 'Technology',
    jobs: 15,
    employees: '200+',
  },
]

function Companies() {
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

          <div className="companies-grid">

            {companies.map((company) => (
              <article
                className="company-card"
                key={company.name}
              >

                <div className="company-card-top">

                  <div className="company-icon">
                    {company.name.charAt(0)}
                  </div>

                  <div>
                    <h3>{company.name}</h3>

                    <span className="company-industry">
                      {company.industry}
                    </span>
                  </div>

                </div>

                <div className="company-details">

                  <div>
                    <MapPin size={16} />
                    <span>{company.location}</span>
                  </div>

                  <div>
                    <Users size={16} />
                    <span>{company.employees} Employees</span>
                  </div>

                </div>

                <div className="company-footer">

                  <span>
                    <Building2 size={16} />
                    {company.jobs} Open Jobs
                  </span>

                  <button>
                    View Company
                  </button>

                </div>

              </article>
            ))}

          </div>

        </div>
      </section>

    </main>
  )
}

export default Companies