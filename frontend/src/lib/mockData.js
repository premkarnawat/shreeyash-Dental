// src/lib/mockData.js
// Used as fallback when no database is configured, and as seed data

export const SERVICES = [
  { id: 1, name: 'Root Canal Treatment', description: 'Advanced endodontic therapy with rotary instruments. Pain-free with high success rate. Single or multi-visit options available.', price: '₹2,500 – ₹4,500', icon: '🦷', category: 'restorative', featured: true },
  { id: 2, name: 'Dental Implants', description: 'Permanent titanium implants that look, feel and function exactly like natural teeth. Premium brands available.', price: '₹25,000 – ₹45,000', icon: '🔩', category: 'restorative', featured: true },
  { id: 3, name: 'Smile Makeover', description: 'Complete cosmetic transformation combining veneers, whitening, bonding and reshaping for a Hollywood smile.', price: '₹15,000 – ₹80,000', icon: '✨', category: 'cosmetic', featured: true },
  { id: 4, name: 'Teeth Whitening', description: 'Professional in-office laser whitening. Get up to 8 shades brighter in a single 60-minute session.', price: '₹3,000 – ₹6,000', icon: '💡', category: 'cosmetic', featured: false },
  { id: 5, name: 'Braces & Orthodontics', description: 'Metal braces, ceramic braces, and clear aligner therapy. Customized treatment plans for all ages.', price: '₹20,000 – ₹60,000', icon: '📐', category: 'orthodontics', featured: true },
  { id: 6, name: 'Zirconia Crowns', description: 'Premium all-ceramic zirconia crowns offering superior strength, durability and natural-looking aesthetics.', price: '₹6,000 – ₹12,000', icon: '👑', category: 'restorative', featured: false },
  { id: 7, name: 'Pediatric Dentistry', description: 'Gentle, fun-focused dental care for children. We make first dental visits a positive, anxiety-free experience.', price: '₹300 – ₹2,500', icon: '🎈', category: 'preventive', featured: false },
  { id: 8, name: 'Periodontal (Gum) Treatment', description: 'Comprehensive gum disease management including scaling, root planing, and periodontal surgery.', price: '₹800 – ₹8,000', icon: '🌿', category: 'restorative', featured: false },
  { id: 9, name: 'Ceramic Bridges', description: 'Fixed tooth replacement with precision-fitted ceramic bridges that blend seamlessly with natural teeth.', price: '₹8,000 – ₹18,000', icon: '🌉', category: 'restorative', featured: false },
  { id: 10, name: 'Invisible Braces', description: 'Discreet clear aligner therapy for mild to moderate misalignment. Removable and virtually invisible.', price: '₹35,000 – ₹70,000', icon: '🔮', category: 'orthodontics', featured: true },
  { id: 11, name: 'Dentures', description: 'Custom-designed complete and partial dentures for comfortable chewing, speaking, and confident smiling.', price: '₹10,000 – ₹30,000', icon: '😊', category: 'restorative', featured: false },
  { id: 12, name: 'Composite Fillings', description: 'Tooth-colored composite resin fillings that restore cavities invisibly, matching your natural tooth color.', price: '₹600 – ₹2,000', icon: '🔧', category: 'preventive', featured: false },
]

export const PRICING = [
  {
    id: 1,
    name: 'Consultation',
    subtitle: 'First Visit',
    price: '₹300',
    period: 'per visit',
    items: ['Full oral examination', 'Digital X-ray review', 'Personalized treatment plan', 'Doctor consultation', 'Follow-up advice'],
    featured: false,
    color: 'from-slate-800 to-slate-700',
  },
  {
    id: 2,
    name: 'Routine Care',
    subtitle: 'Most Popular',
    price: '₹800+',
    period: 'per session',
    items: ['Scaling & polishing', 'Composite filling', 'Fluoride treatment', 'Oral hygiene kit', 'Post-care follow-up'],
    featured: true,
    color: 'from-emerald-900 to-emerald-800',
  },
  {
    id: 3,
    name: 'Advanced Treatment',
    subtitle: 'Specialized',
    price: '₹2,500+',
    period: 'per procedure',
    items: ['Root canal / Crown', 'Surgical procedures', 'Premium materials', 'Sedation available', '6-month follow-up'],
    featured: false,
    color: 'from-slate-800 to-slate-700',
  },
]

