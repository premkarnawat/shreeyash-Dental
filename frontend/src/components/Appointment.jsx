import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, UserRound, Phone, Mail, FileText, Check, AlertTriangle, ChevronRight, Sparkles } from 'lucide-react'
import { useStore } from '../hooks/useStore.jsx'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const TREATMENTS = [
  'Dental Checkup / Consultation','Root Canal Treatment','Teeth Whitening',
  'Dental Implants','Braces / Orthodontics','Ceramic Crowns / Bridges',
  'Zirconia Crowns','Composite Filling','Smile Makeover','Pediatric Dentistry',
  'Gum / Periodontal Treatment','Teeth Extraction','Dentures','Invisible Braces','Cosmetic Dentistry',
]

const STEPS = ['Patient Info','Treatment & Date','Select Slot','Confirm']

function StepIndicator({ step }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((s,i)=>(
        <div key={s} className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold transition-all duration-400 ${
            i < step ? 'bg-emerald-500 text-[#020617]' :
            i === step ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400' :
            'glass border border-white/10 text-white/25'
          }`}>
            {i < step ? <Check size={12}/> : i+1}
          </div>
          {i < STEPS.length-1 && (
            <div className={`w-8 sm:w-16 h-[1.5px] rounded-full transition-all duration-500 ${i < step ? 'bg-emerald-500' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function Appointment() {
  const { addAppointment, getSlots, isHoliday, getHolidayReason } = useStore()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name:'',phone:'',email:'',treatment:'',date:'',notes:'' })
  const [selectedSlot, setSelectedSlot] = useState('')
  const [slots, setSlots] = useState([])
  const [holidayMsg, setHolidayMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [booked, setBooked] = useState(null)

  const minDate = format(new Date(),'yyyy-MM-dd')

  const handleDateChange = (date) => {
    setForm(f=>({...f,date}))
    setSelectedSlot('')
    setHolidayMsg('')
    if (!date) { setSlots([]); return }
    if (isHoliday(date)) { setHolidayMsg(`Clinic closed — ${getHolidayReason(date)}`); setSlots([]); return }
    const daySlots = getSlots(date)
    if (!daySlots.length) { setHolidayMsg('Clinic is closed on this day.'); setSlots([]); return }
    setSlots(daySlots)
  }

  const nextStep = () => {
    if (step===0 && (!form.name||!form.phone)) { toast.error('Please enter your name and phone.'); return }
    if (step===1 && (!form.treatment||!form.date)) { toast.error('Please select treatment and date.'); return }
    if (step===2 && !selectedSlot) { toast.error('Please select a time slot.'); return }
    setStep(s=>s+1)
  }

  const confirm = async () => {
    setLoading(true)
    await new Promise(r=>setTimeout(r,900))
    const apt = addAppointment({...form, time:selectedSlot})
    setBooked(apt)
    setLoading(false)
    toast.success('🎉 Appointment confirmed!')
  }

  const reset = () => {
    setForm({name:'',phone:'',email:'',treatment:'',date:'',notes:''})
    setSelectedSlot(''); setSlots([]); setHolidayMsg(''); setStep(0); setBooked(null)
  }

  if (booked) return (
    <section id="appointment" className="py-24 sm:py-32">
      <div className="max-w-lg mx-auto px-5 sm:px-8">
        <motion.div initial={{ scale:0.9,opacity:0 }} animate={{ scale:1,opacity:1 }} transition={{ duration:0.5,ease:[0.22,1,0.36,1] }}
          className="glass rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
          <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.2,type:'spring',stiffness:300 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-6">
            <Check className="text-white" size={32}/>
          </motion.div>
          <h3 className="font-display text-3xl font-semibold text-white mb-3">Confirmed!</h3>
          <p className="text-white/50 text-sm leading-relaxed mb-2">
            <span className="text-emerald-400 font-semibold">{booked.name}</span>, your appointment for{' '}
            <span className="text-white font-semibold">{booked.treatment}</span>
          </p>
          <div className="glass-green rounded-2xl p-5 my-6 text-left space-y-3">
            {[
              {icon:<Calendar size={14}/>,label:'Date',val:booked.date},
              {icon:<Clock size={14}/>,label:'Time',val:booked.time},
              {icon:<FileText size={14}/>,label:'Booking ID',val:`#${booked.id}`},
            ].map(r=>(
              <div key={r.label} className="flex items-center gap-3">
                <span className="text-emerald-400">{r.icon}</span>
                <span className="text-white/40 text-xs w-20">{r.label}</span>
                <span className="text-white text-sm font-semibold">{r.val}</span>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs mb-6">WhatsApp confirmation sent to {booked.phone}</p>
          <button onClick={reset} className="btn-primary w-full">Book Another Appointment</button>
        </motion.div>
      </div>
    </section>
  )

  return (
    <section id="appointment" className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl" style={{ background:'radial-gradient(circle,rgba(16,185,129,0.05),transparent 70%)' }} />
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 items-start">

          {/* Left info */}
          <motion.div initial={{ opacity:0,x:-30 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} transition={{ duration:0.7 }}>
            <span className="section-tag mb-6 inline-flex">Easy Booking</span>
            <h2 className="font-display text-[40px] sm:text-[50px] font-semibold text-white mt-5 mb-5 leading-tight">
              Schedule Your<span className="italic text-gradient block">Visit Online</span>
            </h2>
            <p className="text-white/45 text-[15px] leading-relaxed mb-8">
              Real-time slot availability. Instant confirmation. WhatsApp reminders. Our AI agent books appointments 24/7 even when the clinic is closed.
            </p>
            <div className="space-y-4">
              {[
                { icon:'⚡',t:'Instant Availability',d:'Live slot checking in real-time' },
                { icon:'📱',t:'WhatsApp Confirmation',d:'Instant booking details on WhatsApp' },
                { icon:'🤖',t:'24/7 AI Agent',d:'Book via AI even after clinic hours' },
                { icon:'🔄',t:'Easy Reschedule',d:'Change or cancel anytime, instantly' },
              ].map(f=>(
                <div key={f.t} className="flex items-center gap-4 glass rounded-2xl p-4 hover:glass-green transition-all duration-300">
                  <div className="w-10 h-10 glass-green rounded-xl flex items-center justify-center text-lg flex-shrink-0">{f.icon}</div>
                  <div>
                    <div className="text-white text-[13px] font-semibold">{f.t}</div>
                    <div className="text-white/40 text-[12px]">{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div initial={{ opacity:0,x:30 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} transition={{ duration:0.7,delay:0.1 }}
            className="glass rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-700 via-emerald-400 to-emerald-700" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 glass-green rounded-xl flex items-center justify-center">
                <Sparkles size={16} className="text-emerald-400"/>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-white">Schedule a Visit</h3>
                <p className="text-white/35 text-xs">Step {step+1} of {STEPS.length} — {STEPS[step]}</p>
              </div>
            </div>

            <StepIndicator step={step}/>

            <AnimatePresence mode="wait">

              {/* Step 0: Patient Info */}
              {step===0 && (
                <motion.div key="s0" initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-20 }} transition={{ duration:0.25 }} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Full Name *</label>
                    <div className="relative">
                      <UserRound size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                      <input className="input-premium pl-11" placeholder="Your full name"
                        value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Mobile Number *</label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                      <input className="input-premium pl-11" placeholder="+91 98500 44913" type="tel"
                        value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Email (optional)</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                      <input className="input-premium pl-11" placeholder="your@email.com" type="email"
                        value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 1: Treatment & Date */}
              {step===1 && (
                <motion.div key="s1" initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-20 }} transition={{ duration:0.25 }} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Treatment Required *</label>
                    <select className="input-premium" value={form.treatment} onChange={e=>setForm(f=>({...f,treatment:e.target.value}))}>
                      <option value="">Select treatment...</option>
                      {TREATMENTS.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Preferred Date *</label>
                    <div className="relative">
                      <Calendar size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                      <input className="input-premium pl-11" type="date" min={minDate}
                        value={form.date} onChange={e=>handleDateChange(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Additional Notes</label>
                    <textarea className="input-premium resize-none" rows={3}
                      placeholder="Describe your concern or any specific requirements..."
                      value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Time Slot */}
              {step===2 && (
                <motion.div key="s2" initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-20 }} transition={{ duration:0.25 }}>
                  {holidayMsg ? (
                    <div className="flex items-start gap-3 rounded-2xl p-4 mb-4 text-amber-300 text-[13px]" style={{ background:'rgba(251,191,36,0.08)',border:'1px solid rgba(251,191,36,0.2)' }}>
                      <AlertTriangle size={15} className="flex-shrink-0 mt-0.5"/>{holidayMsg}
                    </div>
                  ) : slots.length > 0 ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Available Slots for {form.date}</label>
                        <span className="text-[11px] text-emerald-400">{slots.filter(s=>s.available).length} available</span>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {slots.map(({time,available})=>(
                          <button key={time} disabled={!available} onClick={()=>available&&setSelectedSlot(time)}
                            className={`slot-btn ${!available?'opacity-30 cursor-not-allowed line-through':''} ${selectedSlot===time?'selected':''}`}>
                            {time}
                          </button>
                        ))}
                      </div>
                      {selectedSlot && (
                        <motion.div initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }}
                          className="mt-4 glass-green rounded-2xl p-3 flex items-center gap-2">
                          <Check size={14} className="text-emerald-400"/>
                          <span className="text-emerald-300 text-[13px] font-semibold">Selected: {selectedSlot}</span>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-white/30 text-sm">
                      Please go back and select a valid date first.
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Confirm */}
              {step===3 && (
                <motion.div key="s3" initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-20 }} transition={{ duration:0.25 }}>
                  <div className="glass-green rounded-2xl p-5 space-y-3 mb-4">
                    <div className="text-[12px] font-bold text-emerald-400 uppercase tracking-widest mb-4">Appointment Summary</div>
                    {[
                      {label:'Patient',val:form.name},
                      {label:'Phone',val:form.phone},
                      {label:'Treatment',val:form.treatment},
                      {label:'Date',val:form.date},
                      {label:'Time',val:selectedSlot},
                      form.notes && {label:'Notes',val:form.notes},
                    ].filter(Boolean).map(r=>(
                      <div key={r.label} className="flex gap-3">
                        <span className="text-white/35 text-[12px] w-20 flex-shrink-0">{r.label}</span>
                        <span className="text-white text-[13px] font-medium">{r.val}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-white/35 text-[12px] text-center">By confirming, you agree to receive appointment details on WhatsApp.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <button onClick={()=>setStep(s=>s-1)}
                  className="btn-ghost flex-1 text-[13px] py-3">
                  ← Back
                </button>
              )}
              {step < 3 ? (
                <button onClick={nextStep} className="btn-primary flex-1 text-[13px] py-3">
                  Continue <ChevronRight size={15}/>
                </button>
              ) : (
                <button onClick={confirm} disabled={loading} className="btn-primary flex-1 text-[13px] py-3">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#020617]/30 border-t-[#020617] rounded-full animate-spin"/>
                      Confirming...
                    </span>
                  ) : (
                    <><Calendar size={15}/>Confirm Appointment</>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
