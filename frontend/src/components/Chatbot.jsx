import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, Sparkles } from 'lucide-react'

const QUICK_REPLIES = [
  '📅 Book appointment',
  '🕐 Clinic timings',
  '💰 Treatment costs',
  '🦷 Root canal info',
  '📍 Location',
]

const BOT_RESPONSES = {
  appointment: ['You can book an appointment directly on this page! Scroll up to the "Schedule Your Visit" section. Pick your treatment, date, and time slot — it takes under 2 minutes. Or WhatsApp us at +91 98500 44913 and our AI agent will help you 24/7.', 'Booking is super easy! Just scroll to the appointment section, select your preferred date, and pick an available time slot. You\'ll get a WhatsApp confirmation instantly.'],
  timing: ['We\'re open Monday–Friday: 9 AM – 8 PM, and Saturday: 9 AM – 2 PM. Sunday we\'re closed. Our AI agent on WhatsApp handles bookings even after hours!'],
  price: ['Great question! Here\'s a quick overview:\n• Consultation: ₹300\n• Filling: from ₹600\n• Root Canal: ₹2,500–₹4,500\n• Implants: ₹25,000–₹45,000\n• Whitening: ₹3,000–₹6,000\n• Braces: ₹20,000–₹60,000\n\nScroll to our Pricing section for the full breakdown!'],
  root: ['Root Canal Treatment at Shree Yash uses advanced rotary instruments for a completely pain-free experience. It typically takes 1–2 visits and costs ₹2,500–₹4,500. Book a consultation with Dr. Sagar Jadhav for an exact quote!'],
  location: ['We\'re at: Plot No. L-C9B, Near Amrita Vidyalayam, Behind Ganesh Sweets, Yamuna Nagar, Nigdi, Pimpri-Chinchwad, Maharashtra 411044. Easily accessible from Nigdi station!'],
  implant: ['Dental Implants start from ₹25,000 per tooth at our clinic. We use premium titanium implants that last a lifetime. Book a free consultation with Dr. Sagar Jadhav to check if you\'re a candidate!'],
  braces: ['We offer metal braces (₹20–35k), ceramic braces (₹30–50k), and clear invisible aligners (₹35–70k). Dr. Sagar will evaluate your case and recommend the best option. Free orthodontic consultation available!'],
  whitening: ['Professional laser teeth whitening gets you 6–8 shades brighter in just 60 minutes! Cost: ₹3,000–₹6,000. Long-lasting results with our take-home maintenance kit included.'],
  doctor: ['Dr. Sagar Jadhav is our Chief Dental Surgeon with B.D.S. from Pune. He has 10+ years of experience in multispeciality dentistry. Rated 4.9★ by 41+ patients on Google!'],
  emergency: ['For dental emergencies, please call immediately: +91 97674 06395 or +91 98500 44913. We try our best to accommodate emergency cases on the same day.'],
  default: ['Thanks for reaching out to Shree Yash Dental Clinic! I can help with booking appointments, treatment info, pricing, timings, or location. What would you like to know?', 'I\'m here to help! Feel free to ask about any of our treatments, costs, or how to schedule a visit with Dr. Sagar Jadhav.', 'For more specific queries, our team is always available at +91 98500 44913 or on WhatsApp. Would you like me to help with anything else?'],
}

function getBotReply(text) {
  const t = text.toLowerCase()
  if (t.includes('book') || t.includes('appoint') || t.includes('schedule')) return rand(BOT_RESPONSES.appointment)
  if (t.includes('time') || t.includes('hour') || t.includes('open') || t.includes('close') || t.includes('timing')) return BOT_RESPONSES.timing[0]
  if (t.includes('price') || t.includes('cost') || t.includes('fee') || t.includes('₹') || t.includes('charge') || t.includes('rate')) return BOT_RESPONSES.price[0]
  if (t.includes('root canal') || t.includes('rct')) return BOT_RESPONSES.root[0]
  if (t.includes('location') || t.includes('address') || t.includes('where') || t.includes('directions')) return BOT_RESPONSES.location[0]
  if (t.includes('implant')) return BOT_RESPONSES.implant[0]
  if (t.includes('brace') || t.includes('aligner') || t.includes('ortho')) return BOT_RESPONSES.braces[0]
  if (t.includes('whiten')) return BOT_RESPONSES.whitening[0]
  if (t.includes('doctor') || t.includes('sagar') || t.includes('dr')) return BOT_RESPONSES.doctor[0]
  if (t.includes('emergency') || t.includes('urgent') || t.includes('pain') || t.includes('hurts')) return BOT_RESPONSES.emergency[0]
  return rand(BOT_RESPONSES.default)
}
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)] }

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: '👋 Hello! I\'m the Shree Yash AI assistant. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')
    setMessages(m => [...m, { id: Date.now(), from: 'user', text: msg }])
    setTyping(true)
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600))
    setTyping(false)
    setMessages(m => [...m, { id: Date.now() + 1, from: 'bot', text: getBotReply(msg) }])
  }

  return (
    <>
      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              className="w-[360px] rounded-3xl overflow-hidden shadow-glass-lg border border-white/10"
              style={{ background: 'rgba(9,16,28,0.97)', backdropFilter: 'blur(30px)' }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-white/8"
                style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.05))' }}>
                <div className="w-9 h-9 glass-green rounded-xl flex items-center justify-center">
                  <Bot size={18} className="text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="text-white text-[13px] font-semibold">Shree Yash Assistant</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Online · Replies instantly
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Messages */}
              <div className="h-72 overflow-y-auto p-4 space-y-3">
                {messages.map(m => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-line ${
                      m.from === 'user' ? 'chat-bubble-user font-medium' : 'chat-bubble-bot text-white/80'
                    } ${m.from === 'bot' ? 'rounded-tl-sm' : 'rounded-tr-sm'}`}>
                      {m.text}
                    </div>
                  </motion.div>
                ))}
                {typing && (
                  <div className="flex justify-start">
                    <div className="chat-bubble-bot rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* Quick replies */}
              <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-none border-t border-white/5">
                {QUICK_REPLIES.map(q => (
                  <button key={q} onClick={() => send(q)}
                    className="flex-shrink-0 text-[11px] px-3 py-1.5 rounded-full border border-white/10 text-white/60 hover:border-emerald-500/40 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all duration-200">
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 pt-2 flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2.5 rounded-xl text-[13px] outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}
                />
                <button onClick={() => send()}
                  className="w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center justify-center flex-shrink-0">
                  <Send size={14} className="text-ink-950" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setOpen(o => !o)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-green-glow"
        >
          <AnimatePresence mode="wait">
            {open
              ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={20} className="text-white" /></motion.div>
              : <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Sparkles size={20} className="text-white" /></motion.div>
            }
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  )
}
