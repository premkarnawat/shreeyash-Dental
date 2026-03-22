// api/auth/login.js
import { cors } from '../_db.js'

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const { username, password } = req.body

  // Simple credential check — replace with hashed password + DB lookup in production
  const ADMIN_USER = process.env.ADMIN_USER || 'admin'
  const ADMIN_PASS = process.env.ADMIN_PASS || 'clinic123'

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.status(200).json({ success: true, token: 'admin-session' })
  }
  return res.status(401).json({ error: 'Invalid credentials' })
}
