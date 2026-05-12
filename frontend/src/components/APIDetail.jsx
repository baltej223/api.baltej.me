import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '/api'

const TYPE_COLORS = {
  static: { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' },
  proxy: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' },
  module: { bg: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' },
}

export default function APIDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [api, setApi] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toggling, setToggling] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/apis/${id}`, {
          credentials: 'include',
        })
        if (!res.ok) throw new Error('Failed to load API details')
        const data = await res.json()
        setApi(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchApi()
  }, [id])

  const handleToggle = async () => {
    if (!api || toggling) return
    const prevStatus = api.status
    setApi(prev => ({ ...prev, status: prev.status === 'running' ? 'stopped' : 'running' }))
    setToggling(true)

    try {
      await fetch(`${BACKEND_URL}/apis/${id}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
      })
    } catch {
      setApi(prev => ({ ...prev, status: prevStatus }))
    } finally {
      setToggling(false)
    }
  }

  const handleDelete = async () => {
    if (!api || deleting) return
    if (!confirm('Are you sure you want to delete this API?')) return
    setDeleting(true)

    try {
      await fetch(`${BACKEND_URL}/apis/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      navigate('/dashboard')
    } catch {
      setError('Failed to delete API')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col p-6 box-border">
        <div className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
          <nav className="flex justify-between items-center p-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
            <h1 className="text-xl font-semibold text-[var(--color-text-h)] m-0">API Details</h1>
          </nav>
          <div className="p-6 text-center text-[var(--color-text)]">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col p-6 box-border">
        <div className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
          <nav className="flex justify-between items-center p-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
            <h1 className="text-xl font-semibold text-[var(--color-text-h)] m-0">API Details</h1>
          </nav>
          <div className="p-6 text-center">
            <p className="text-[var(--color-error)] mb-4">{error}</p>
            <button className="btn-pill" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    )
  }

  const typeColors = TYPE_COLORS[api.type] || TYPE_COLORS.static
  const typeLabel = api.type === 'static' ? 'Static API' : api.type === 'proxy' ? 'Proxy API' : 'Module'
  const fullUrl = `http://localhost:3000${api.endpoint}`
  const config = api.config || {}

  return (
    <div className="flex-1 flex flex-col p-6 box-border">
      <div className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <nav className="flex justify-between items-center p-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <button className="bg-transparent border-none text-[var(--color-text)] text-sm cursor-pointer p-0 hover:text-[var(--color-accent)]" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h1 className="text-xl font-semibold text-[var(--color-text-h)] m-0">API Details</h1>
          <div />
        </nav>

        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-[var(--color-text-h)] m-0">{api.name}</h2>
            <div className="flex gap-3">
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: typeColors.bg, color: typeColors.color }}>
                {typeLabel}
              </span>
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${api.status === 'Running' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <span className={`w-2 h-2 rounded-full ${api.status === 'Running' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                {api.status === 'Running' ? 'Running' : 'Stopped'}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-[var(--color-text-h)] uppercase tracking-wider m-0 mb-4">Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-[var(--color-text)] uppercase tracking-wider">Endpoint Path</span>
                <span className="font-[var(--font-mono)] bg-[var(--color-code-bg)] p-2 rounded-md text-sm text-[var(--color-text-h)] inline-block">{api.endpoint}</span>
              </div>

              {api.type === 'static' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-[var(--color-text)] uppercase tracking-wider">HTTP Status Code</span>
                    <span className="font-[var(--font-mono)] bg-[var(--color-code-bg)] p-2 rounded-md text-sm text-[var(--color-text-h)] inline-block">{config.staticStatus || 200}</span>
                  </div>
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <span className="text-xs text-[var(--color-text)] uppercase tracking-wider">Response Body</span>
                    <pre className="bg-[var(--color-code-bg)] p-3 rounded-lg font-[var(--font-mono)] text-sm text-[var(--color-text-h)] whitespace-pre-wrap break-all m-0 border border-[var(--color-border)]">{config.staticBody}</pre>
                  </div>
                </>
              )}

              {api.type === 'proxy' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-[var(--color-text)] uppercase tracking-wider">Upstream URL</span>
                    <span className="font-[var(--font-mono)] bg-[var(--color-code-bg)] p-2 rounded-md text-sm text-[var(--color-text-h)] inline-block">{config.upstreamUrl}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-[var(--color-text)] uppercase tracking-wider">Strip Prefix</span>
                    <span className="font-[var(--font-mono)] bg-[var(--color-code-bg)] p-2 rounded-md text-sm text-[var(--color-text-h)] inline-block">{config.stripPrefix ? 'Yes' : 'No'}</span>
                  </div>
                </>
              )}

              {api.type === 'module' && (
                <div className="col-span-2 flex flex-col gap-1.5">
                  <span className="text-xs text-[var(--color-text)] uppercase tracking-wider">Handler Code</span>
                  <pre className="bg-[var(--color-code-bg)] p-3 rounded-lg font-[var(--font-mono)] text-sm text-[var(--color-text-h)] whitespace-pre-wrap break-all m-0 border border-[var(--color-border)]">{config.moduleCode || ''}</pre>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-[var(--color-text-h)] uppercase tracking-wider m-0 mb-4">Deployment Info</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-[var(--color-text)] uppercase tracking-wider">Created</span>
                <span className="text-sm text-[var(--color-text-h)]">{new Date(api.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-[var(--color-text)] uppercase tracking-wider">Last Updated</span>
                <span className="text-sm text-[var(--color-text-h)]">{new Date(api.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-[var(--color-text)] uppercase tracking-wider">Region</span>
                <span className="text-sm text-[var(--color-text-h)]">{api.region || 'us-east-1'}</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-[var(--color-text-h)] uppercase tracking-wider m-0 mb-4">Endpoints</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 p-3 bg-[var(--color-code-bg)] border border-[var(--color-border)] rounded-lg">
                <span className="font-[var(--font-mono)] text-xs font-semibold text-[var(--color-accent)] px-2 py-1 bg-[var(--color-accent-bg)] rounded">GET</span>
                <span className="font-[var(--font-mono)] text-sm text-[var(--color-text-h)]">{fullUrl}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-[var(--color-border)]">
            <button
              className={`btn-pill ${api.status === 'Running' ? '' : 'primary'}`}
              onClick={handleToggle}
              disabled={toggling}
            >
              {toggling ? 'Toggling...' : api.status === 'Running' ? 'Stop' : 'Start'}
            </button>
            <button
              className="btn-pill bg-[var(--color-error-bg)] border-[var(--color-error)] text-[var(--color-error)] hover:bg-red-200"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
