import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Updates', href: '#news' },
  { label: 'Contact', href: '#contact' },
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
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3 glass border-b border-white/10'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl glass-green flex items-center justify-center text-lg font-display font-bold text-emerald-400 border border-emerald-500/30">
              S
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-[15px] font-semibold text-white tracking-wide">
                Shree Yash
              </span>
              <span className="text-[10px] text-emerald-400/70 tracking-[0.15em] uppercase font-body">
                Dental Clinic
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="text-[13px] font-medium text-white/60 hover:text-emerald-400 transition-colors duration-200 tracking-wide"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:+919850044913" className="flex items-center gap-2 text-[13px] text-white/50 hover:text-emerald-400 transition-colors">
              <Phone size={13} />
              <span>98500 44913</span>
            </a>
            <a href="#appointment" className="btn-primary text-[13px] py-2.5 px-5">
              Book Appointment
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(o => !o)}
            className="lg:hidden w-9 h-9 glass rounded-xl flex items-center justify-center text-white/70 hover:text-emerald-400 transition-colors"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[64px] left-0 right-0 z-40 glass border-b border-white/10 px-6 py-6 lg:hidden"
          >
            <div className="flex flex-col gap-4">
              {links.map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-[15px] font-medium text-white/70 hover:text-emerald-400 transition-colors py-1"
                >
                  {l.label}
                </a>
              ))}
              <a href="#appointment" onClick={() => setOpen(false)} className="btn-primary mt-2 text-center text-[14px]">
                Book Appointment
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
