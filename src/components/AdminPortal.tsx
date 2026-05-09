import { useState } from 'react'
import type { FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { AdminBookingsList } from '@/components/admin/AdminBookingsList'
import { apiBaseUrl } from '@/lib/apiBase'
import { decodeJwtPayload, isSuperAdminStaffPayload } from '@/lib/adminJwt'
import './AdminPortal.css'

const ADMIN_AUTH_KEY = 'taxi_super_admin_auth'
const ADMIN_ACCESS_TOKEN_KEY = 'taxi_super_admin_access_token'

function clearAdminSession(): void {
  localStorage.removeItem(ADMIN_AUTH_KEY)
  localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY)
}

async function readSigninError(res: Response): Promise<string> {
  const text = await res.text()
  try {
    const j = JSON.parse(text) as { message?: unknown }
    if (Array.isArray(j.message)) {
      return j.message.map(String).join('\n')
    }
    if (typeof j.message === 'string') {
      return j.message
    }
  } catch {
    /* ignore */
  }
  return text.trim() || `Sign in failed (${res.status})`
}

function readStoredSuperAdminSession(): {
  isAuthenticated: boolean
  accessToken: string | null
} {
  const ok = localStorage.getItem(ADMIN_AUTH_KEY) === 'true'
  const token = localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY)
  if (!ok || !token) {
    return { isAuthenticated: false, accessToken: null }
  }
  const payload = decodeJwtPayload(token)
  if (!payload?.exp || payload.exp * 1000 < Date.now()) {
    clearAdminSession()
    return { isAuthenticated: false, accessToken: null }
  }
  if (isSuperAdminStaffPayload(payload)) {
    return { isAuthenticated: true, accessToken: token }
  }
  clearAdminSession()
  return { isAuthenticated: false, accessToken: null }
}

export function AdminPortal() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [{ isAuthenticated, accessToken }, setAuth] = useState(readStoredSuperAdminSession)
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setSubmitting(true)

    try {
      const res = await fetch(`${apiBaseUrl()}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      })

      if (!res.ok) {
        setErrorMessage(await readSigninError(res))
        return
      }

      const data = (await res.json()) as { access_token?: string }
      const accessToken = data.access_token
      if (!accessToken) {
        setErrorMessage('Server did not return an access token.')
        return
      }

      const payload = decodeJwtPayload(accessToken)
      if (!isSuperAdminStaffPayload(payload)) {
        setErrorMessage(
          'This account is not a super admin. Use npm run create-admin (answer y to super admin) or npm run promote-super-admin.',
        )
        return
      }

      localStorage.setItem(ADMIN_AUTH_KEY, 'true')
      localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, accessToken)
      setAuth({ isAuthenticated: true, accessToken })
      setPassword('')
    } catch {
      setErrorMessage(
        `Could not reach the API at ${apiBaseUrl()}. Set VITE_API_BASE_URL in frontend/.env if the backend runs elsewhere.`,
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => {
    clearAdminSession()
    setAuth({ isAuthenticated: false, accessToken: null })
    setPassword('')
  }

  if (isAuthenticated) {
    return (
      <main className="admin-portal-page admin-portal-page--dashboard">
        <div className="admin-dashboard-body">
          {accessToken ? (
            <AdminBookingsList accessToken={accessToken} onLogout={handleLogout} />
          ) : (
            <p className="admin-dashboard-fallback">Restoring session…</p>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="admin-portal-page">
      <div className="admin-portal-inner">
        <p className="admin-brand-title">Taxi Barcelona24</p>
        <section className="admin-card admin-card--login">
          <h1 className="admin-title admin-title--login">Admin Login</h1>
          <p className="admin-subtitle admin-subtitle--login">Sign in as super admin to continue.</p>

          <form
            onSubmit={(e) => void handleLogin(e)}
            className="admin-form admin-form--login"
            autoComplete="off"
          >
            <label className="admin-field-label" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              name="admin-email-no-autofill"
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="admin-input"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <label className="admin-field-label" htmlFor="admin-password">
              Password
            </label>
            <div className="admin-password-wrap">
              <input
                id="admin-password"
                name="admin-password-no-autofill"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="admin-input admin-input--password"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
              </button>
            </div>
            {errorMessage ? <p className="admin-error">{errorMessage}</p> : null}
            <button type="submit" className="admin-button" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign In to Admin'}
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
