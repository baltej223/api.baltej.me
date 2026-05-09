import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '/api'

const initialApis = [
  { id: 1, name: 'Current Spotify playing API', status: 'running' },
  { id: 2, name: 'Current Apple Music playing API', status: 'stopped' },
  { id: 3, name: 'Readme API', status: 'running' },
  { id: 4, name: 'Admin API', status: 'running' },
]

export default function Dashboard() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const [apis, setApis] = useState(initialApis)

  const handleToggleStatus = async (id) => {
    const api = apis.find(a => a.id === id)
    const newStatus = api.status === 'running' ? 'stopped' : 'running'
    
    setApis(prev => prev.map(a => 
      a.id === id ? { ...a, status: newStatus } : a
    ))

    try {
      await fetch(`${BACKEND_URL}/apis/${id}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
      })
    } catch (err) {
      console.error('Failed to toggle status:', err)
      setApis(prev => prev.map(a => 
        a.id === id ? { ...a, status: api.status } : a
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
          <div className="api-list">
            {apis.map(api => (
              <div
                key={api.id}
                className="api-row cursor-pointer"
                onClick={() => navigate(`/api-info/${api.id}`)}
              >
                <span className="api-name">{api.name}</span>
                <button
                  className={`status-badge ${api.status}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleStatus(api.id)
                  }}
                >
                  {api.status === 'running' ? 'Running' : 'Stopped'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}