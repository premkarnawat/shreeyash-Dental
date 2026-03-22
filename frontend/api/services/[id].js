// api/services/[id].js
import { getDB, cors } from '../_db.js'

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  const sql = getDB()
  const { id } = req.query

  try {
    if (req.method === 'PUT') {
      const { name, description, price, icon, category, featured } = req.body
      const [row] = await sql`
        UPDATE services SET
          name        = COALESCE(${name || null}, name),
          description = COALESCE(${description || null}, description),
          price       = COALESCE(${price || null}, price),
          icon        = COALESCE(${icon || null}, icon),
          featured    = COALESCE(${featured !== undefined ? featured : null}, featured)
        WHERE id = ${id} RETURNING *
      `
      return res.status(200).json(row)
    }
    if (req.method === 'DELETE') {
      await sql`DELETE FROM services WHERE id=${id}`
      return res.status(200).json({ deleted: true })
    }
    return res.status(405).end()
  } catch (err) { return res.status(500).json({ error: err.message }) }
}
