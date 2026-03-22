// api/appointments/[id].js
import { getDB, cors } from '../_db.js'

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const sql = getDB()
  const { id } = req.query

  try {
    if (req.method === 'PUT') {
      const { date, time, name, treatment, phone, email, notes, status } = req.body
      const [apt] = await sql`
        UPDATE appointments SET
          date      = COALESCE(${date || null}, date),
          time      = COALESCE(${time || null}, time),
          name      = COALESCE(${name || null}, name),
          treatment = COALESCE(${treatment || null}, treatment),
          phone     = COALESCE(${phone || null}, phone),
          email     = COALESCE(${email || null}, email),
          notes     = COALESCE(${notes || null}, notes),
          status    = COALESCE(${status || null}, status)
        WHERE id = ${id}
        RETURNING *
      `
      return res.status(200).json(apt)
    }

    if (req.method === 'DELETE') {
      await sql`DELETE FROM appointments WHERE id = ${id}`
      return res.status(200).json({ deleted: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
