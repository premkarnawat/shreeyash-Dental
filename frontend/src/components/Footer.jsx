import { motion } from 'framer-motion'
import { Phone, MapPin, Clock, ArrowUpRight } from 'lucide-react'

const links = {
  Treatments: ['Root Canal', 'Dental Implants', 'Braces', 'Smile Makeover', 'Whitening', 'Zirconia Crowns'],
  'Quick Links': ['About Us', 'Book Appointment', 'Pricing', 'Gallery', 'News & Events', 'Contact'],
  Connect: ['WhatsApp Us', 'Call Now', 'Google Maps', 'Admin Panel'],
}

export default function Footer() {
  return (
    <footer className="relative pt-20 pb-8 border-t border-white/5">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px]"
          style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,0.04), transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl glass-green flex items-center justify-center text-lg font-display font-bold text-emerald-400">S</div>
              <div>
                <div className="font-display text-[16px] font-semibold text-white">Shree Yash</div>
                <div className="text-[10px] text-emerald-400/60 tracking-[0.15em] uppercase">Multispeciality Dental Clinic</div>
              </div>
            </div>
            <p className="text-white/40 text-[13px] leading-relaxed mb-6 max-w-xs">
              Delivering exceptional dental care with compassion, precision, and the latest technology. Your smile is our mission.
            </p>
            <div className="space-y-2.5">
              <a href="tel:+919850044913" className="flex items-center gap-2.5 text-white/50 hover:text-emerald-400 transition-colors text-[13px]">
                <Phone size={13} /> +91 98500 44913
              </a>
              <a href="#contact" className="flex items-center gap-2.5 text-white/50 hover:text-emerald-400 transition-colors text-[13px]">
                <MapPin size={13} /> Nigdi, Pimpri-Chinchwad, Pune 411044
              </a>
              <div className="flex items-center gap-2.5 text-white/50 text-[13px]">
                <Clock size={13} /> Mon–Fri: 9 AM – 8 PM · Sat: 9 AM – 2 PM
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.15em] mb-5">{title}</h4>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item}>
                    <a
                      href={item === 'Admin Panel' ? '/admin/login' : '#'}
                      className="text-[13px] text-white/50 hover:text-emerald-400 transition-colors flex items-center gap-1 group"
                    >
                      {item}
                      {item === 'Admin Panel' && <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-[12px]">
            © {new Date().getFullYear()} Shree Yash Multispeciality Dental Clinic · Dr. Sagar Jadhav B.D.S.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-white/20 text-[11px]">Built for excellence in dental care</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-500/60 text-[11px]">System Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
