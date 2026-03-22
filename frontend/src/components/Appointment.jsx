import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Check, X, AlertTriangle, ChevronRight } from 'lucide-react'
import { useStore } from '../hooks/useStore'
import toast from 'react-hot-toast'
import { format, addDays } from 'date-fns'

const TREATMENTS = [
  'Dental Checkup / Consultation',
  'Root Canal Treatment',
  'Teeth Whitening',
  'Dental Implants',
  'Braces / Orthodontics',
  'Ceramic Crowns / Bridges',
  'Zirconia Crowns',
  'Composite Filling',
  'Smile Makeover',
  'Pediatric Dentistry',
  'Gums / Periodontal Treatment',
  'Teeth Extraction',
  'Dentures',
  'Invisible Braces',
  'Cosmetic Dentistry',
]

export default function Appointment() {
  const { addAppointment, getSlots, isHoliday, getHolidayReason, holidays } = useStore()

  const [form, setForm] = useState({
    name: '', phone: '', treatment: '', date: '', email: '', notes: ''
  })
  const [selectedSlot, setSelectedSlot] = useState('')
  const [slots, setSlots] = useState([])
  const [holidayMsg, setHolidayMsg] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const minDate = format(new Date(), 'yyyy-MM-dd')

  const handleDateChange = (date) => {
    setForm(f => ({ ...f, date }))
    setSelectedSlot('')
    setHolidayMsg('')
    if (!date) { setSlots([]); return }

    if (isHoliday(date)) {
      setHolidayMsg(`🚫 Clinic is closed on this date — ${getHolidayReason(date)}`)
      setSlots([])
      return
    }
    const daySlots = getSlots(date)
    if (!daySlots.length) {
      setHolidayMsg('🚫 Clinic is closed on this day of the week.')
      setSlots([])
      return
    }
    setSlots(daySlots)
  }

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.treatment || !form.date || !selectedSlot) {
      toast.error('Please fill all required fields and select a time slot.')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    addAppointment({ ...form, time: selectedSlot })
    setLoading(false)
    setSubmitted(true)
    toast.success('Appointment confirmed! Check your WhatsApp for details.')
  }

  const reset = () => {
    setForm({ name: '', phone: '', treatment: '', date: '', email: '', notes: '' })
    setSelectedSlot('')
    setSlots([])
    setHolidayMsg('')
    setSubmitted(false)
  }

  if (submitted) return (
    <section id="appointment" className="py-24">
      <div className="max-w-lg mx-auto px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass rounded-3xl p-10 text-center"
        >
          <div className="w-16 h-16 glass-green rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
            <Check className="text-emerald-400" size={28} />
          </div>
          <h3 className="font-display text-3xl font-semibold text-white mb-3">Appointment Confirmed!</h3>
          <p className="text-white/60 text-sm leading-relaxed mb-2">
            <span className="text-white font-medium">{form.name}</span>, your appointment for{' '}
            <span className="text-emerald-400">{form.treatment}</span> is booked on{' '}
            <span className="text-emerald-400">{form.date}</span> at{' '}
            <span className="text-emerald-400">{selectedSlot}</span>.
          </p>
          <p className="text-white/40 text-xs mb-8">A WhatsApp confirmation will be sent to {form.phone}</p>
          <button onClick={reset} className="btn-primary w-full">Book Another Appointment</button>
        </motion.div>
      </div>
    </section>
  )

  return (
    <section id="appointment" className="py-24 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.05), transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-16 items-start">

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-tag mb-5">Easy Booking</span>
            <h2 className="font-display text-5xl font-semibold text-white mt-4 mb-5 leading-tight">
              Schedule Your
              <span className="italic text-gradient block">Visit Online</span>
            </h2>
            <p className="text-white/55 text-[15px] leading-relaxed mb-8">
              Real-time slot availability. Instant confirmation. Reminders via WhatsApp. Our AI agent takes bookings 24/7 even when the clinic is closed.
            </p>

            <div className="space-y-4">
              {[
                { icon: '⚡', title: 'Instant Slot Check', desc: 'Live availability updated in real-time' },
                { icon: '📱', title: 'WhatsApp Confirmation', desc: 'Get booking details on WhatsApp immediately' },
                { icon: '🤖', title: '24/7 AI Agent', desc: 'Book via AI even when clinic is closed' },
                { icon: '🔄', title: 'Easy Reschedule', desc: 'Change or cancel with one tap' },
              ].map(f => (
                <div key={f.title} className="flex items-center gap-4 glass rounded-xl p-4">
                  <div className="w-10 h-10 glass-green rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-white text-[13px] font-semibold">{f.title}</div>
                    <div className="text-white/45 text-[12px]">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="glass rounded-3xl p-8 border border-white/10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600" />

            <h3 className="font-display text-2xl font-semibold text-white mb-7">Schedule a Visit</h3>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[12px] font-semibold text-white/50 tracking-wide uppercase mb-2 block">Full Name *</label>
                <input className="input-glass" placeholder="Your full name"
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-white/50 tracking-wide uppercase mb-2 block">Mobile *</label>
                <input className="input-glass" placeholder="+91 98500 44913" type="tel"
                  value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-[12px] font-semibold text-white/50 tracking-wide uppercase mb-2 block">Treatment *</label>
              <select className="input-glass"
                value={form.treatment} onChange={e => setForm(f => ({ ...f, treatment: e.target.value }))}>
                <option value="">Select treatment...</option>
                {TREATMENTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[12px] font-semibold text-white/50 tracking-wide uppercase mb-2 block">Date *</label>
                <input className="input-glass" type="date" min={minDate}
                  value={form.date} onChange={e => handleDateChange(e.target.value)} />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-white/50 tracking-wide uppercase mb-2 block">Email</label>
                <input className="input-glass" placeholder="optional" type="email"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>

            {/* Slots */}
            {holidayMsg && (
              <div className="mb-4 flex items-center gap-3 rounded-xl p-3 text-amber-300 text-[13px]"
                style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                <AlertTriangle size={14} className="flex-shrink-0" />
                {holidayMsg}
              </div>
            )}

            {slots.length > 0 && (
              <div className="mb-4">
                <label className="text-[12px] font-semibold text-white/50 tracking-wide uppercase mb-2 block">
                  Select Time Slot *
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {slots.map(({ time, available }) => (
                    <button
                      key={time}
                      disabled={!available}
                      onClick={() => available && setSelectedSlot(time)}
                      className={`py-2 px-1 rounded-xl text-[12px] font-medium border transition-all duration-200
                        ${!available
                          ? 'opacity-40 cursor-not-allowed line-through border-red-500/20 text-red-400/50 bg-red-500/5'
                          : selectedSlot === time
                          ? 'slot-selected border-emerald-500 bg-emerald-500/15 text-emerald-300'
                          : 'slot-available border-white/10 text-white/60 hover:text-emerald-400'
                        }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="text-[12px] font-semibold text-white/50 tracking-wide uppercase mb-2 block">Notes</label>
              <textarea className="input-glass resize-none" rows={3}
                placeholder="Describe your concern or any specific requirements..."
                value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 text-[14px]"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
              ) : (
                <>
                  <Calendar size={15} />
                  Confirm Appointment
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
