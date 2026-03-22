// api/slots.js - Get available slots for a date
import { getDB, cors } from './_db.js'

const ALL_SLOTS = [
  '09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30',
]

export default async function handler(req, res) {
  cors(res)
  if (req.method !== 'GET') return res.status(405).end()
  const sql = getDB()
  const { date } = req.query
  if (!date) return res.status(400).json({ error: 'date required' })

  try {
    // Check holiday
    const holiday = await sql`SELECT reason FROM holidays WHERE date=${date} LIMIT 1`
    if (holiday.length > 0) {
      return res.status(200).json({ holiday: true, reason: holiday[0].reason, slots: [] })
    }

    // Check schedule
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    const [daySchedule] = await sql`SELECT * FROM schedule WHERE day=${dayName} LIMIT 1`
    if (!daySchedule || daySchedule.closed) {
      return res.status(200).json({ closed: true, slots: [] })
    }

    // Booked slots
    const booked = await sql`
      SELECT time FROM appointments WHERE date=${date} AND status != 'cancelled'
    `
    const bookedTimes = booked.map(b => b.time.slice(0, 5))

    const [oh, om] = (daySchedule.open || '09:00').split(':').map(Number)
    const [ch, cm] = (daySchedule.close || '20:00').split(':').map(Number)

    const slots = ALL_SLOTS
      .filter(t => {
        const [h, m] = t.split(':').map(Number)
        return (h * 60 + m) >= (oh * 60 + om) && (h * 60 + m) < (ch * 60 + cm)
      })
      .map(t => ({ time: t, available: !bookedTimes.includes(t) }))

    return res.status(200).json({ slots })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
