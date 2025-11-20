import { useState } from 'react'
import Hero from './components/Hero'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'

function App() {
  const [token, setToken] = useState('')
  const [meta, setMeta] = useState(null)

  const handleAuth = (t, m) => { setToken(t); setMeta(m) }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Hero />
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-24 -mt-24">
        {!token ? (
          <Auth onAuth={handleAuth} />
        ) : (
          <Dashboard token={token} userMeta={meta} />
        )}

        <div className="mt-8 text-xs text-blue-300/70">
          • Geofence required: attendance only marks within allowed radius. • Face data is encrypted and removable.
        </div>
      </div>
    </div>
  )
}

export default App
