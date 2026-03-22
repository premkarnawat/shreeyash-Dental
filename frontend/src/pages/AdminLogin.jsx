import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { StoreProvider, useStore } from '../hooks/useStore'

function LoginForm() {
  const { adminLogin } = useStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ user: '', pass: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!form.user || !form.pass) { setError('Please enter both fields.'); return }
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 600))
    const ok = adminLogin(form.user, form.pass)
    setLoading(false)
    if (ok) navigate('/admin')
    else setError('Invalid credentials. Try admin / clinic123')
  }

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07), transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.05), transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative"
      >
        <div className="glass rounded-3xl p-10 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600" />

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 glass-green rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={22} className="text-emerald-400" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-white mb-1">Admin Portal</h1>
            <p className="text-white/40 text-[13px]">Shree Yash Dental Clinic Management</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-xl px-4 py-3 mb-5 text-[13px] text-red-400"
              style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}
            >
              <AlertCircle size={14} />
              {error}
            </motion.div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-widest mb-2 block">Username</label>
              <input
                className="input-glass"
                placeholder="admin"
                value={form.user}
                onChange={e => setForm(f => ({ ...f, user: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-widest mb-2 block">Password</label>
              <div className="relative">
                <input
                  className="input-glass pr-10"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.pass}
                  onChange={e => setForm(f => ({ ...f, pass: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 text-[14px]"
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
              : <>🔐 Login to Dashboard</>
            }
          </button>

          <p className="text-center text-white/25 text-[11px] mt-5 font-mono">
            Demo credentials: admin / clinic123
          </p>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-white/30 hover:text-emerald-400 transition-colors text-[13px]">
            ← Back to Website
          </a>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminLogin() {
  return <StoreProvider><LoginForm /></StoreProvider>
}
