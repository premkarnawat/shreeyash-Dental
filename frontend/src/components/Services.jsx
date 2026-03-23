import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { useStore } from '../hooks/useStore.jsx'

function ServiceCard({ svc, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-60px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:40 }}
      animate={inView?{ opacity:1,y:0 }:{}}
      transition={{ duration:0.65,delay:index*0.06,ease:[0.22,1,0.36,1] }}
      className="glass-card rounded-2xl p-6 cursor-pointer relative overflow-hidden group"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" style={{ background:'radial-gradient(circle at 50% 0%,rgba(16,185,129,0.06),transparent 70%)' }} />
      <div className="relative z-10">
        <div className="w-12 h-12 glass-green rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">{svc.icon}</div>
        <h3 className="font-display text-[19px] font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">{svc.name}</h3>
        <p className="text-white/45 text-[13px] leading-relaxed mb-4 line-clamp-2">{svc.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-emerald-400 text-[12px] font-semibold glass-green px-3 py-1 rounded-full">{svc.price}</span>
          <ArrowRight size={14} className="text-white/20 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-200" />
        </div>
      </div>
    </motion.div>
  )
}

export default function Services() {
  const { services } = useStore()
  return (
    <section id="services" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div initial={{ opacity:0,y:30 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ duration:0.7 }} className="text-center mb-16">
          <span className="section-tag mb-5 inline-flex">Our Treatments</span>
          <h2 className="font-display text-[40px] sm:text-[52px] font-semibold text-white mt-5 mb-4">
            Complete Care,<span className="italic text-gradient"> One Clinic</span>
          </h2>
          <p className="text-white/45 text-[15px] max-w-lg mx-auto leading-relaxed">
            From preventive dentistry to complex smile makeovers — every treatment with precision and compassion.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((svc,i)=><ServiceCard key={svc.id} svc={svc} index={i}/>)}
        </div>
      </div>
    </section>
  )
}
