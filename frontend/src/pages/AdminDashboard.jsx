import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calendar, Clock, Scissors, Image,
  BarChart2, LogOut, Menu, X, Check, Trash2, Edit3,
  PlusCircle, AlertTriangle, Download, RefreshCw, Bell, ChevronRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { StoreProvider, useStore } from '../hooks/useStore'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'

// ─── SIDEBAR ─────────────────────────────────────────────────────
const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'schedule', label: 'Schedule & Holidays', icon: Clock },
  { id: 'services', label: 'Services & Pricing', icon: Scissors },
  { id: 'content', label: 'Gallery & News', icon: Image },
  { id: 'reports', label: 'Reports', icon: BarChart2 },
]

function Sidebar({ active, setActive, sideOpen, setSideOpen }) {
  const { adminLogout, clinicInfo } = useStore()
  const navigate = useNavigate()
  const logout = () => { adminLogout(); navigate('/admin/login') }

  return (
    <>
      {/* Overlay mobile */}
      {sideOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSideOpen(false)} />
      )}
      <aside className={`fixed top-0 left-0 h-full z-50 w-64 flex flex-col transition-transform duration-300
        ${sideOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ background: 'rgba(6,12,22,0.98)', backdropFilter: 'blur(30px)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 glass-green rounded-xl flex items-center justify-center text-emerald-400 font-display font-bold text-lg">S</div>
            <div>
              <div className="text-white text-[13px] font-semibold leading-none">Shree Yash</div>
              <div className="text-emerald-400/50 text-[10px] tracking-widest">ADMIN PANEL</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setActive(t.id); setSideOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200
                ${active === t.id
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}>
              <t.icon size={16} className={active === t.id ? 'text-emerald-400' : ''} />
              {t.label}
              {active === t.id && <ChevronRight size={12} className="ml-auto text-emerald-500/50" />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/5">
          <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-white/40 hover:text-white/70 hover:bg-white/5 transition-all mb-1">
            ← View Website
          </a>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  )
}

// ─── OVERVIEW ────────────────────────────────────────────────────
function Overview() {
  const { appointments, services, news, gallery, holidays } = useStore()
  const today = new Date().toISOString().split('T')[0]
  const todayApts = appointments.filter(a => a.date === today)
  const confirmed = appointments.filter(a => a.status === 'confirmed').length
  const pending = appointments.filter(a => a.status === 'pending').length

  const cards = [
    { label: 'Total Appointments', value: appointments.length, color: 'text-emerald-400', bg: 'from-emerald-500/10 to-emerald-700/5' },
    { label: "Today's Bookings", value: todayApts.length, color: 'text-blue-400', bg: 'from-blue-500/10 to-blue-700/5' },
    { label: 'Confirmed', value: confirmed, color: 'text-green-400', bg: 'from-green-500/10 to-green-700/5' },
    { label: 'Pending', value: pending, color: 'text-amber-400', bg: 'from-amber-500/10 to-amber-700/5' },
    { label: 'Services', value: services.length, color: 'text-purple-400', bg: 'from-purple-500/10 to-purple-700/5' },
    { label: 'Holidays Set', value: holidays.length, color: 'text-red-400', bg: 'from-red-500/10 to-red-700/5' },
  ]

  return (
    <div>
      <h2 className="font-display text-3xl font-semibold text-white mb-8">Dashboard Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`glass rounded-2xl p-5 bg-gradient-to-br ${c.bg}`}>
            <div className="text-white/40 text-[11px] uppercase tracking-widest mb-2">{c.label}</div>
            <div className={`font-display text-5xl font-semibold ${c.color}`}>{c.value}</div>
          </motion.div>
        ))}
      </div>

      <h3 className="font-display text-xl font-semibold text-white mb-4">Today's Appointments</h3>
      <AppointmentTable rows={todayApts} compact />
    </div>
  )
}

// ─── APPOINTMENT TABLE ────────────────────────────────────────────
function AppointmentTable({ rows, compact = false }) {
  const { updateAppointment, deleteAppointment } = useStore()

  const reschedule = (apt) => {
    const newDate = prompt('New date (YYYY-MM-DD):', apt.date)
    if (!newDate) return
    const newTime = prompt('New time (HH:MM):', apt.time)
    if (!newTime) return
    updateAppointment(apt.id, { date: newDate, time: newTime })
    toast.success('Appointment rescheduled!')
  }

  const statusColor = { confirmed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', pending: 'text-amber-400 bg-amber-500/10 border-amber-500/20', cancelled: 'text-red-400 bg-red-500/10 border-red-500/20' }

  if (!rows.length) return (
    <div className="glass rounded-2xl py-12 text-center text-white/30 text-[13px]">No appointments found.</div>
  )

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(16,185,129,0.06)' }}>
              {['Date', 'Time', 'Patient', 'Treatment', 'Phone', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-emerald-400/70 uppercase tracking-widest whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((apt, i) => (
              <motion.tr key={apt.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="border-t border-white/4 hover:bg-white/2 transition-colors">
                <td className="px-4 py-3 text-[13px] text-white/60 whitespace-nowrap">{apt.date}</td>
                <td className="px-4 py-3 text-[13px] text-white/70 font-mono whitespace-nowrap">{apt.time}</td>
                <td className="px-4 py-3 text-[13px] text-white font-medium whitespace-nowrap">{apt.name}</td>
                <td className="px-4 py-3 text-[12px] text-white/60 max-w-[180px] truncate">{apt.treatment}</td>
                <td className="px-4 py-3 text-[13px] text-white/50 font-mono whitespace-nowrap">{apt.phone}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border capitalize ${statusColor[apt.status]}`}>
                    {apt.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    {apt.status !== 'confirmed' && (
                      <button onClick={() => { updateAppointment(apt.id, { status: 'confirmed' }); toast.success('Confirmed!') }}
                        className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                        <Check size={13} />
                      </button>
                    )}
                    <button onClick={() => reschedule(apt)}
                      className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                      <Edit3 size={13} />
                    </button>
                    {apt.status !== 'cancelled' && (
                      <button onClick={() => { updateAppointment(apt.id, { status: 'cancelled' }); toast.success('Cancelled.') }}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                        <X size={13} />
                      </button>
                    )}
                    <button onClick={() => { if (window.confirm('Delete permanently?')) { deleteAppointment(apt.id); toast.success('Deleted.') } }}
                      className="p-1.5 rounded-lg bg-white/5 text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── APPOINTMENTS ─────────────────────────────────────────────────
function Appointments() {
  const { appointments } = useStore()
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDate, setFilterDate] = useState('')

  let filtered = appointments
  if (filterStatus) filtered = filtered.filter(a => a.status === filterStatus)
  if (filterDate) filtered = filtered.filter(a => a.date === filterDate)
  filtered = [...filtered].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="font-display text-3xl font-semibold text-white">All Appointments</h2>
        <div className="flex gap-2 flex-wrap">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-glass py-2 text-[13px] w-36">
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
            className="input-glass py-2 text-[13px] w-40" />
          <button onClick={() => { setFilterStatus(''); setFilterDate('') }}
            className="p-2 glass rounded-xl text-white/50 hover:text-white transition-colors">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
      <AppointmentTable rows={filtered} />
    </div>
  )
}

