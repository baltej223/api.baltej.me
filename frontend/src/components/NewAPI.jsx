import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '/api'

const API_TYPES = [
  { id: 'static', label: 'Static API', desc: 'Returns a fixed JSON response' },
  { id: 'proxy', label: 'Proxy API', desc: 'Forwards requests to an upstream URL' },
  { id: 'module', label: 'Module', desc: 'Custom JS handler function' },
]

const DEFAULT_HANDLER = `export default async function handler(req) {
  return {
    status: 200,
    body: { message: 'Hello from module handler' }
  }
}`

export default function NewAPI() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState(null)
  const [name, setName] = useState('')
  const [endpoint, setEndpoint] = useState('')
  const [statusCode, setStatusCode] = useState(200)
  const [responseBody, setResponseBody] = useState('{}')
  const [upstreamUrl, setUpstreamUrl] = useState('')
  const [stripPrefix, setStripPrefix] = useState(false)
  const [handlerCode, setHandlerCode] = useState(DEFAULT_HANDLER)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId)
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
    setSelectedType(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload = { name, endpoint, type: selectedType }

    if (selectedType === 'static') {
      payload.statusCode = parseInt(statusCode, 10)
      payload.responseBody = responseBody
    } else if (selectedType === 'proxy') {
      payload.upstreamUrl = upstreamUrl
      payload.stripPrefix = stripPrefix
    } else if (selectedType === 'module') {
      payload.handlerCode = handlerCode
    }

    try {
      const res = await fetch(`${BACKEND_URL}/apis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create API')
      }

      const data = await res.json()
      navigate(`/info/${data.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full p-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-code-bg)] text-[var(--color-text)] font-[var(--font-mono)] text-sm focus:outline-none focus:border-[var(--color-accent)] box-border'

  return (
    <div className="flex-1 flex flex-col p-6 box-border">
      <div className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <nav className="flex justify-between items-center p-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <h1 className="text-xl font-semibold text-[var(--color-text-h)] m-0">New API</h1>
          <button className="btn-pill" onClick={() => navigate('/dashboard')}>Cancel</button>
        </nav>

        <div className="p-6">
          <div className="font-[var(--font-mono)] text-sm text-[var(--color-text)] mb-8 flex items-center gap-2">
            <span className={step >= 1 ? 'text-[var(--color-accent)] font-semibold' : ''}>01 Type</span>
            <span className="opacity-50">›</span>
            <span className={step >= 2 ? 'text-[var(--color-accent)] font-semibold' : ''}>02 Details</span>
          </div>

          {step === 1 && (
            <div className="grid grid-cols-3 gap-4 max-w-[800px] mx-auto">
              {API_TYPES.map(type => (
                <button
                  key={type.id}
                  className="flex flex-col items-center gap-2 p-8 bg-[var(--color-code-bg)] border-2 border-[var(--color-border)] rounded-xl cursor-pointer transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)]"
                  onClick={() => handleTypeSelect(type.id)}
                >
                  <span className="text-lg font-semibold text-[var(--color-text-h)]">{type.label}</span>
                  <span className="text-sm text-[var(--color-text)]">{type.desc}</span>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <form className="max-w-[600px] mx-auto text-left" onSubmit={handleSubmit}>
              <button type="button" className="bg-transparent border-none text-[var(--color-text)] text-sm cursor-pointer p-0 mb-6 hover:text-[var(--color-accent)]" onClick={handleBack}>
                ← Back
              </button>

              <div className="mb-5">
                <label className="block text-sm font-medium text-[var(--color-text-h)] mb-2">API Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="My Awesome API"
                  required
                  className={inputClass}
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-[var(--color-text-h)] mb-2">Endpoint Path</label>
                <input
                  type="text"
                  value={endpoint}
                  onChange={e => setEndpoint(e.target.value)}
                  placeholder="/weather"
                  required
                  className={inputClass}
                />
              </div>

              {selectedType === 'static' && (
                <>
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-[var(--color-text-h)] mb-2">HTTP Status Code</label>
                    <input
                      type="number"
                      value={statusCode}
                      onChange={e => setStatusCode(e.target.value)}
                      min="100"
                      max="599"
                      className={inputClass}
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-[var(--color-text-h)] mb-2">Response Body (JSON)</label>
                    <textarea
                      value={responseBody}
                      onChange={e => setResponseBody(e.target.value)}
                      rows="8"
                      required
                      className={`${inputClass} resize-y`}
                    />
                  </div>
                </>
              )}

              {selectedType === 'proxy' && (
                <>
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-[var(--color-text-h)] mb-2">Upstream URL</label>
                    <input
                      type="url"
                      value={upstreamUrl}
                      onChange={e => setUpstreamUrl(e.target.value)}
                      placeholder="https://api.example.com"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div className="mb-5 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="stripPrefix"
                      checked={stripPrefix}
                      onChange={e => setStripPrefix(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="stripPrefix" className="text-sm text-[var(--color-text-h)] cursor-pointer">Strip prefix from requests</label>
                  </div>
                </>
              )}

              {selectedType === 'module' && (
                <div className="mb-5">
                  <label className="block text-sm font-medium text-[var(--color-text-h)] mb-2">Handler Code</label>
                  <textarea
                    value={handlerCode}
                    onChange={e => setHandlerCode(e.target.value)}
                    rows="12"
                    required
                    className={`${inputClass} resize-y`}
                  />
                </div>
              )}

              {error && (
                <div className="p-3 bg-[var(--color-error-bg)] text-[var(--color-error)] rounded-lg text-sm mb-5">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 mt-8">
                <button type="submit" className="btn-pill primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create API'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
