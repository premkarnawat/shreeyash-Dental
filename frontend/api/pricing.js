// api/pricing.js
import { getDB, cors } from './_db.js'
export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  const sql = getDB()
  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM pricing ORDER BY id`
      return res.status(200).json(rows)
    }
    return res.status(405).end()
  } catch (err) { return res.status(500).json({ error: err.message }) }
}
