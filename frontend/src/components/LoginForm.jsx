import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const backendUrl = import.meta.env.VITE_BACKEND_URL || '/api'

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // required for cookies
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Backend handles JWT via HTTP-only cookie
      // Just store user/session state if needed
      login()

      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="auth-form">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <button type="button" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <p className="switch-link">
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </form>
  )
}
