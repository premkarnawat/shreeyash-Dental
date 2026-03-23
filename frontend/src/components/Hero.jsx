import { motion } from 'framer-motion'
import { ArrowRight, Star, MapPin, Phone, Clock, Shield, Award } from 'lucide-react'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }
const fadeUp = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22,1,0.36,1] } } }

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[900px] h-[900px] rounded-full" style={{ background:'radial-gradient(circle,rgba(16,185,129,0.07) 0%,transparent 65%)' }} />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full" style={{ background:'radial-gradient(circle,rgba(5,150,105,0.06) 0%,transparent 65%)' }} />
        <div className="absolute inset-0" style={{ backgroundImage:'linear-gradient(rgba(16,185,129,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.03) 1px,transparent 1px)', backgroundSize:'72px 72px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp} className="mb-6">
              <div className="section-tag"><span className="section-tag-dot" />Nigdi, Pimpri-Chinchwad · Pune 411044</div>
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-display text-[44px] sm:text-[56px] lg:text-[68px] leading-[1.04] font-semibold text-white mb-6">
              Crafting<span className="block italic text-gradient"> Perfect Smiles</span><span className="block">With Precision</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/50 text-[15px] sm:text-[16px] leading-relaxed mb-8 max-w-[500px]">
              Shree Yash Multispeciality Dental Clinic — where advanced dental technology meets compassionate care. 12+ treatments under one roof with Dr. Sagar Jadhav.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
              <a href="#appointment" className="btn-primary">Book Appointment <ArrowRight size={15} /></a>
              <a href="#services" className="btn-ghost">Explore Treatments</a>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              {[
                { icon: <Shield size={13}/>, text:'NABH Standards' },
                { icon: <Award size={13}/>, text:'10+ Years Experience' },
                { icon: <Star size={13} fill="currentColor"/>, text:'4.9★ Google Rating' },
              ].map(b=>(
                <div key={b.text} className="flex items-center gap-2 px-3 py-2 rounded-full glass text-[12px] font-medium text-white/60">
                  <span className="text-emerald-400">{b.icon}</span>{b.text}
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity:0,x:40,scale:0.97 }} animate={{ opacity:1,x:0,scale:1 }} transition={{ duration:0.9,delay:0.3,ease:[0.22,1,0.36,1] }} className="relative hidden lg:block">
            <div className="absolute inset-8 rounded-3xl blur-3xl" style={{ background:'rgba(16,185,129,0.1)' }} />
            <div className="relative glass rounded-3xl p-7 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-60" />
              <div className="w-full h-[260px] rounded-2xl mb-5 flex items-center justify-center relative overflow-hidden" style={{ background:'linear-gradient(135deg,#0a1f14,#0d2b1c)' }}>
                <div className="absolute inset-0" style={{ background:'radial-gradient(circle at 60% 40%,rgba(16,185,129,0.12),transparent 65%)' }} />
                <motion.div animate={{ y:[-8,8,-8] }} transition={{ duration:5,repeat:Infinity,ease:'easeInOut' }} className="relative z-10 text-[72px]">🦷</motion.div>
                <div className="absolute top-4 right-4 glass-green rounded-2xl px-4 py-2.5 text-xs font-bold text-emerald-300">✓ Multispeciality</div>
                <div className="absolute bottom-4 left-4 glass rounded-2xl px-4 py-2.5 text-xs font-semibold text-white/60">📍 Nigdi, Pune</div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[{n:'4.9★',l:'Rating'},{n:'5000+',l:'Patients'},{n:'12+',l:'Treatments'}].map(s=>(
                  <div key={s.l} className="glass-green rounded-2xl p-3 text-center">
                    <div className="stat-number text-2xl font-semibold leading-none mb-0.5">{s.n}</div>
                    <div className="text-white/40 text-[11px] font-medium">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-900 flex items-center justify-center text-xl flex-shrink-0">👨‍⚕️</div>
                <div className="flex-1">
                  <div className="font-semibold text-white text-[15px]">Dr. Sagar Jadhav</div>
                  <div className="text-white/40 text-[12px]">B.D.S. (Pune) · Chief Dental Surgeon</div>
                </div>
                <div className="flex items-center gap-1"><Star size={12} fill="#fbbf24" stroke="none" /><span className="text-amber-400 text-sm font-bold">4.9</span></div>
              </div>
              <a href="tel:+919850044913" className="flex items-center gap-3 glass rounded-2xl p-3.5 hover:glass-green transition-all duration-300 group">
                <div className="w-9 h-9 glass-green rounded-xl flex items-center justify-center flex-shrink-0"><Phone size={14} className="text-emerald-400" /></div>
                <div>
                  <div className="text-white/30 text-[10px] uppercase tracking-widest">Call / WhatsApp</div>
                  <div className="text-white text-[13px] font-semibold group-hover:text-emerald-400 transition-colors">+91 98500 44913</div>
                </div>
                <ArrowRight size={14} className="ml-auto text-white/20 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.8,duration:0.6 }} className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon:<MapPin size={15}/>, title:'Address', text:'Behind Ganesh Sweets, Yamuna Nagar, Nigdi, Pune' },
            { icon:<Phone size={15}/>, title:'Phone', text:'+91 98500 44913 · +91 97674 06395' },
            { icon:<Clock size={15}/>, title:'Hours', text:'Mon–Fri: 9AM–8PM · Sat: 9AM–2PM' },
          ].map(item=>(
            <div key={item.title} className="glass rounded-2xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 glass-green rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-emerald-400">{item.icon}</span></div>
              <div>
                <div className="text-white/30 text-[10px] uppercase tracking-widest mb-0.5">{item.title}</div>
                <div className="text-white/70 text-[13px] leading-snug">{item.text}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
