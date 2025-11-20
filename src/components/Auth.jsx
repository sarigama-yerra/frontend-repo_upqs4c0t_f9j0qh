import { useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // shared fields
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // register fields
  const [fullName, setFullName] = useState('')
  const [department, setDepartment] = useState('')
  const [classSection, setClassSection] = useState('')
  const [studentId, setStudentId] = useState('')

  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handleRegister = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          department,
          class_section: classSection,
          username,
          password,
          student_id: studentId || null,
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Registration failed')
      alert('Registered! Await approval by faculty/admin.')
      setMode('login')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')
      onAuth(data.access_token, data)
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  const handleForgot = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/auth/forgot`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      })
      const data = await res.json()
      if (data.reset_token) {
        setResetToken(data.reset_token)
      }
      alert('If the user exists, a reset token is returned below for demo.')
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  const handleReset = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/auth/reset`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, new_password: newPassword })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Reset failed')
      alert('Password updated!')
      setMode('login')
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6 text-blue-100">
      <div className="flex gap-2 mb-4">
        {['login','register','forgot','reset'].map(m => (
          <button key={m} onClick={() => setMode(m)} className={`px-3 py-1 rounded ${mode===m?'bg-blue-600 text-white':'bg-slate-700 hover:bg-slate-600'}`}>
            {m}
          </button>
        ))}
      </div>

      {mode==='register' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="bg-slate-900/60 rounded px-3 py-2" placeholder="Full Name" value={fullName} onChange={e=>setFullName(e.target.value)} />
          <input className="bg-slate-900/60 rounded px-3 py-2" placeholder="Department" value={department} onChange={e=>setDepartment(e.target.value)} />
          <input className="bg-slate-900/60 rounded px-3 py-2" placeholder="Class / Section" value={classSection} onChange={e=>setClassSection(e.target.value)} />
          <input className="bg-slate-900/60 rounded px-3 py-2" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <input type="password" className="bg-slate-900/60 rounded px-3 py-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <input className="bg-slate-900/60 rounded px-3 py-2" placeholder="Student ID (optional)" value={studentId} onChange={e=>setStudentId(e.target.value)} />
          <button onClick={handleRegister} disabled={loading} className="md:col-span-2 bg-blue-600 hover:bg-blue-700 rounded py-2 font-semibold">{loading?'Please wait...':'Create Account'}</button>
          {error && <p className="md:col-span-2 text-red-300">{error}</p>}
        </div>
      )}

      {mode==='login' && (
        <div className="grid gap-3">
          <input className="bg-slate-900/60 rounded px-3 py-2" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <input type="password" className="bg-slate-900/60 rounded px-3 py-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button onClick={handleLogin} disabled={loading} className="bg-blue-600 hover:bg-blue-700 rounded py-2 font-semibold">{loading?'Please wait...':'Login'}</button>
          <button onClick={handleForgot} className="text-blue-300 underline text-sm text-left">Forgot password?</button>
          {resetToken && <div className="text-xs break-all">Reset token (demo): {resetToken}</div>}
          {error && <p className="text-red-300">{error}</p>}
        </div>
      )}

      {mode==='forgot' && (
        <div className="grid gap-3">
          <input className="bg-slate-900/60 rounded px-3 py-2" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <button onClick={handleForgot} disabled={loading} className="bg-blue-600 hover:bg-blue-700 rounded py-2 font-semibold">{loading?'Please wait...':'Send Reset'}</button>
          {resetToken && <div className="text-xs break-all">Reset token (demo): {resetToken}</div>}
          {error && <p className="text-red-300">{error}</p>}
        </div>
      )}

      {mode==='reset' && (
        <div className="grid gap-3">
          <input className="bg-slate-900/60 rounded px-3 py-2" placeholder="Reset Token" value={resetToken} onChange={e=>setResetToken(e.target.value)} />
          <input type="password" className="bg-slate-900/60 rounded px-3 py-2" placeholder="New Password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
          <button onClick={handleReset} disabled={loading} className="bg-blue-600 hover:bg-blue-700 rounded py-2 font-semibold">{loading?'Please wait...':'Update Password'}</button>
          {error && <p className="text-red-300">{error}</p>}
        </div>
      )}
    </div>
  )
}
