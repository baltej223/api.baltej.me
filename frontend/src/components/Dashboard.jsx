import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '/api'

export default function Dashboard() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const [apis, setApis] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApis = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/apis`, {
          credentials: 'include',
        })
        if (!res.ok) throw new Error('Failed to fetch APIs')
        const data = await res.json()
        setApis(data)
      } catch (err) {
        console.error('Failed to fetch APIs:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchApis()
  }, [])

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Running' ? 'Stopped' : 'Running'
    
    setApis(prev => prev.map(a => 
      a._id === id ? { ...a, status: newStatus } : a
    ))

    try {
      await fetch(`${BACKEND_URL}/apis/${id}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
      })
    } catch (err) {
      console.error('Failed to toggle status:', err)
      setApis(prev => prev.map(a => 
        a._id === id ? { ...a, status: currentStatus } : a
      ))
    }
  }

  const handleLogin = () => navigate('/login')
  const handleSignout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-panel">
        <nav className="dashboard-nav">
          <h1 className="dashboard-title">DashBoard</h1>
          <div className="nav-controls">
            <button className="btn-pill" onClick={() => navigate('/new')}>
              New API
            </button>
            {!token ? (
              <button className="btn-pill" onClick={handleLogin}>
                Login
              </button>
            ) : (
              <>
                <span className="nav-divider">|</span>
                <button className="btn-pill" onClick={handleSignout}>
                  Signout
                </button>
              </>
            )}
          </div>
        </nav>

        <div className="dashboard-body">
          {loading ? (
            <div className="text-center text-[var(--color-text)]">Loading...</div>
          ) : apis.length === 0 ? (
            <div className="text-center text-[var(--color-text)]">No APIs yet. Create one to get started!</div>
          ) : (
            <div className="api-list">
              {apis.map(api => (
                <div
                  key={api._id}
                  className="api-row cursor-pointer"
                  onClick={() => navigate(`/info/${api._id}`)}
                >
                  <span className="api-name">{api.name}</span>
                  <button
                    className={`status-badge ${api.status === 'Running' ? 'running' : 'stopped'}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleStatus(api._id, api.status)
                    }}
                  >
                    {api.status === 'Running' ? 'Running' : 'Stopped'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}