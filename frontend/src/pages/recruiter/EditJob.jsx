import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import api from '../../services/api'
import './EditJob.css'

function EditJob() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

useEffect(() => {
  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}`)

      console.log('Edit Job API response:', response.data)

      const job = response.data.job

      setFormData({
        title: job.jobTitle || '',
        company: job.company || '',
        location: job.location || '',
        type: job.jobType || 'Full-time',
        experience: job.experience || 'Fresher',
        salary: job.salary || '',
        skills: Array.isArray(job.skills)
          ? job.skills.join(', ')
          : '',
        description: job.description || '',
      })
    } catch (err) {
      console.error('Failed to fetch job:', err)

      setError(
        err.response?.data?.message ||
        'Unable to load this job.'
      )
    } finally {
      setLoading(false)
    }
  }

  fetchJob()
}, [id])

  if (loading) {
    return (
      <main className="edit-job-page">
        <div className="container not-found">
          <h1>Loading Job...</h1>

          <Link to="/recruiter/dashboard">
            Back to Dashboard
          </Link>
        </div>
      </main>
    )
  }

  if (error || !formData) {
  return (
    <main className="edit-job-page">
      <div className="container not-found">
        <h1>Job not found</h1>

        <p>{error}</p>

        <Link to="/recruiter/dashboard">
          Back to Dashboard
        </Link>
      </div>
    </main>
  )
}

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    setError('')

    const response = await api.put(`/jobs/${id}`, {
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

    console.log('Update Job API response:', response.data)

    navigate('/recruiter/dashboard')
  } catch (err) {
    console.error('Failed to update job:', err)

    setError(
      err.response?.data?.message ||
      'Unable to update this job.'
    )
  }
}

  return (
    <main className="edit-job-page">
      <div className="container">

        <Link
          to="/recruiter/dashboard"
          className="edit-job-back"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="edit-job-header">
          <p className="section-label">RECRUITER</p>
          <h1>Edit Job</h1>
          <p>
            Update the details of your job posting.
          </p>
        </div>

        <form
          className="edit-job-form"
          onSubmit={handleSubmit}
        >

          <div className="form-grid">

            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Job Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>
            </div>

            <div className="form-group">
              <label>Experience</label>
              <select
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

            <div className="form-group">
              <label>Salary</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="form-group">
            <label>Skills</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Python, React, MongoDB"
              required
            />
            <small>
              Separate skills using commas.
            </small>
          </div>

          <div className="form-group">
            <label>Job Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="7"
              required
            />
          </div>

          <div className="edit-job-actions">

            <Link
              to="/recruiter/dashboard"
              className="cancel-button"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="save-job-button"
            >
              Save Changes
            </button>

          </div>

        </form>

      </div>
    </main>
  )
}

export default EditJob