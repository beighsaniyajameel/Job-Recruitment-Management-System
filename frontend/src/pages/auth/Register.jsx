import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import {
  BriefcaseBusiness,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import './Register.css'

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'jobseeker',
  })

  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState('')
  const [registered, setRegistered] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
  setError('')

  const response = await api.post('/auth/register', {
    name: formData.fullName,
    email: formData.email,
    password: formData.password,
    role: 'job_seeker',
  })

  const token = response.data.token
  const user = response.data.user

  localStorage.setItem('token', token)
  localStorage.setItem('isLoggedIn', 'true')
  localStorage.setItem('userEmail', formData.email)

  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  }

  setRegistered(true)
} catch (err) {
  console.error('Registration failed:', err)

  setError(
    err.response?.data?.message ||
    'Unable to create your account.'
  )
}
  }

  if (registered) {
    return (
      <main className="register-page">
        <div className="register-success">

          <div className="register-success-icon">
            <CheckCircle2 size={42} />
          </div>

          <span className="register-success-label">
            ACCOUNT CREATED
          </span>

          <h1>Welcome to CareerConnect!</h1>

          <p>
            Your account has been created successfully.
            You can now sign in and start exploring
            opportunities.
          </p>

          <button
            className="register-success-button"
            onClick={() => navigate('/login')}
          >
            Continue to Sign In
            <ArrowRight size={17} />
          </button>

        </div>
      </main>
    )
  }

  return (
    <main className="register-page">

      <div className="register-card">

        <div className="register-logo">

          <span className="register-logo-icon">
            <BriefcaseBusiness size={21} />
          </span>

          <span className="register-logo-text">
            Career<span>Connect</span>
          </span>

        </div>

        <div className="register-header">
          <h1>Create your account</h1>

          <p>
            Join CareerConnect and find your next opportunity.
          </p>
        </div>

        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="register-form-group">

            <label htmlFor="fullName">
              Full Name
            </label>

            <div className="register-input-wrapper">
              <User size={17} />

              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="register-form-row">

            <div className="register-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="register-input-wrapper">
                <Mail size={17} />

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

            <div className="register-form-group">

              <label htmlFor="phone">
                Phone Number
              </label>

              <div className="register-input-wrapper">
                <Phone size={17} />

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

          </div>

          <div className="register-form-row">

            <div className="register-form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="register-input-wrapper">
                <Lock size={17} />

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="register-form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="register-input-wrapper">
                <Lock size={17} />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

            </div>

          </div>

          <div className="role-section">

            <label className="role-label">
              I am registering as
            </label>

            <div className="role-options">

              <label
                className={`role-option ${
                  formData.role === 'jobseeker'
                    ? 'selected'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="jobseeker"
                  checked={formData.role === 'jobseeker'}
                  onChange={handleChange}
                />

                <div>
                  <strong>Job Seeker</strong>
                  <span>Find and apply for jobs</span>
                </div>

              </label>

              <label
                className={`role-option ${
                  formData.role === 'recruiter'
                    ? 'selected'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={formData.role === 'recruiter'}
                  onChange={handleChange}
                />

                <div>
                  <strong>Recruiter</strong>
                  <span>Post jobs and find talent</span>
                </div>

              </label>

            </div>

          </div>

          <label className="terms-row">

            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) =>
                setTermsAccepted(e.target.checked)
              }
            />

            <span>
              I agree to the Terms and Conditions and
              Privacy Policy.
            </span>

          </label>

          <button
            type="submit"
            className="register-submit-button"
          >
            Create Account
            <ArrowRight size={17} />
          </button>

        </form>

        <div className="register-divider">
          <span>OR</span>
        </div>

        <p className="login-prompt">
          Already have an account?{' '}

          <Link to="/login">
            Sign in
          </Link>
        </p>

      </div>

    </main>
  )
}

export default Register