// api/holidays.js
import { getDB, cors } from './_db.js'
export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  const sql = getDB()
  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM holidays ORDER BY date`
      return res.status(200).json(rows)
    }
    if (req.method === 'POST') {
      const { date, reason } = req.body
      const [row] = await sql`INSERT INTO holidays (date, reason) VALUES (${date}, ${reason || 'Holiday'}) ON CONFLICT (date) DO NOTHING RETURNING *`
      return res.status(201).json(row || { error: 'Date already exists' })
    }
    return res.status(405).end()
  } catch (err) { return res.status(500).json({ error: err.message }) }
}
