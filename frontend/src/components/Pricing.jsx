import { motion } from 'framer-motion'
import { Check, Zap } from 'lucide-react'
import { useStore } from '../hooks/useStore.jsx'

export default function Pricing() {
  const { pricing } = useStore()
  return (
    <section id="pricing" className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full blur-3xl" style={{ background:'radial-gradient(ellipse,rgba(16,185,129,0.05),transparent 70%)' }} />
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div initial={{ opacity:0,y:30 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="text-center mb-16">
          <span className="section-tag mb-5 inline-flex">Transparent Pricing</span>
          <h2 className="font-display text-[40px] sm:text-[52px] font-semibold text-white mt-5 mb-4">
            Clear &<span className="italic text-gradient"> Affordable</span> Costs
          </h2>
          <p className="text-white/45 text-[15px] max-w-lg mx-auto">No hidden charges. No surprises. Quality dental care for every family.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricing.map((plan,i)=>(
            <motion.div key={plan.id}
              initial={{ opacity:0,y:40 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
              transition={{ delay:i*0.1,duration:0.7 }}
              className={`relative rounded-3xl p-8 overflow-hidden transition-all duration-400 hover:-translate-y-2 ${
                plan.featured ? 'glass-green border border-emerald-500/25' : 'glass border border-white/[0.07]'
              }`}
            >
              {plan.featured && <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600" />}
              {plan.featured && (
                <div className="absolute top-5 right-5">
                  <span className="flex items-center gap-1 bg-emerald-500 text-[#020617] text-[10px] font-bold px-3 py-1 rounded-full tracking-wide uppercase">
                    <Zap size={9} fill="currentColor"/>Popular
                  </span>
                </div>
              )}
              <div className="mb-6">
                <div className="text-white/35 text-[10px] font-bold tracking-widest uppercase mb-1">{plan.subtitle}</div>
                <div className="font-display text-[24px] font-semibold text-white">{plan.name}</div>
              </div>
              <div className="mb-8">
                <span className="font-display text-[52px] font-semibold text-gradient">{plan.price}</span>
                <span className="text-white/35 text-[13px] ml-2">/{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {(plan.items||[]).map(item=>(
                  <li key={item} className="flex items-center gap-3 text-[13px] text-white/65">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                      <Check size={10} className="text-emerald-400"/>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#appointment" className={`block text-center rounded-full py-3.5 text-[13px] font-semibold transition-all duration-300 ${
                plan.featured ? 'btn-primary' : 'border border-white/12 text-white/65 hover:border-emerald-500/35 hover:text-emerald-400 hover:bg-emerald-500/5'
              }`}>
                Book Now →
              </a>
            </motion.div>
          ))}
        </div>
        <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} className="text-center text-white/25 text-[12px] mt-8">
          * Prices may vary based on complexity. Consult Dr. Sagar Jadhav for an accurate quote.
        </motion.p>
      </div>
    </section>
  )
}
