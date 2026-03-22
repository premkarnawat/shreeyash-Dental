// api/appointments.js
import { getDB, cors } from './_db.js'

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const sql = getDB()

  try {
    // GET - list appointments with optional filters
    if (req.method === 'GET') {
      const { status, date } = req.query
      let rows
      if (status && date) {
        rows = await sql`SELECT * FROM appointments WHERE status=${status} AND date=${date} ORDER BY date,time`
      } else if (status) {
        rows = await sql`SELECT * FROM appointments WHERE status=${status} ORDER BY date,time`
      } else if (date) {
        rows = await sql`SELECT * FROM appointments WHERE date=${date} ORDER BY time`
      } else {
        rows = await sql`SELECT * FROM appointments ORDER BY date DESC, time`
      }
      return res.status(200).json(rows)
    }

    // POST - create new appointment
    if (req.method === 'POST') {
      const { date, time, name, treatment, phone, email, notes } = req.body
      if (!date || !time || !name || !treatment || !phone) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // Check for conflicts
      const existing = await sql`
        SELECT id FROM appointments
        WHERE date=${date} AND time=${time} AND status != 'cancelled'
        LIMIT 1
      `
      if (existing.length > 0) {
        return res.status(409).json({ error: 'Time slot already booked. Please choose another slot.' })
      }

      // Check holiday
      const holiday = await sql`SELECT id FROM holidays WHERE date=${date} LIMIT 1`
      if (holiday.length > 0) {
        return res.status(400).json({ error: 'Clinic is closed on this date (holiday). Please select another date.' })
      }

      const [apt] = await sql`
        INSERT INTO appointments (date, time, name, treatment, phone, email, notes, status)
        VALUES (${date}, ${time}, ${name}, ${treatment}, ${phone}, ${email || null}, ${notes || null}, 'confirmed')
        RETURNING *
      `
      return res.status(201).json(apt)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('appointments error:', err)
    return res.status(500).json({ error: err.message })
  }
}
