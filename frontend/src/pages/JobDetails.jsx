import {
  MapPin,
  BriefcaseBusiness,
  Clock3,
  Building2,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import {useEffect, useState} from 'react'
import api from '../services/api'
import './JobDetails.css'

const jobData = {
  1: {
    title: 'Software Engineer',
    company: 'TechNova Solutions',
    location: 'Bengaluru',
    type: 'Full Time',
    experience: 'Fresher',
    salary: '₹6–10 LPA',
    posted: '2 days ago',
    description:
      'We are looking for a motivated Software Engineer to join our development team and contribute to building reliable and scalable software applications.',
    responsibilities: [
      'Design and develop software applications.',
      'Work closely with the development and product teams.',
      'Write clean, maintainable and efficient code.',
      'Participate in testing and code reviews.',
      'Troubleshoot and resolve application issues.',
    ],
    skills: ['Python', 'React', 'MongoDB', 'Git'],
  },

  2: {
    title: 'Data Analyst',
    company: 'DataWorks',
    location: 'Hyderabad',
    type: 'Full Time',
    experience: '1–3 years',
    salary: '₹5–8 LPA',
    posted: '3 days ago',
    description:
      'DataWorks is looking for a Data Analyst who can transform data into useful insights and support business decisions.',
    responsibilities: [
      'Analyze datasets and identify meaningful patterns.',
      'Prepare reports and dashboards.',
      'Work with business teams to understand requirements.',
      'Clean and validate datasets.',
      'Present analytical findings.',
    ],
    skills: ['SQL', 'Python', 'Power BI', 'Excel'],
  },

  3: {
    title: 'Frontend Developer',
    company: 'PixelCraft',
    location: 'Bengaluru',
    type: 'Full Time',
    experience: '1–3 years',
    salary: '₹7–11 LPA',
    posted: '1 day ago',
    description:
      'PixelCraft is looking for a frontend developer to create responsive and user-friendly web applications.',
    responsibilities: [
      'Build responsive web interfaces.',
      'Develop reusable React components.',
      'Work with designers and backend developers.',
      'Optimize application performance.',
      'Maintain frontend code quality.',
    ],
    skills: ['React', 'JavaScript', 'CSS', 'HTML'],
  },

  4: {
    title: 'Cloud Engineer',
    company: 'CloudCore Technologies',
    location: 'Chennai',
    type: 'Full Time',
    experience: '1–3 years',
    salary: '₹7–12 LPA',
    posted: '5 days ago',
    description:
      'CloudCore Technologies is seeking a Cloud Engineer to help design, deploy and maintain cloud infrastructure.',
    responsibilities: [
      'Manage cloud infrastructure.',
      'Work with deployment and automation tools.',
      'Monitor system performance.',
      'Implement security best practices.',
      'Troubleshoot infrastructure issues.',
    ],
    skills: ['AWS', 'Docker', 'Linux', 'DevOps'],
  },

  5: {
    title: 'Cybersecurity Intern',
    company: 'SecureNet',
    location: 'Pune',
    type: 'Internship',
    experience: 'Fresher',
    salary: '₹20K–30K/month',
    posted: '4 days ago',
    description:
      'SecureNet is looking for a cybersecurity intern interested in network security, threat analysis and security operations.',
    responsibilities: [
      'Assist with security monitoring.',
      'Analyze basic security events.',
      'Support vulnerability assessment activities.',
      'Prepare security reports.',
      'Learn and follow security procedures.',
    ],
    skills: ['Networking', 'Python', 'Security', 'Linux'],
  },

  6: {
    title: 'Backend Developer',
    company: 'CodeSphere',
    location: 'Mumbai',
    type: 'Full Time',
    experience: '3–5 years',
    salary: '₹10–16 LPA',
    posted: '1 week ago',
    description:
      'CodeSphere is looking for a Backend Developer to build scalable APIs and server-side applications.',
    responsibilities: [
      'Develop REST APIs.',
      'Design backend services.',
      'Work with databases.',
      'Implement authentication and authorization.',
      'Optimize backend performance.',
    ],
    skills: ['Node.js', 'Express', 'MongoDB', 'REST API'],
  },
}

function JobDetails() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const recruiterJobs =
    JSON.parse(localStorage.getItem('recruiterJobs')) || []

    useEffect(() => {
  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}`)

      const backendJob = response.data.job

      setJob({
        id: backendJob._id,
        title: backendJob.jobTitle,
        company: backendJob.company,
        location: backendJob.location,
        type: backendJob.jobType,
        experience: backendJob.experience,
        salary: `₹${(backendJob.salary / 100000).toFixed(1)} LPA`,
        posted: new Date(backendJob.createdAt).toLocaleDateString(
          'en-IN',
          {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }
        ),
        description: backendJob.description,
        responsibilities: backendJob.responsibilities || [],
        skills: backendJob.skills || [],
      })
    } catch (err) {
      console.error('Failed to fetch job:', err)
      setError('Unable to load this job.')
    } finally {
      setLoading(false)
    }
  }

  fetchJob()
}, [id])

  if (loading) {
    return (
      <main className="job-details-page">
        <div className="container not-found">
        <h1>Loading job...</h1>
        </div>
      </main>
  )
}

  if (error || !job) {
    return (
      <main className="job-details-page">
        <div className="container not-found">
          <h1>Job not found</h1>
          <Link to="/jobs">Back to jobs</Link>
        </div>
      </main>
  )
}

  return (
    <main className="job-details-page">

      <div className="container">

        <Link to="/jobs" className="back-link">
          <ArrowLeft size={16} />
          Back to jobs
        </Link>

        <section className="job-details-header">

          <div className="company-logo-details">
            {job.company.charAt(0)}
          </div>

          <div className="job-details-title">

            <p className="section-label">JOB OPPORTUNITY</p>

            <h1>{job.title}</h1>

            <h2>{job.company}</h2>

            <div className="details-meta">

              <span>
                <MapPin size={16} />
                {job.location}
              </span>

              <span>
                <BriefcaseBusiness size={16} />
                {job.type}
              </span>

              <span>
                <Clock3 size={16} />
                {job.posted}
              </span>

            </div>

          </div>

          <div className="apply-box">

            <strong>{job.salary}</strong>

            <span>{job.experience}</span>

            <Link to={`/jobs/${id}/apply`}>
              Apply Now
            </Link>

          </div>

        </section>


        <div className="job-details-layout">

          <div className="job-details-main">

            <section className="details-section">

              <h2>About the Job</h2>

              <p>{job.description}</p>

            </section>


            <section className="details-section">

                <h2>Responsibilities</h2>

                <ul>
                  {job.responsibilities?.length > 0 ? (
                   job.responsibilities.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={18} />
                      {item}
                    </li>
                  ))
                ) : (
                 <li>
                  <CheckCircle2 size={18} />
                Responsibilities will be discussed during the recruitment process.
                 </li>
                )}
                 </ul>

</section>


            <section className="details-section">

              <h2>Required Skills</h2>

              <div className="details-skills">
                {job.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>

            </section>

          </div>


          <aside className="company-card">

            <div className="company-card-icon">
              <Building2 size={23} />
            </div>

            <h2>About the Company</h2>

            <h3>{job.company}</h3>

            <p>
              A growing organization focused on creating
              innovative products and providing meaningful
              career opportunities.
            </p>

            <div className="company-info">
              <span>Location</span>
              <strong>{job.location}</strong>
            </div>

            <div className="company-info">
              <span>Industry</span>
              <strong>Technology</strong>
            </div>

          </aside>

        </div>

      </div>

    </main>
  )
}

export default JobDetails