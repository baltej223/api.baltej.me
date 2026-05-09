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
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      login()
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="max-w-[360px] mx-auto mt-20 p-8 border border-[--color-border] rounded-lg text-left">
      <h2 className="text-2xl font-medium text-[--color-text-h] mb-6 text-center">Login</h2>
      {error && <p className="text-[--color-error] mb-4 p-2 bg-[--color-error-bg] rounded">{error}</p>}
      <div className="mb-5">
        <label htmlFor="email" className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-[10px] border border-[--color-border] rounded text-base focus:outline-none focus:border-[--color-accent] box-border"
        />
      </div>
      <div className="mb-5">
        <label htmlFor="password" className="block mb-2 font-medium">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-[10px] border border-[--color-border] rounded text-base focus:outline-none focus:border-[--color-accent] box-border"
        />
      </div>
      <button type="button" onClick={handleSubmit} disabled={loading} className="w-full py-3 mt-3 bg-[--color-accent] text-white border-none rounded cursor-pointer text-base hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <p className="mt-3 text-sm">
        Don't have an account? <Link to="/register" className="text-[--color-accent] hover:underline">Create one</Link>
      </p>
    </form>
  )
}