export const NEWS = [
  { id: 1, title: 'Free Dental Camp – Republic Day Special', date: '2025-01-20', category: 'Dental Camp', emoji: '🏕️', content: 'Join us on January 26th for our free dental health camp. First 50 patients get complimentary checkups, X-rays, and scaling. All are welcome.' },
  { id: 2, title: 'Invisible Braces Now Available at Special Price', date: '2025-01-10', category: 'New Treatment', emoji: '✨', content: 'We have partnered with a leading aligner brand to bring you affordable invisible braces. Book a free orthodontic consultation today.' },
  { id: 3, title: 'Winter Smile Special — 30% Off Whitening', date: '2024-12-28', category: 'Offer', emoji: '🎁', content: 'Brighten your smile this winter. Professional teeth whitening at 30% off throughout January 2025. Limited slots available.' },
  { id: 4, title: 'New Zirconia Crown Technology Installed', date: '2024-12-15', category: 'Technology', emoji: '⚙️', content: 'Our clinic now features a CAD/CAM milling unit for same-day crown fabrication. Get your crown in a single appointment.' },
]

export const GALLERY = [
  { id: 1, emoji: '🏥', label: 'Waiting Lounge', category: 'Interior' },
  { id: 2, emoji: '🦷', label: 'Treatment Suite', category: 'Interior' },
  { id: 3, emoji: '⚙️', label: 'Advanced Equipment', category: 'Equipment' },
  { id: 4, emoji: '👨‍⚕️', label: 'Dr. Sagar Jadhav', category: 'Team' },
  { id: 5, emoji: '😁', label: 'Patient Smile Result', category: 'Results' },
  { id: 6, emoji: '🏕️', label: 'Community Dental Camp', category: 'Events' },
  { id: 7, emoji: '🔬', label: 'Sterilization Room', category: 'Equipment' },
  { id: 8, emoji: '💎', label: 'Cosmetic Results', category: 'Results' },
]

export const HOLIDAYS = [
  { id: 1, date: '2025-01-26', reason: 'Republic Day' },
  { id: 2, date: '2025-08-15', reason: 'Independence Day' },
  { id: 3, date: '2025-10-02', reason: 'Gandhi Jayanti' },
]

export const SCHEDULE = {
  monday: { open: '09:00', close: '20:00', closed: false },
  tuesday: { open: '09:00', close: '20:00', closed: false },
  wednesday: { open: '09:00', close: '20:00', closed: false },
  thursday: { open: '09:00', close: '20:00', closed: false },
  friday: { open: '09:00', close: '20:00', closed: false },
  saturday: { open: '09:00', close: '14:00', closed: false },
  sunday: { open: '', close: '', closed: true },
}

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30',
]

export const SAMPLE_APPOINTMENTS = [
  { id: 1, date: '2025-01-20', time: '10:00', name: 'Rajesh Sharma', treatment: 'Root Canal Treatment', phone: '9876543210', email: 'rajesh@email.com', status: 'confirmed', notes: '' },
  { id: 2, date: '2025-01-20', time: '11:30', name: 'Priya Patel', treatment: 'Teeth Whitening', phone: '8765432109', email: '', status: 'confirmed', notes: '' },
  { id: 3, date: '2025-01-21', time: '14:00', name: 'Amit Kumar', treatment: 'Dental Implants', phone: '7654321098', email: '', status: 'pending', notes: 'Follow-up from last visit' },
  { id: 4, date: '2025-01-22', time: '09:30', name: 'Sunita Desai', treatment: 'Braces & Orthodontics', phone: '9988776655', email: '', status: 'confirmed', notes: '' },
  { id: 5, date: '2025-01-22', time: '12:00', name: 'Ravi Joshi', treatment: 'Composite Fillings', phone: '9090909090', email: '', status: 'cancelled', notes: 'Patient rescheduled' },
]

export const CLINIC_INFO = {
  name: 'Shree Yash Multispeciality Dental Clinic',
  tagline: 'Where Healthy Smiles Are Crafted',
  doctor: 'Dr. Sagar Jadhav',
  qualification: 'B.D.S. (Pune)',
  phone1: '+91 98500 44913',
  phone2: '+91 97674 06395',
  whatsapp: '919850044913',
  address: 'Plot No. L-C9B, Near Amrita Vidyalayam, Behind Ganesh Sweets, Yamuna Nagar, Nigdi, Pimpri-Chinchwad, Maharashtra 411044',
  mapUrl: 'https://maps.google.com/?q=Shree+Yash+Dental+Clinic+Nigdi+Pune',
  rating: 4.9,
  reviews: 41,
  experience: '10+',
  patients: '5000+',
}
