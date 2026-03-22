// api/news/[id].js
import { getDB, cors } from '../_db.js'
export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  const sql = getDB()
  const { id } = req.query
  try {
    if (req.method === 'DELETE') {
      await sql`DELETE FROM news WHERE id=${id}`
      return res.status(200).json({ deleted: true })
    }
    return res.status(405).end()
  } catch (err) { return res.status(500).json({ error: err.message }) }
}
