import { createContext, useContext, useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'

const AuthContext = createContext(null)

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '/api'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verify session on app load
  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/verify`, {
          method: 'GET',
          credentials: 'include', // Send HTTP-only cookie
        })
        
        if (response.ok) {
          const data = await response.json()
          setToken('authenticated')
          setUser(data.user || null)
        } else {
          setToken(null)
          setUser(null)
        }
      } catch (error) {
        console.error('Session verification failed:', error)
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    verifySession()
  }, [])

  const login = (userData = null) => {
    setToken('authenticated')
    setUser(userData)
  }

  const logout = async () => {
    try {
      await fetch(`${BACKEND_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setToken(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}