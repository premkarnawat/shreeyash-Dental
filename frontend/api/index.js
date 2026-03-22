// api/index.js
// ONE single serverless function handling ALL routes
// This keeps us within Vercel Hobby plan's 12 function limit
// Routes: /api/appointments, /api/services, /api/news, /api/gallery,
//         /api/holidays, /api/schedule, /api/slots, /api/pricing,
//         /api/contact, /api/auth/login, /api/init, /api/reports

import { neon } from '@neondatabase/serverless'

function getDB() {
  return neon(process.env.DATABASE_URL)
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
}

const ALL_SLOTS = [
  '09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30'
]

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const url = req.url || ''
  // Strip /api prefix and query string to get the path
  const path = url.replace(/^\/api/, '').split('?')[0].replace(/\/$/, '') || '/'
  const method = req.method
  const sql = getDB()

  try {

    // ── INIT ─────────────────────────────────────────────────────
    if (path === '/init') {
      const { key } = req.query
      if (key !== (process.env.INIT_SECRET || 'init-shreeyash-2025')) {
        return res.status(403).json({ error: 'Forbidden' })
      }
      await sql`CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY, date DATE NOT NULL, time TIME NOT NULL,
        name TEXT NOT NULL, treatment TEXT NOT NULL, phone TEXT NOT NULL,
        email TEXT, notes TEXT, status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW())`
      await sql`CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY, name TEXT NOT NULL, description TEXT,
        price TEXT NOT NULL, icon TEXT DEFAULT '🦷', category TEXT DEFAULT 'general',
        featured BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW())`
      await sql`CREATE TABLE IF NOT EXISTS pricing (
        id SERIAL PRIMARY KEY, name TEXT NOT NULL, subtitle TEXT,
        price TEXT NOT NULL, period TEXT DEFAULT 'per visit',
        items JSONB DEFAULT '[]', featured BOOLEAN DEFAULT FALSE)`
      await sql`CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY, title TEXT NOT NULL, content TEXT,
        category TEXT DEFAULT 'Announcement', emoji TEXT DEFAULT '📰',
        date DATE DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ DEFAULT NOW())`
      await sql`CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY, label TEXT NOT NULL, category TEXT DEFAULT 'General',
        emoji TEXT DEFAULT '📸', url TEXT, created_at TIMESTAMPTZ DEFAULT NOW())`
      await sql`CREATE TABLE IF NOT EXISTS holidays (
        id SERIAL PRIMARY KEY, date DATE NOT NULL UNIQUE, reason TEXT DEFAULT 'Holiday')`
      await sql`CREATE TABLE IF NOT EXISTS schedule (
        day TEXT PRIMARY KEY, open TIME, close TIME, closed BOOLEAN DEFAULT FALSE)`

      // Seed schedule
      const days = [
        { day: 'monday',    open: '09:00', close: '20:00', closed: false },
        { day: 'tuesday',   open: '09:00', close: '20:00', closed: false },
        { day: 'wednesday', open: '09:00', close: '20:00', closed: false },
        { day: 'thursday',  open: '09:00', close: '20:00', closed: false },
        { day: 'friday',    open: '09:00', close: '20:00', closed: false },
        { day: 'saturday',  open: '09:00', close: '14:00', closed: false },
        { day: 'sunday',    open: null,    close: null,    closed: true  },
      ]
      for (const d of days) {
        await sql`INSERT INTO schedule (day,open,close,closed) VALUES (${d.day},${d.open},${d.close},${d.closed}) ON CONFLICT (day) DO NOTHING`
      }

      // Seed services
      const services = [
        { name: 'Root Canal Treatment',  description: 'Advanced endodontic therapy. Pain-free with high success rate.',         price: '₹2,500 – ₹4,500',   icon: '🦷', category: 'restorative', featured: true  },
        { name: 'Dental Implants',        description: 'Permanent titanium implants that look and feel like natural teeth.',      price: '₹25,000 – ₹45,000', icon: '🔩', category: 'restorative', featured: true  },
        { name: 'Smile Makeover',         description: 'Complete cosmetic transformation — veneers, whitening, bonding.',        price: '₹15,000 – ₹80,000', icon: '✨', category: 'cosmetic',    featured: true  },
        { name: 'Teeth Whitening',        description: 'Professional laser whitening. Up to 8 shades brighter in 60 minutes.',  price: '₹3,000 – ₹6,000',   icon: '💡', category: 'cosmetic',    featured: false },
        { name: 'Braces & Orthodontics',  description: 'Metal, ceramic braces and clear aligner therapy for all ages.',         price: '₹20,000 – ₹60,000', icon: '📐', category: 'orthodontics',featured: true  },
        { name: 'Zirconia Crowns',        description: 'Premium all-ceramic crowns with superior strength and aesthetics.',     price: '₹6,000 – ₹12,000',  icon: '👑', category: 'restorative', featured: false },
        { name: 'Pediatric Dentistry',    description: 'Gentle, fun-focused dental care for children.',                         price: '₹300 – ₹2,500',     icon: '🎈', category: 'preventive',  featured: false },
        { name: 'Gum Treatment',          description: 'Scaling, root planing and periodontal surgeries.',                      price: '₹800 – ₹8,000',     icon: '🌿', category: 'restorative', featured: false },
        { name: 'Ceramic Bridges',        description: 'Fixed tooth replacement with precision-fitted ceramic bridges.',        price: '₹8,000 – ₹18,000',  icon: '🌉', category: 'restorative', featured: false },
        { name: 'Invisible Braces',       description: 'Discreet clear aligner therapy for mild to moderate misalignment.',     price: '₹35,000 – ₹70,000', icon: '🔮', category: 'orthodontics',featured: true  },
        { name: 'Dentures',               description: 'Custom-designed complete and partial dentures.',                        price: '₹10,000 – ₹30,000', icon: '😊', category: 'restorative', featured: false },
        { name: 'Composite Fillings',     description: 'Tooth-colored fillings that restore cavities invisibly.',              price: '₹600 – ₹2,000',     icon: '🔧', category: 'preventive',  featured: false },
      ]
      for (const s of services) {
        await sql`INSERT INTO services (name,description,price,icon,category,featured) VALUES (${s.name},${s.description},${s.price},${s.icon},${s.category},${s.featured}) ON CONFLICT DO NOTHING`
      }

      // Seed pricing
      const pricing = [
        { name: 'Consultation', subtitle: 'First Visit',  price: '₹300',   period: 'per visit',     items: JSON.stringify(['Full oral examination','Digital X-ray review','Personalized treatment plan','Doctor consultation','Follow-up advice']), featured: false },
        { name: 'Routine Care', subtitle: 'Most Popular', price: '₹800+',  period: 'per session',   items: JSON.stringify(['Scaling & polishing','Composite filling','Fluoride treatment','Oral hygiene kit','Post-care follow-up']),                featured: true  },
        { name: 'Advanced',     subtitle: 'Specialized',  price: '₹2,500+',period: 'per procedure', items: JSON.stringify(['Root canal / Crown','Surgical procedures','Premium materials','Sedation available','6-month follow-up']),                featured: false },
      ]
      for (const p of pricing) {
        await sql`INSERT INTO pricing (name,subtitle,price,period,items,featured) VALUES (${p.name},${p.subtitle},${p.price},${p.period},${p.items}::jsonb,${p.featured}) ON CONFLICT DO NOTHING`
      }

      return res.status(200).json({ success: true, message: 'Database initialized and seeded successfully!' })
    }

    // ── AUTH ──────────────────────────────────────────────────────
    if (path === '/auth/login' && method === 'POST') {
      const { username, password } = req.body
      const ADMIN_USER = process.env.ADMIN_USER || 'admin'
      const ADMIN_PASS = process.env.ADMIN_PASS || 'clinic123'
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        return res.status(200).json({ success: true })
      }
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // ── SLOTS ─────────────────────────────────────────────────────
    if (path === '/slots' && method === 'GET') {
      const { date } = req.query
      if (!date) return res.status(400).json({ error: 'date required' })

      const holiday = await sql`SELECT reason FROM holidays WHERE date=${date} LIMIT 1`
      if (holiday.length > 0) {
        return res.status(200).json({ holiday: true, reason: holiday[0].reason, slots: [] })
      }
      const dayName = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
      const [daySchedule] = await sql`SELECT * FROM schedule WHERE day=${dayName} LIMIT 1`
      if (!daySchedule || daySchedule.closed) {
        return res.status(200).json({ closed: true, slots: [] })
      }
      const booked = await sql`SELECT time FROM appointments WHERE date=${date} AND status!='cancelled'`
      const bookedTimes = booked.map(b => b.time.slice(0, 5))
      const [oh, om] = (daySchedule.open || '09:00').slice(0,5).split(':').map(Number)
      const [ch, cm] = (daySchedule.close || '20:00').slice(0,5).split(':').map(Number)
      const slots = ALL_SLOTS
        .filter(t => { const [h,m] = t.split(':').map(Number); return (h*60+m) >= (oh*60+om) && (h*60+m) < (ch*60+cm) })
        .map(t => ({ time: t, available: !bookedTimes.includes(t) }))
      return res.status(200).json({ slots })
    }

    // ── APPOINTMENTS ──────────────────────────────────────────────
    if (path === '/appointments') {
      if (method === 'GET') {
        const { status, date } = req.query
        let rows
        if (status && date) rows = await sql`SELECT * FROM appointments WHERE status=${status} AND date=${date} ORDER BY date,time`
        else if (status)    rows = await sql`SELECT * FROM appointments WHERE status=${status} ORDER BY date DESC,time`
        else if (date)      rows = await sql`SELECT * FROM appointments WHERE date=${date} ORDER BY time`
        else                rows = await sql`SELECT * FROM appointments ORDER BY date DESC,time`
        return res.status(200).json(rows)
      }
      if (method === 'POST') {
        const { date, time, name, treatment, phone, email, notes } = req.body
        if (!date||!time||!name||!treatment||!phone) return res.status(400).json({ error: 'Missing required fields' })
        const conflict = await sql`SELECT id FROM appointments WHERE date=${date} AND time=${time} AND status!='cancelled' LIMIT 1`
        if (conflict.length > 0) return res.status(409).json({ error: 'Time slot already booked. Please choose another slot.' })
        const holiday = await sql`SELECT id FROM holidays WHERE date=${date} LIMIT 1`
        if (holiday.length > 0) return res.status(400).json({ error: 'Clinic is closed on this date (holiday).' })
        const [apt] = await sql`INSERT INTO appointments (date,time,name,treatment,phone,email,notes,status) VALUES (${date},${time},${name},${treatment},${phone},${email||null},${notes||null},'confirmed') RETURNING *`
        return res.status(201).json(apt)
      }
    }

    // ── APPOINTMENTS by ID ────────────────────────────────────────
    const aptMatch = path.match(/^\/appointments\/(\d+)$/)
    if (aptMatch) {
      const id = aptMatch[1]
      if (method === 'PUT') {
        const { date, time, name, treatment, phone, status } = req.body
        const [apt] = await sql`UPDATE appointments SET date=COALESCE(${date||null},date),time=COALESCE(${time||null},time),name=COALESCE(${name||null},name),treatment=COALESCE(${treatment||null},treatment),phone=COALESCE(${phone||null},phone),status=COALESCE(${status||null},status) WHERE id=${id} RETURNING *`
        return res.status(200).json(apt)
      }
      if (method === 'DELETE') {
        await sql`DELETE FROM appointments WHERE id=${id}`
        return res.status(200).json({ deleted: true })
      }
    }

    // ── SERVICES ──────────────────────────────────────────────────
    if (path === '/services') {
      if (method === 'GET') {
        const rows = await sql`SELECT * FROM services ORDER BY id`
        return res.status(200).json(rows)
      }
      if (method === 'POST') {
        const { name, description, price, icon, category, featured } = req.body
        const [row] = await sql`INSERT INTO services (name,description,price,icon,category,featured) VALUES (${name},${description||''},${price},${icon||'🦷'},${category||'general'},${featured||false}) RETURNING *`
        return res.status(201).json(row)
      }
    }
    const svcMatch = path.match(/^\/services\/(\d+)$/)
    if (svcMatch) {
      const id = svcMatch[1]
      if (method === 'PUT') {
        const { name, description, price, icon, featured } = req.body
        const [row] = await sql`UPDATE services SET name=COALESCE(${name||null},name),description=COALESCE(${description||null},description),price=COALESCE(${price||null},price),icon=COALESCE(${icon||null},icon),featured=COALESCE(${featured!==undefined?featured:null},featured) WHERE id=${id} RETURNING *`
        return res.status(200).json(row)
      }
      if (method === 'DELETE') {
        await sql`DELETE FROM services WHERE id=${id}`
        return res.status(200).json({ deleted: true })
      }
    }

    // ── PRICING ───────────────────────────────────────────────────
    if (path === '/pricing') {
      if (method === 'GET') {
        const rows = await sql`SELECT * FROM pricing ORDER BY id`
        return res.status(200).json(rows)
      }
    }
    const priceMatch = path.match(/^\/pricing\/(\d+)$/)
    if (priceMatch) {
      const id = priceMatch[1]
      if (method === 'PUT') {
        const { name, price, subtitle, period, featured } = req.body
        const [row] = await sql`UPDATE pricing SET name=COALESCE(${name||null},name),price=COALESCE(${price||null},price),subtitle=COALESCE(${subtitle||null},subtitle),period=COALESCE(${period||null},period),featured=COALESCE(${featured!==undefined?featured:null},featured) WHERE id=${id} RETURNING *`
        return res.status(200).json(row)
      }
    }

    // ── NEWS ──────────────────────────────────────────────────────
    if (path === '/news') {
      if (method === 'GET') {
        const rows = await sql`SELECT * FROM news ORDER BY date DESC, created_at DESC`
        return res.status(200).json(rows)
      }
      if (method === 'POST') {
        const { title, content, category, emoji } = req.body
        const [row] = await sql`INSERT INTO news (title,content,category,emoji) VALUES (${title},${content||''},${category||'Announcement'},${emoji||'📰'}) RETURNING *`
        return res.status(201).json(row)
      }
    }
    const newsMatch = path.match(/^\/news\/(\d+)$/)
    if (newsMatch) {
      if (method === 'DELETE') {
        await sql`DELETE FROM news WHERE id=${newsMatch[1]}`
        return res.status(200).json({ deleted: true })
      }
    }

    // ── GALLERY ───────────────────────────────────────────────────
    if (path === '/gallery') {
      if (method === 'GET') {
        const rows = await sql`SELECT * FROM gallery ORDER BY id`
        return res.status(200).json(rows)
      }
      if (method === 'POST') {
        const { label, category, emoji, url } = req.body
        const [row] = await sql`INSERT INTO gallery (label,category,emoji,url) VALUES (${label},${category||'General'},${emoji||'📸'},${url||null}) RETURNING *`
        return res.status(201).json(row)
      }
    }
    const galleryMatch = path.match(/^\/gallery\/(\d+)$/)
    if (galleryMatch) {
      if (method === 'DELETE') {
        await sql`DELETE FROM gallery WHERE id=${galleryMatch[1]}`
        return res.status(200).json({ deleted: true })
      }
    }

    // ── HOLIDAYS ──────────────────────────────────────────────────
    if (path === '/holidays') {
      if (method === 'GET') {
        const rows = await sql`SELECT * FROM holidays ORDER BY date`
        return res.status(200).json(rows)
      }
      if (method === 'POST') {
        const { date, reason } = req.body
        const [row] = await sql`INSERT INTO holidays (date,reason) VALUES (${date},${reason||'Holiday'}) ON CONFLICT (date) DO NOTHING RETURNING *`
        return res.status(201).json(row || { error: 'Date already exists' })
      }
    }
    const holidayMatch = path.match(/^\/holidays\/(\d+)$/)
    if (holidayMatch) {
      if (method === 'DELETE') {
        await sql`DELETE FROM holidays WHERE id=${holidayMatch[1]}`
        return res.status(200).json({ deleted: true })
      }
    }

    // ── SCHEDULE ──────────────────────────────────────────────────
    if (path === '/schedule') {
      if (method === 'GET') {
        const rows = await sql`SELECT * FROM schedule`
        const obj = {}
        rows.forEach(r => { obj[r.day] = { open: r.open?.slice(0,5), close: r.close?.slice(0,5), closed: r.closed } })
        return res.status(200).json(obj)
      }
      if (method === 'PUT') {
        const schedule = req.body
        for (const [day, val] of Object.entries(schedule)) {
          await sql`INSERT INTO schedule (day,open,close,closed) VALUES (${day},${val.open||null},${val.close||null},${val.closed||false}) ON CONFLICT (day) DO UPDATE SET open=${val.open||null},close=${val.close||null},closed=${val.closed||false}`
        }
        return res.status(200).json({ updated: true })
      }
    }

    // ── CONTACT ───────────────────────────────────────────────────
    if (path === '/contact' && method === 'POST') {
      const { name, message } = req.body
      if (!name || !message) return res.status(400).json({ error: 'Name and message required.' })
      console.log('Contact form:', req.body)
      return res.status(200).json({ success: true })
    }

    // ── REPORTS ───────────────────────────────────────────────────
    if (path === '/reports' && method === 'GET') {
      const [total]     = await sql`SELECT COUNT(*) AS count FROM appointments`
      const [confirmed] = await sql`SELECT COUNT(*) AS count FROM appointments WHERE status='confirmed'`
      const [pending]   = await sql`SELECT COUNT(*) AS count FROM appointments WHERE status='pending'`
      const [cancelled] = await sql`SELECT COUNT(*) AS count FROM appointments WHERE status='cancelled'`
      const today       = new Date().toISOString().split('T')[0]
      const [todayApts] = await sql`SELECT COUNT(*) AS count FROM appointments WHERE date=${today}`
      const top         = await sql`SELECT treatment, COUNT(*) AS cnt FROM appointments GROUP BY treatment ORDER BY cnt DESC LIMIT 6`
      return res.status(200).json({
        generatedAt: new Date().toISOString(),
        appointments: {
          total:     Number(total.count),
          confirmed: Number(confirmed.count),
          pending:   Number(pending.count),
          cancelled: Number(cancelled.count),
          today:     Number(todayApts.count),
        },
        topTreatments: top.map(t => ({ treatment: t.treatment, count: Number(t.cnt) }))
      })
    }

    return res.status(404).json({ error: `Route not found: ${method} ${path}` })

  } catch (err) {
    console.error('API error:', err)
    return res.status(500).json({ error: err.message })
  }
}
