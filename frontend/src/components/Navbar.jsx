import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'

const links = [
  { label:'Services', href:'#services' },
  { label:'Pricing', href:'#pricing' },
  { label:'About', href:'#about' },
  { label:'Gallery', href:'#gallery' },
  { label:'Updates', href:'#news' },
  { label:'Contact', href:'#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y:-80, opacity:0 }}
        animate={{ y:0, opacity:1 }}
        transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-3 glass border-b border-white/[0.07] shadow-lg shadow-black/20' : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl glass-green flex items-center justify-center font-display font-bold text-emerald-400 text-lg border border-emerald-500/20 group-hover:scale-105 transition-transform">S</div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-[15px] font-semibold text-white tracking-wide">Shree Yash</span>
              <span className="text-[10px] text-emerald-400/60 tracking-[0.18em] uppercase">Dental Clinic</span>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {links.map(l => (
              <a key={l.href} href={l.href}
                className="text-[13px] font-medium text-white/55 hover:text-emerald-400 transition-colors duration-200 tracking-wide relative group">
                {l.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-emerald-400 group-hover:w-full transition-all duration-300 rounded-full" />
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:+919850044913" className="flex items-center gap-1.5 text-[13px] text-white/40 hover:text-emerald-400 transition-colors">
              <Phone size={12} /><span>98500 44913</span>
            </a>
            <a href="#appointment" className="btn-primary text-[13px] py-2.5 px-6">Book Now</a>
          </div>

          <button onClick={()=>setOpen(o=>!o)}
            className="lg:hidden w-9 h-9 glass rounded-xl flex items-center justify-center text-white/60 hover:text-emerald-400 transition-colors">
            {open ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0,y:-16 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-16 }}
            transition={{ duration:0.22 }}
            className="fixed top-[64px] left-0 right-0 z-40 glass border-b border-white/[0.07] px-5 py-5 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {links.map(l=>(
                <a key={l.href} href={l.href} onClick={()=>setOpen(false)}
                  className="text-[15px] font-medium text-white/65 hover:text-emerald-400 transition-colors py-2.5 border-b border-white/[0.05] last:border-0">
                  {l.label}
                </a>
              ))}
              <a href="#appointment" onClick={()=>setOpen(false)} className="btn-primary mt-3 text-center text-[14px]">
                Book Appointment
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