// ─── SCHEDULE ────────────────────────────────────────────────────
function Schedule() {
  const { schedule, updateSchedule, holidays, addHoliday, removeHoliday } = useStore()
  const [sched, setSched] = useState(schedule)
  const [hDate, setHDate] = useState('')
  const [hReason, setHReason] = useState('')
  const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']

  const save = () => { updateSchedule(sched); toast.success('Schedule updated!') }
  const addH = () => {
    if (!hDate) { toast.error('Select a date'); return }
    const ok = addHoliday({ date: hDate, reason: hReason || 'Holiday' })
    if (ok) { setHDate(''); setHReason(''); toast.success('Holiday added!') }
    else toast.error('That date is already a holiday.')
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-semibold text-white mb-6">Clinic Schedule</h2>
        <div className="glass rounded-2xl p-6">
          <div className="grid gap-3">
            {days.map(day => (
              <div key={day} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0 flex-wrap">
                <div className="w-28 text-[13px] font-medium text-white/70 capitalize">{day}</div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-10 h-5 rounded-full transition-colors relative ${!sched[day]?.closed ? 'bg-emerald-500' : 'bg-white/10'}`}
                    onClick={() => setSched(s => ({ ...s, [day]: { ...s[day], closed: !s[day]?.closed } }))}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${!sched[day]?.closed ? 'left-5' : 'left-0.5'}`} />
                  </div>
                  <span className="text-[12px] text-white/40">{sched[day]?.closed ? 'Closed' : 'Open'}</span>
                </label>
                {!sched[day]?.closed && (
                  <>
                    <div className="flex items-center gap-2">
                      <input type="time" value={sched[day]?.open || '09:00'}
                        onChange={e => setSched(s => ({ ...s, [day]: { ...s[day], open: e.target.value } }))}
                        className="input-glass py-1.5 text-[13px] w-28" />
                      <span className="text-white/30 text-sm">—</span>
                      <input type="time" value={sched[day]?.close || '20:00'}
                        onChange={e => setSched(s => ({ ...s, [day]: { ...s[day], close: e.target.value } }))}
                        className="input-glass py-1.5 text-[13px] w-28" />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <button onClick={save} className="btn-primary mt-5 text-[13px]">Save Schedule</button>
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl font-semibold text-white mb-4">Mark Holiday / Closed Day</h3>
        <div className="glass rounded-2xl p-6">
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex-1 min-w-[140px]">
              <label className="text-[11px] text-white/40 uppercase tracking-widest mb-2 block">Date</label>
              <input type="date" value={hDate} onChange={e => setHDate(e.target.value)} className="input-glass" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-[11px] text-white/40 uppercase tracking-widest mb-2 block">Reason</label>
              <input value={hReason} onChange={e => setHReason(e.target.value)} placeholder="e.g. Ganesh Chaturthi"
                className="input-glass" />
            </div>
            <div className="flex items-end">
              <button onClick={addH} className="btn-primary text-[13px]">
                <PlusCircle size={14} className="inline mr-1" /> Add Holiday
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {holidays.length === 0 && <span className="text-white/30 text-[13px]">No holidays set.</span>}
            {holidays.map(h => (
              <div key={h.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium text-amber-300"
                style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
                <AlertTriangle size={11} />
                {h.date} · {h.reason}
                <button onClick={() => { removeHoliday(h.id); toast.success('Holiday removed.') }}
                  className="text-white/30 hover:text-red-400 ml-1 transition-colors">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── SERVICES & PRICING ──────────────────────────────────────────
function ServicesAdmin() {
  const { services, addService, removeService, pricing, updatePricing } = useStore()
  const [form, setForm] = useState({ name: '', description: '', price: '', icon: '🦷' })

  const add = () => {
    if (!form.name || !form.price) { toast.error('Name and price required.'); return }
    addService({ ...form, category: 'general', featured: false })
    setForm({ name: '', description: '', price: '', icon: '🦷' })
    toast.success('Service added!')
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-semibold text-white mb-6">Add Service</h2>
        <div className="glass rounded-2xl p-6">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-widest mb-2 block">Service Name *</label>
              <input className="input-glass" placeholder="e.g. Root Canal Treatment"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-widest mb-2 block">Price Range *</label>
              <input className="input-glass" placeholder="e.g. ₹2,500 – ₹4,500"
                value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            </div>
          </div>
          <div className="grid sm:grid-cols-[1fr_80px] gap-4 mb-4">
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-widest mb-2 block">Description</label>
              <textarea className="input-glass resize-none" rows={2}
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-widest mb-2 block">Icon</label>
              <input className="input-glass text-2xl text-center" value={form.icon}
                onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} />
            </div>
          </div>
          <button onClick={add} className="btn-primary text-[13px]">
            <PlusCircle size={14} className="inline mr-1.5" /> Add Service
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl font-semibold text-white mb-4">Current Services ({services.length})</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(s => (
            <div key={s.id} className="glass rounded-2xl p-4 flex items-start gap-3 group">
              <div className="text-2xl">{s.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-[13px] font-semibold truncate">{s.name}</div>
                <div className="text-emerald-400 text-[12px]">{s.price}</div>
              </div>
              <button onClick={() => { if (window.confirm('Remove?')) { removeService(s.id); toast.success('Removed.') } }}
                className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl font-semibold text-white mb-4">Edit Pricing Tiers</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {pricing.map(plan => (
            <div key={plan.id} className="glass rounded-2xl p-5">
              <div className="text-white font-semibold mb-3">{plan.name}</div>
              <div>
                <label className="text-[11px] text-white/40 uppercase tracking-widest mb-2 block">Price</label>
                <input className="input-glass text-[13px]" value={plan.price}
                  onChange={e => updatePricing(plan.id, { price: e.target.value })} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── CONTENT ─────────────────────────────────────────────────────
function Content() {
  const { news, addNews, removeNews, gallery, addGallery, removeGallery } = useStore()
  const [nForm, setNForm] = useState({ title: '', content: '', category: 'Dental Camp', emoji: '🏕️' })
  const [gForm, setGForm] = useState({ label: '', category: 'Interior', emoji: '📸' })

  const categoryEmojis = { 'Dental Camp': '🏕️', 'New Treatment': '✨', 'Offer': '🎁', 'Technology': '⚙️', 'Announcement': '📢', 'Offer': '🎉' }

  const publishNews = () => {
    if (!nForm.title) { toast.error('Title required.'); return }
    addNews({ ...nForm, emoji: categoryEmojis[nForm.category] || '📰' })
    setNForm({ title: '', content: '', category: 'Dental Camp', emoji: '🏕️' })
    toast.success('News published!')
  }
  const addImg = () => {
    if (!gForm.label) { toast.error('Label required.'); return }
    addGallery(gForm)
    setGForm({ label: '', category: 'Interior', emoji: '📸' })
    toast.success('Gallery item added!')
  }

  return (
    <div className="space-y-8">
      {/* News */}
      <div>
        <h2 className="font-display text-3xl font-semibold text-white mb-6">Publish News / Update</h2>
        <div className="glass rounded-2xl p-6 mb-4">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-widest mb-2 block">Title *</label>
              <input className="input-glass" placeholder="News headline..."
                value={nForm.title} onChange={e => setNForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-widest mb-2 block">Category</label>
              <select className="input-glass" value={nForm.category} onChange={e => setNForm(f => ({ ...f, category: e.target.value }))}>
                {['Dental Camp', 'New Treatment', 'Offer', 'Technology', 'Announcement'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-[11px] text-white/40 uppercase tracking-widest mb-2 block">Content</label>
            <textarea className="input-glass resize-none" rows={3}
              value={nForm.content} onChange={e => setNForm(f => ({ ...f, content: e.target.value }))} />
          </div>
          <button onClick={publishNews} className="btn-primary text-[13px]">
            <Bell size={14} className="inline mr-1.5" /> Publish News
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {news.map(n => (
            <div key={n.id} className="glass rounded-2xl p-4 flex items-start gap-3 group">
              <span className="text-2xl">{n.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-white text-[13px] font-semibold truncate">{n.title}</div>
                <div className="text-white/40 text-[11px]">{n.date} · {n.category}</div>
              </div>
              <button onClick={() => { removeNews(n.id); toast.success('Removed.') }}
                className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery */}
      <div>
        <h3 className="font-display text-xl font-semibold text-white mb-4">Gallery Management</h3>
        <div className="glass rounded-2xl p-6 mb-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[140px]">
              <label className="text-[11px] text-white/40 uppercase tracking-widest mb-2 block">Label *</label>
              <input className="input-glass" placeholder="e.g. Reception Area"
                value={gForm.label} onChange={e => setGForm(f => ({ ...f, label: e.target.value }))} />
            </div>
            <div className="w-32">
              <label className="text-[11px] text-white/40 uppercase tracking-widest mb-2 block">Category</label>
              <select className="input-glass" value={gForm.category} onChange={e => setGForm(f => ({ ...f, category: e.target.value }))}>
                {['Interior', 'Equipment', 'Team', 'Results', 'Events'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="w-20">
              <label className="text-[11px] text-white/40 uppercase tracking-widest mb-2 block">Emoji</label>
              <input className="input-glass text-center text-2xl" value={gForm.emoji}
                onChange={e => setGForm(f => ({ ...f, emoji: e.target.value }))} />
            </div>
            <div className="flex items-end">
              <button onClick={addImg} className="btn-primary text-[13px]">
                <PlusCircle size={14} className="inline mr-1.5" /> Add
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {gallery.map(g => (
            <div key={g.id} className="glass rounded-xl p-4 text-center group relative">
              <div className="text-3xl mb-2">{g.emoji}</div>
              <div className="text-white text-[12px] font-medium">{g.label}</div>
              <div className="text-white/40 text-[11px]">{g.category}</div>
              <button onClick={() => { removeGallery(g.id); toast.success('Removed.') }}
                className="absolute top-2 right-2 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── REPORTS ─────────────────────────────────────────────────────
function Reports() {
  const { appointments, services, news, gallery, holidays } = useStore()
  const [report, setReport] = useState('')

  const generate = (type) => {
    const total = appointments.length
    const confirmed = appointments.filter(a => a.status === 'confirmed').length
    const cancelled = appointments.filter(a => a.status === 'cancelled').length
    const pending = appointments.filter(a => a.status === 'pending').length
    const topTreatments = {}
    appointments.forEach(a => { topTreatments[a.treatment] = (topTreatments[a.treatment] || 0) + 1 })
    const sorted = Object.entries(topTreatments).sort((a, b) => b[1] - a[1])
    const now = new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })

    setReport(`╔══════════════════════════════════════════════════════════╗
  SHREE YASH MULTISPECIALITY DENTAL CLINIC
  ${type.toUpperCase()} REPORT — Generated: ${now}
╚══════════════════════════════════════════════════════════╝

APPOINTMENT SUMMARY
─────────────────────────────────────────────────────────
  Total Appointments       : ${total}
  Confirmed                : ${confirmed}
  Pending                  : ${pending}
  Cancelled                : ${cancelled}
  Completion Rate          : ${total > 0 ? Math.round(confirmed / total * 100) : 0}%

TOP TREATMENTS BY BOOKINGS
─────────────────────────────────────────────────────────
${sorted.slice(0, 6).map((t, i) => `  ${i + 1}. ${t[0].padEnd(40)} ${t[1]} booking(s)`).join('\n') || '  No data yet.'}

CLINIC DATA
─────────────────────────────────────────────────────────
  Doctor          : Dr. Sagar Jadhav, B.D.S. (Pune)
  Total Services  : ${services.length}
  News Posts      : ${news.length}
  Gallery Items   : ${gallery.length}
  Holidays Set    : ${holidays.length}

─────────────────────────────────────────────────────────
  Shree Yash Multispeciality Dental Clinic
  Nigdi, Pimpri-Chinchwad, Pune 411044
  +91 98500 44913 | +91 97674 06395
═══════════════════════════════════════════════════════════`)
  }

  const exportCSV = () => {
    const headers = 'ID,Date,Time,Patient,Treatment,Phone,Email,Status,Notes\n'
    const rows = appointments.map(a =>
      [a.id, a.date, a.time, `"${a.name}"`, `"${a.treatment}"`, a.phone, a.email || '', a.status, `"${a.notes || ''}"`].join(',')
    ).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `appointments_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    toast.success('CSV exported!')
  }

  return (
    <div>
      <h2 className="font-display text-3xl font-semibold text-white mb-6">Reports & Analytics</h2>
      <div className="flex flex-wrap gap-3 mb-6">
        {['Daily', 'Weekly', 'Monthly'].map(type => (
          <button key={type} onClick={() => generate(type)}
            className="btn-ghost text-[13px] flex items-center gap-2">
            <BarChart2 size={14} /> {type} Report
          </button>
        ))}
        <button onClick={exportCSV} className="btn-primary text-[13px] flex items-center gap-2">
          <Download size={14} /> Export CSV
        </button>
      </div>
      {report ? (
        <div className="glass rounded-2xl p-6 font-mono text-[12px] leading-relaxed text-white/70 whitespace-pre-wrap overflow-x-auto">
          {report}
        </div>
      ) : (
        <div className="glass rounded-2xl py-16 text-center text-white/30 text-[14px]">
          Click a report button above to generate.
        </div>
      )}
    </div>
  )
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────
function Dashboard() {
  const { isAdmin } = useStore()
  const navigate = useNavigate()
  const [active, setActive] = useState('overview')
  const [sideOpen, setSideOpen] = useState(false)

  useEffect(() => {
    if (!isAdmin) navigate('/admin/login')
  }, [isAdmin])

  if (!isAdmin) return null

  const panels = { overview: Overview, appointments: Appointments, schedule: Schedule, services: ServicesAdmin, content: Content, reports: Reports }
  const Panel = panels[active] || Overview

  return (
    <div className="min-h-screen flex" style={{ background: '#030712' }}>
      <Sidebar active={active} setActive={setActive} sideOpen={sideOpen} setSideOpen={setSideOpen} />

      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between"
          style={{ background: 'rgba(3,7,18,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <button onClick={() => setSideOpen(true)} className="lg:hidden text-white/50 hover:text-white transition-colors">
            <Menu size={20} />
          </button>
          <div className="hidden lg:block">
            <span className="text-white/30 text-[12px] uppercase tracking-widest">
              {tabs.find(t => t.id === active)?.label}
            </span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px]"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Admin
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Panel />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default function AdminDashboard() {
  return <StoreProvider><Dashboard /><Toaster position="bottom-center" toastOptions={{ style: { background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(16,185,129,0.2)', color: '#f1f5f9', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', borderRadius: '50px', padding: '12px 20px' }, success: { iconTheme: { primary: '#10b981', secondary: '#020617' } } }} /></StoreProvider>
}
