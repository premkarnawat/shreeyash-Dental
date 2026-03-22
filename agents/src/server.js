// src/server.js
// Main Express server for Shree Yash Dental AI Agents
// Deploy this on Render.com (free tier)
//
// ENDPOINTS:
//   POST /whatsapp/webhook      ← Set in Twilio WhatsApp Sandbox settings
//   POST /voice/incoming        ← Set in Twilio Phone Number settings
//   POST /voice/gather          ← Internal — Twilio posts speech results here
//   GET  /voice/reminder        ← Internal — reminder call TwiML
//   POST /whatsapp/confirm      ← Called by frontend after online booking
//   GET  /jobs/reminders        ← Hit daily via cron-job.org to send reminders
//   GET  /                      ← Health check

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'

import {
  handleWhatsAppMessage,
  sendBookingConfirmation,
  sendAppointmentReminder
} from './whatsappAgent.js'

import {
  handleIncomingCall,
  handleVoiceGather,
  handleReminderCallTwiML
} from './voiceAgent.js'

import { getDB } from './db.js'

const app = express()
const server = createServer(app)

// ─── Middleware ───────────────────────────────────────────────────
app.use(cors())
app.use(express.urlencoded({ extended: false }))  // Twilio sends URL-encoded
app.use(express.json())

// ─── Health check ─────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    service: 'Shree Yash Dental — AI Agents',
    status: '✅ running',
    mode: 'FREE (Groq + Twilio Sandbox/Trial)',
    config: {
      groq:   !!process.env.GROQ_API_KEY      ? '✅ connected' : '❌ GROQ_API_KEY missing',
      twilio: !!process.env.TWILIO_ACCOUNT_SID ? '✅ connected' : '❌ TWILIO keys missing',
      db:     !!process.env.DATABASE_URL        ? '✅ connected' : '❌ DATABASE_URL missing',
    },
    webhooks: {
      whatsapp: `${process.env.BASE_URL}/whatsapp/webhook`,
      voice:    `${process.env.BASE_URL}/voice/incoming`,
    },
    timestamp: new Date().toISOString()
  })
})

// ─── WhatsApp routes ──────────────────────────────────────────────

// Main webhook — paste this URL in Twilio → Messaging → Sandbox Settings
// "When a message comes in" → POST → https://your-render-app.onrender.com/whatsapp/webhook
app.post('/whatsapp/webhook', handleWhatsAppMessage)

// Called by the frontend after a patient books online
// Sends WhatsApp confirmation to the patient
app.post('/whatsapp/confirm', async (req, res) => {
  try {
    const { appointment } = req.body
    if (!appointment) {
      return res.status(400).json({ error: 'appointment object required' })
    }
    await sendBookingConfirmation(appointment)
    res.json({ success: true, message: 'Confirmation sent' })
  } catch (err) {
    console.error('Confirm error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── Voice routes ─────────────────────────────────────────────────

// Incoming call webhook — paste this URL in Twilio → Phone Numbers → your number
// "A Call Comes In" → POST → https://your-render-app.onrender.com/voice/incoming
app.post('/voice/incoming', handleIncomingCall)

// Handles caller's speech — Twilio posts here after Gather
app.post('/voice/gather', handleVoiceGather)

// TwiML for outbound reminder calls
app.get('/voice/reminder', handleReminderCallTwiML)

// ─── Daily reminder job ───────────────────────────────────────────
// Set up at cron-job.org (free):
// URL: https://your-render-app.onrender.com/jobs/reminders?secret=cron-shreeyash-2025
// Schedule: Daily at 18:00 (6 PM)
app.get('/jobs/reminders', async (req, res) => {
  const secret = req.query.secret || req.headers['x-cron-secret']
  if (secret !== (process.env.CRON_SECRET || 'cron-shreeyash-2025')) {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  try {
    const sql = getDB()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    // Get all confirmed appointments for tomorrow
    const appointments = await sql`
      SELECT * FROM appointments
      WHERE date = ${tomorrowStr}
        AND status = 'confirmed'
        AND phone IS NOT NULL
    `

    let sent = 0
    let failed = 0

    for (const apt of appointments) {
      try {
        await sendAppointmentReminder(apt)
        sent++
        // Small delay to avoid Twilio rate limits
        await new Promise(r => setTimeout(r, 300))
      } catch (err) {
        console.error(`Failed reminder for apt #${apt.id}:`, err.message)
        failed++
      }
    }

    const result = {
      success: true,
      date: tomorrowStr,
      total: appointments.length,
      sent,
      failed
    }
    console.log('📱 Reminders:', result)
    res.json(result)

  } catch (err) {
    console.error('Reminders job error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── Start server ─────────────────────────────────────────────────
const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║  🦷 Shree Yash Dental — AI Agents Server              ║
║  ✅ Running on port ${PORT}                              ║
║                                                       ║
║  📱 WhatsApp: POST /whatsapp/webhook                  ║
║  📞 Voice:    POST /voice/incoming                    ║
║  🔔 Reminders: GET /jobs/reminders                    ║
║                                                       ║
║  Set Twilio webhooks to:                              ║
║  ${(process.env.BASE_URL || 'https://your-app.onrender.com').padEnd(47)}║
╚═══════════════════════════════════════════════════════╝
  `)
})

export default app
