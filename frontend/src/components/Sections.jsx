import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, Mail, ArrowRight, Star, Send, UserRound } from 'lucide-react'
import { useStore } from '../hooks/useStore.jsx'
import toast from 'react-hot-toast'
import { useState } from 'react'

// ─── ABOUT ────────────────────────────────────────────────────────
export function About() {
  return (
    <section id="about" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <motion.div initial={{ opacity:0,x:-40 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} transition={{ duration:0.8 }}>
            <span className="section-tag mb-6 inline-flex">About Our Clinic</span>
            <h2 className="font-display text-[40px] sm:text-[50px] font-semibold text-white mt-5 mb-6 leading-tight">
              Excellence in Dentistry<span className="italic text-gradient block">Since Day One</span>
            </h2>
            <p className="text-white/50 text-[15px] leading-relaxed mb-5">
              Shree Yash Multispeciality Dental Clinic is a premier dental care center in Yamunanagar, Nigdi, Pimpri-Chinchwad. We combine clinical excellence with a warm, patient-first approach to deliver dental care that truly transforms lives.
            </p>
            <p className="text-white/50 text-[15px] leading-relaxed mb-8">
              Our state-of-the-art facility features digital X-ray systems, CAD/CAM crown technology, rotary endodontic instruments, and fully sterilized treatment rooms — ensuring world-class care for every patient.
            </p>
            <div className="glass rounded-2xl p-5 flex items-center gap-5 hover:glass-green transition-all duration-300">
              <div className="w-14 h-14 glass-green rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">👨‍⚕️</div>
              <div className="flex-1">
                <div className="font-display text-xl font-semibold text-white">Dr. Sagar Jadhav</div>
                <div className="text-white/45 text-[13px] mb-1">B.D.S. (Pune) · Chief Dental Surgeon</div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i=><Star key={i} size={11} fill="#fbbf24" stroke="none"/>)}
                  <span className="text-amber-400 text-[12px] ml-1 font-semibold">4.9 (41 reviews)</span>
                </div>
              </div>
              <a href="tel:+919850044913" className="text-emerald-400 hover:text-emerald-300 transition-colors p-2">
                <Phone size={18}/>
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity:0,x:40 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} transition={{ duration:0.8,delay:0.1 }}
            className="grid grid-cols-2 gap-4">
            {[
              {num:'10+',label:'Years Experience',icon:'🏆'},
              {num:'5000+',label:'Patients Treated',icon:'😊'},
              {num:'12+',label:'Specializations',icon:'🦷'},
              {num:'4.9★',label:'Google Rating',icon:'⭐'},
            ].map((s,i)=>(
              <motion.div key={s.num} initial={{ opacity:0,scale:0.9 }} whileInView={{ opacity:1,scale:1 }} viewport={{ once:true }} transition={{ delay:0.2+i*0.08 }}
                className="glass-card rounded-2xl p-6 text-center group">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{s.icon}</div>
                <div className="stat-number text-[40px] font-semibold mb-1">{s.num}</div>
                <div className="text-white/40 text-[12px] tracking-wide">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── GALLERY ──────────────────────────────────────────────────────
export function Gallery() {
  const { gallery } = useStore()
  const spans = ['md:col-span-2 md:row-span-2','','md:col-span-2','','','']
  return (
    <section id="gallery" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div initial={{ opacity:0,y:30 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="text-center mb-16">
          <span className="section-tag mb-5 inline-flex">Our Facility</span>
          <h2 className="font-display text-[40px] sm:text-[52px] font-semibold text-white mt-5 mb-4">
            Inside Our<span className="italic text-gradient"> World-Class</span> Clinic
          </h2>
          <p className="text-white/45 text-[15px] max-w-lg mx-auto">Experience the warm, professional environment of Shree Yash Dental Clinic.</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px]">
          {gallery.map((item,i)=>(
            <motion.div key={item.id} initial={{ opacity:0,scale:0.95 }} whileInView={{ opacity:1,scale:1 }} viewport={{ once:true }} transition={{ delay:i*0.06 }}
              className={`group glass-card rounded-2xl overflow-hidden cursor-pointer relative ${spans[i]||''}`}>
              <div className="absolute inset-0 flex items-center justify-center text-5xl transition-transform duration-500 group-hover:scale-110"
                style={{ background:'linear-gradient(135deg,#0a1f14,#0d2b1c)' }}>
                <motion.span animate={{ scale:[1,1.04,1] }} transition={{ duration:4,repeat:Infinity,delay:i*0.5 }}>{item.emoji}</motion.span>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col items-end justify-end p-4"
                style={{ background:'linear-gradient(to top,rgba(0,0,0,0.75),transparent)' }}>
                <span className="text-white text-[13px] font-semibold">{item.label}</span>
                <span className="text-white/50 text-[11px]">{item.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── NEWS ─────────────────────────────────────────────────────────
export function News() {
  const { news } = useStore()
  const tagColors = {
    'Dental Camp':'bg-blue-500/10 text-blue-300 border-blue-500/20',
    'New Treatment':'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    'Offer':'bg-amber-500/10 text-amber-300 border-amber-500/20',
    'Technology':'bg-purple-500/10 text-purple-300 border-purple-500/20',
    'Announcement':'bg-rose-500/10 text-rose-300 border-rose-500/20',
  }
  return (
    <section id="news" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div initial={{ opacity:0,y:30 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="text-center mb-16">
          <span className="section-tag mb-5 inline-flex">Latest Updates</span>
          <h2 className="font-display text-[40px] sm:text-[52px] font-semibold text-white mt-5 mb-4">
            Clinic<span className="italic text-gradient"> Updates</span>
          </h2>
          <p className="text-white/45 text-[15px] max-w-lg mx-auto">Dental camps, health tips, new treatments, special offers and announcements.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {news.map((item,i)=>(
            <motion.article key={item.id} initial={{ opacity:0,y:30 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer group">
              <div className="h-36 flex items-center justify-center text-4xl relative" style={{ background:'linear-gradient(135deg,#0a1f14,#0d2b1c)' }}>
                <motion.span animate={{ scale:[1,1.05,1] }} transition={{ duration:4,repeat:Infinity,delay:i*0.5 }}>{item.emoji}</motion.span>
                <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full border ${tagColors[item.category]||'bg-white/10 text-white/60 border-white/15'}`}>
                  {item.category}
                </span>
              </div>
              <div className="p-5">
                <div className="text-white/25 text-[11px] mb-2 font-mono">{item.date}</div>
                <h3 className="font-display text-[17px] font-semibold text-white mb-2 leading-snug group-hover:text-emerald-300 transition-colors">{item.title}</h3>
                <p className="text-white/45 text-[12px] leading-relaxed line-clamp-3">{item.content}</p>
                <div className="flex items-center gap-1 mt-4 text-emerald-400 text-[12px] font-semibold">
                  Read more <ArrowRight size={12}/>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CONTACT ──────────────────────────────────────────────────────
export function Contact() {
  const [form, setForm] = useState({name:'',phone:'',subject:'',message:''})
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!form.name||!form.message) { toast.error('Please fill name and message.'); return }
    setLoading(true)
    await new Promise(r=>setTimeout(r,700))
    setLoading(false)
    setForm({name:'',phone:'',subject:'',message:''})
    toast.success("✅ Message sent! We'll respond shortly.")
  }

  const hours = [
    {day:'Monday – Friday',time:'9:00 AM – 8:00 PM',closed:false},
    {day:'Saturday',time:'9:00 AM – 2:00 PM',closed:false},
    {day:'Sunday',time:'Closed',closed:true},
  ]

  return (
    <section id="contact" className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 bottom-0 w-[700px] h-[400px] rounded-full blur-3xl" style={{ background:'radial-gradient(ellipse,rgba(16,185,129,0.04),transparent 70%)' }} />
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div initial={{ opacity:0,y:30 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="text-center mb-16">
          <span className="section-tag mb-5 inline-flex">Get In Touch</span>
          <h2 className="font-display text-[40px] sm:text-[52px] font-semibold text-white mt-5 mb-4">
            We'd Love to<span className="italic text-gradient"> Hear From You</span>
          </h2>
          <p className="text-white/45 text-[15px] max-w-lg mx-auto">Questions? Ready to book? Reach out and our team will respond promptly.</p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12">

          {/* Contact info */}
          <motion.div initial={{ opacity:0,x:-30 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} className="space-y-4">
            {[
              {icon:<MapPin size={17}/>,label:'Address',text:'Plot No. L-C9B, Near Amrita Vidyalayam, Behind Ganesh Sweets, Yamuna Nagar, Nigdi, Pimpri-Chinchwad, Maharashtra 411044'},
              {icon:<Phone size={17}/>,label:'Phone / WhatsApp',text:'+91 98500 44913\n+91 97674 06395'},
              {icon:<Mail size={17}/>,label:'Email',text:'info@shreeyashdental.com'},
            ].map(c=>(
              <div key={c.label} className="glass rounded-2xl p-5 flex items-start gap-4 hover:glass-green transition-all duration-300 group">
                <div className="w-10 h-10 glass-green rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-emerald-400">{c.icon}</span>
                </div>
                <div>
                  <div className="text-white/30 text-[10px] uppercase tracking-widest mb-1">{c.label}</div>
                  <div className="text-white/75 text-[13px] leading-relaxed whitespace-pre-line">{c.text}</div>
                </div>
              </div>
            ))}

            {/* Hours */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 glass-green rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock size={17} className="text-emerald-400"/>
                </div>
                <div className="text-white/30 text-[10px] uppercase tracking-widest">Clinic Hours</div>
              </div>
              <div className="space-y-2">
                {hours.map(h=>(
                  <div key={h.day} className="flex justify-between items-center py-2 border-b border-white/[0.05] last:border-0">
                    <span className="text-white/55 text-[13px]">{h.day}</span>
                    <span className={`text-[13px] font-semibold ${h.closed?'text-red-400/70':'text-emerald-400'}`}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div initial={{ opacity:0,x:30 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} transition={{ delay:0.1 }}
            className="glass rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-700 via-emerald-400 to-emerald-700" />

            <div className="flex items-center gap-3 mb-7">
              <div className="w-9 h-9 glass-green rounded-xl flex items-center justify-center">
                <Send size={15} className="text-emerald-400"/>
              </div>
              <h3 className="font-display text-xl font-semibold text-white">Send a Message</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[11px] font-bold text-white/35 uppercase tracking-widest mb-2 block">Your Name *</label>
                <div className="relative">
                  <UserRound size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"/>
                  <input className="input-premium pl-10" placeholder="Full name"
                    value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-white/35 uppercase tracking-widest mb-2 block">Phone Number</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"/>
                  <input className="input-premium pl-10" placeholder="+91 ..." type="tel"
                    value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-[11px] font-bold text-white/35 uppercase tracking-widest mb-2 block">Subject</label>
              <input className="input-premium" placeholder="How can we help you?"
                value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} />
            </div>

            <div className="mb-6">
              <label className="text-[11px] font-bold text-white/35 uppercase tracking-widest mb-2 block">Message *</label>
              <textarea className="input-premium resize-none" rows={5}
                placeholder="Write your message here..."
                value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} />
            </div>

            <button onClick={send} disabled={loading} className="btn-primary w-full">
              {loading
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-[#020617]/30 border-t-[#020617] rounded-full animate-spin"/>Sending...</span>
                : <><Send size={14}/>Send Message</>
              }
            </button>

            <p className="text-white/25 text-[11px] text-center mt-4">
              We typically respond within 2 hours during clinic hours.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
