import { motion } from 'framer-motion'
import { ArrowRight, Star, Shield, Clock, Phone } from 'lucide-react'
import { CLINIC_INFO } from '../lib/mockData'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
}
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
}

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Ambient lights */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.06) 0%, transparent 70%)' }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="mb-6">
              <span className="section-tag">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Nigdi, Pimpri-Chinchwad · Pune
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="font-display text-5xl md:text-6xl lg:text-[68px] leading-[1.06] font-semibold text-white mb-6"
            >
              Your Smile
              <span className="block italic text-gradient"> Deserves</span>
              Exceptional Care
            </motion.h1>

            <motion.p variants={item} className="text-white/55 text-[16px] leading-relaxed mb-8 max-w-[460px] font-body">
              Shree Yash Multispeciality Dental Clinic — where cutting-edge technology meets compassionate dentistry. From routine checkups to full smile transformations under Dr. Sagar Jadhav.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-3 mb-10">
              <a href="#appointment" className="btn-primary flex items-center gap-2">
                Book Appointment
                <ArrowRight size={15} />
              </a>
              <a href="#services" className="btn-ghost flex items-center gap-2">
                Explore Treatments
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div variants={item} className="grid grid-cols-3 gap-4">
              {[
                { value: '4.9★', label: 'Rating', sub: '41 Reviews' },
                { value: '10+', label: 'Years', sub: 'Experience' },
                { value: '5000+', label: 'Patients', sub: 'Treated' },
              ].map(s => (
                <div key={s.value} className="glass rounded-2xl p-4 text-center">
                  <div className="font-display text-3xl font-semibold text-gradient leading-none mb-1">{s.value}</div>
                  <div className="text-white text-xs font-semibold tracking-wide">{s.label}</div>
                  <div className="text-white/40 text-[11px]">{s.sub}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right – Clinic Card */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            {/* Floating glow */}
            <div className="absolute inset-0 rounded-3xl blur-3xl" style={{ background: 'rgba(16,185,129,0.12)' }} />

            <div className="relative glass rounded-3xl p-7 border border-white/10">
              {/* Top strip */}
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600" />

              {/* Clinic visual placeholder */}
              <div className="w-full h-[280px] rounded-2xl mb-5 flex items-center justify-center text-7xl relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0a1f14, #0f2a1a)' }}>
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 60% 40%, rgba(16,185,129,0.15), transparent 60%)' }} />
                <motion.div
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10 text-6xl"
                >
                  🦷
                </motion.div>
                {/* floating badges */}
                <div className="absolute top-4 right-4 glass-green rounded-xl px-3 py-2 text-xs font-semibold text-emerald-300">
                  ✓ NABH Standards
                </div>
                <div className="absolute bottom-4 left-4 glass rounded-xl px-3 py-2 text-xs font-semibold text-white/70">
                  🏥 Multispeciality
                </div>
              </div>

              {/* Doctor info */}
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-xl">
                  👨‍⚕️
                </div>
                <div>
                  <div className="font-semibold text-white text-[15px]">Dr. Sagar Jadhav</div>
                  <div className="text-white/50 text-[12px]">B.D.S. (Pune) · Chief Dental Surgeon</div>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Star size={13} fill="#fbbf24" stroke="none" />
                  <span className="text-amber-400 text-sm font-semibold">4.9</span>
                </div>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2">
                {['Root Canal', 'Implants', 'Braces', 'Smile Makeover', 'Whitening', 'Pediatric'].map(t => (
                  <span key={t} className="px-3 py-1 glass-green rounded-full text-[11px] font-medium text-emerald-300">
                    {t}
                  </span>
                ))}
              </div>

              {/* Quick contact */}
              <a href="tel:+919850044913"
                className="mt-5 flex items-center gap-3 glass rounded-2xl p-3 hover:glass-green transition-all duration-300 group">
                <div className="w-9 h-9 glass-green rounded-xl flex items-center justify-center">
                  <Phone size={15} className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-white/40 text-[11px]">Call / WhatsApp</div>
                  <div className="text-white text-[13px] font-semibold group-hover:text-emerald-400 transition-colors">
                    +91 98500 44913
                  </div>
                </div>
                <ArrowRight size={14} className="ml-auto text-white/30 group-hover:text-emerald-400 transition-colors" />
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
