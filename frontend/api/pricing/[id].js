// api/pricing/[id].js
import { getDB, cors } from '../_db.js'
export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  const sql = getDB()
  const { id } = req.query
  try {
    if (req.method === 'PUT') {
      const { name, subtitle, price, period, items, featured } = req.body
      const [row] = await sql`
        UPDATE pricing SET
          name     = COALESCE(${name||null}, name),
          subtitle = COALESCE(${subtitle||null}, subtitle),
          price    = COALESCE(${price||null}, price),
          period   = COALESCE(${period||null}, period),
          featured = COALESCE(${featured!==undefined?featured:null}, featured)
        WHERE id=${id} RETURNING *`
      return res.status(200).json(row)
    }
    return res.status(405).end()
  } catch (err) { return res.status(500).json({ error: err.message }) }
}
