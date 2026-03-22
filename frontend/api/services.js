// api/services.js
import { getDB, cors } from './_db.js'

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  const sql = getDB()

  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM services ORDER BY id`
      return res.status(200).json(rows)
    }
    if (req.method === 'POST') {
      const { name, description, price, icon, category, featured } = req.body
      const [row] = await sql`
        INSERT INTO services (name, description, price, icon, category, featured)
        VALUES (${name}, ${description || ''}, ${price}, ${icon || '🦷'}, ${category || 'general'}, ${featured || false})
        RETURNING *
      `
      return res.status(201).json(row)
    }
    return res.status(405).end()
  } catch (err) { return res.status(500).json({ error: err.message }) }
}
