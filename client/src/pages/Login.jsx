import { useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import { supabase } from '../services/supabase'
import '../styles/Login.css'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState('user')

  // Check for existing session on mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        onLogin({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email.split('@')[0]
        })
      }
    }
    checkUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        onLogin({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email.split('@')[0]
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [onLogin])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let result
      if (isRegister) {
        result = await authAPI.register(email, password, name, relationship)
      } else {
        result = await authAPI.login(email, password)
      }

      // Supabase handles session storage automatically
      // The auth state change listener will trigger onLogin
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Expense Tracker</h1>
        <p className="form-subtitle">{isRegister ? 'Create Account' : 'Login'}</p>

        {error && <p className="error">{error}</p>}

        {isRegister && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
            >
              <option value="user">User</option>
              <option value="wife">Wife</option>
            </select>
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : (isRegister ? 'Register' : 'Login')}
        </button>

        <p className="toggle-form">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister)
              setError('')
              setEmail('')
              setPassword('')
              setName('')
            }}
            className="link-btn"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </form>
    </div>
  )
}

export default Login
