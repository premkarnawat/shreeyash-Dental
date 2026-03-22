// api/init.js - Run once to initialize Neon DB tables
import { initSchema, getDB, cors } from './_db.js'

export default async function handler(req, res) {
  cors(res)
  if (req.method !== 'GET') return res.status(405).end()

  const { key } = req.query
  if (key !== (process.env.INIT_SECRET || 'init-shreeyash-2025')) {
    return res.status(403).json({ error: 'Forbidden. Provide ?key=your_init_secret' })
  }

  try {
    await initSchema()
    const sql = getDB()

    const defaultSchedule = [
      { day: 'monday',    open: '09:00', close: '20:00', closed: false },
      { day: 'tuesday',   open: '09:00', close: '20:00', closed: false },
      { day: 'wednesday', open: '09:00', close: '20:00', closed: false },
      { day: 'thursday',  open: '09:00', close: '20:00', closed: false },
      { day: 'friday',    open: '09:00', close: '20:00', closed: false },
      { day: 'saturday',  open: '09:00', close: '14:00', closed: false },
      { day: 'sunday',    open: null,    close: null,    closed: true  },
    ]
    for (const s of defaultSchedule) {
      await sql`INSERT INTO schedule (day, open, close, closed) VALUES (${s.day},${s.open},${s.close},${s.closed}) ON CONFLICT (day) DO NOTHING`
    }

    return res.status(200).json({ success: true, message: 'DB initialized! All tables created and seeded.' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
