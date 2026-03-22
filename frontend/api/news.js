// api/news.js
import { getDB, cors } from './_db.js'

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  const sql = getDB()
  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM news ORDER BY date DESC, created_at DESC`
      return res.status(200).json(rows)
    }
    if (req.method === 'POST') {
      const { title, content, category, emoji } = req.body
      const [row] = await sql`
        INSERT INTO news (title, content, category, emoji) VALUES (${title}, ${content || ''}, ${category || 'Announcement'}, ${emoji || '📰'}) RETURNING *`
      return res.status(201).json(row)
    }
    return res.status(405).end()
  } catch (err) { return res.status(500).json({ error: err.message }) }
}
