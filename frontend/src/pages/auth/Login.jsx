import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { BriefcaseBusiness, Mail, Lock, ArrowRight } from 'lucide-react'
import './Login.css'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
  e.preventDefault()

  if (!email || !password) {
    setError('Please enter your email and password.')
    return
  }

  try {
    setError('')

    const response = await api.post('/auth/login', {
      email,
      password,
    })

    const token = response.data.token
    const user = response.data.user

    localStorage.setItem('token', token)
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userEmail', email)

    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    }

    if (user?.role === 'recruiter') {
      navigate('/recruiter/dashboard')
    } else {
      navigate('/dashboard')
    }
  } catch (err) {
    console.error('Login failed:', err)

    setError(
      err.response?.data?.message ||
      'Invalid email or password.'
    )
  }
}

  return (
    <main className="login-page">

      <div className="login-card">

        <div className="login-logo">
            <span className="login-logo-icon">
                <BriefcaseBusiness size={21} />
            </span>

            <span className="login-logo-text">
                Career<span>Connect</span>
            </span>
        </div>

        <div className="login-header">
          <h1>Welcome back</h1>
          <p>
            Sign in to continue your job search.
          </p>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="login-form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <div className="login-input-wrapper">
              <Mail size={17} />

              <input
                id="email"
                type="email"
                placeholder="yourname@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

          </div>

          <div className="login-form-group">

            <div className="password-label">
              <label htmlFor="password">
                Password
              </label>

              <button
                type="button"
                className="forgot-password"
              >
                Forgot password?
              </button>
            </div>

            <div className="login-input-wrapper">
              <Lock size={17} />

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

          </div>

          <button
            type="submit"
            className="login-submit-button"
          >
            Sign In
            <ArrowRight size={17} />
          </button>

        </form>

        <div className="login-divider">
          <span>OR</span>
        </div>

        <p className="register-prompt">
          Don't have an account?{' '}

          <Link to="/register">
            Create an account
          </Link>
        </p>

      </div>

    </main>
  )
}

export default Login