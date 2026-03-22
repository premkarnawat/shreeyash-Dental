// api/schedule.js
import { getDB, cors } from './_db.js'
export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  const sql = getDB()
  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM schedule`
      const obj = {}
      rows.forEach(r => { obj[r.day] = { open: r.open?.slice(0,5), close: r.close?.slice(0,5), closed: r.closed } })
      return res.status(200).json(obj)
    }
    if (req.method === 'PUT') {
      const schedule = req.body
      for (const [day, val] of Object.entries(schedule)) {
        await sql`
          INSERT INTO schedule (day, open, close, closed) VALUES (${day}, ${val.open || null}, ${val.close || null}, ${val.closed || false})
          ON CONFLICT (day) DO UPDATE SET open=${val.open || null}, close=${val.close || null}, closed=${val.closed || false}
        `
      }
      return res.status(200).json({ updated: true })
    }
    return res.status(405).end()
  } catch (err) { return res.status(500).json({ error: err.message }) }
}
