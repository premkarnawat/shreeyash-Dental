import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { useStore } from '../hooks/useStore'

function ServiceCard({ svc, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group glass rounded-2xl p-6 hover:glass-green transition-all duration-400 cursor-pointer relative overflow-hidden"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(16,185,129,0.08), transparent 70%)' }} />
      
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-emerald-700 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400" />

      <div className="relative z-10">
        <div className="w-12 h-12 glass-green rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {svc.icon}
        </div>
        <h3 className="font-display text-[19px] font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">
          {svc.name}
        </h3>
        <p className="text-white/50 text-[13px] leading-relaxed mb-4 line-clamp-3">
          {svc.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-emerald-400 text-[12px] font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            {svc.price}
          </span>
          <ArrowRight size={14} className="text-white/20 group-hover:text-emerald-400 transition-colors group-hover:translate-x-1 duration-200" />
        </div>
      </div>
    </motion.div>
  )
}

export default function Services() {
  const { services } = useStore()

  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-tag mb-4">Our Treatments</span>
          <h2 className="font-display text-5xl md:text-[56px] font-semibold text-white mt-4 mb-4">
            Complete Care,
            <span className="italic text-gradient"> One Clinic</span>
          </h2>
          <p className="text-white/50 text-[15px] max-w-xl mx-auto leading-relaxed">
            From preventive dentistry to complex smile makeovers — every treatment delivered with precision and care.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((svc, i) => (
            <ServiceCard key={svc.id} svc={svc} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
