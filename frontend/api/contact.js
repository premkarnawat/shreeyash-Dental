// api/contact.js
import { cors } from './_db.js'
export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()
  const { name, phone, subject, message } = req.body
  if (!name || !message) return res.status(400).json({ error: 'Name and message required.' })
  // In production: integrate with email service (SendGrid, Resend, etc.)
  console.log('Contact form submission:', { name, phone, subject, message })
  return res.status(200).json({ success: true, message: 'Message received. We will contact you shortly.' })
}
