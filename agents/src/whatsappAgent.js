// src/whatsappAgent.js
// WhatsApp AI Booking Agent
// Uses: Twilio WhatsApp Sandbox (free) + Groq AI llama-3.3-70b (free)
//
// HOW IT WORKS:
// 1. Patient sends WhatsApp message to Twilio sandbox number
// 2. Twilio POSTs to /whatsapp/webhook on this server
// 3. We process with Groq AI and reply via Twilio
// 4. AI checks slots and books into Neon DB via tool tags

import twilio from 'twilio'
import Groq from 'groq-sdk'
import {
  getAvailableSlots,
  bookAppointment,
  getAppointmentsByPhone,
  cancelAppointment,
  sessionStore
} from './db.js'

// ─── Clients ──────────────────────────────────────────────────────
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

// Groq is FREE — sign up at console.groq.com
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// ─── Clinic constants ─────────────────────────────────────────────
const C = {
  name:    process.env.CLINIC_NAME  || 'Shree Yash Multispeciality Dental Clinic',
  doctor:  process.env.DOCTOR_NAME  || 'Dr. Sagar Jadhav',
  phone:   process.env.CLINIC_PHONE || '+91 98500 44913',
  address: 'Plot No. L-C9B, Near Amrita Vidyalayam, Behind Ganesh Sweets, Yamuna Nagar, Nigdi, Pimpri-Chinchwad, Pune 411044',
  hours:   'Mon–Fri: 9 AM – 8 PM  |  Saturday: 9 AM – 2 PM  |  Sunday: Closed',
  from:    process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'
}

// ─── System prompt for Groq AI ────────────────────────────────────
function buildSystemPrompt() {
  const today = new Date().toISOString().split('T')[0]
  return `You are Yash, the AI booking assistant for ${C.name} in Pune, India.
You are chatting on WhatsApp. Be warm, friendly, and concise.
Use emojis naturally: 🦷 📅 ✅ ⏰ 📞

CLINIC:
- Doctor: ${C.doctor}, B.D.S. (Pune)  ⭐ Rating: 4.9 (41 reviews)
- Hours: ${C.hours}
- Phone: ${C.phone}
- Address: ${C.address}
- Today: ${today}

TREATMENTS AVAILABLE:
Dental Checkup, Root Canal, Teeth Whitening, Dental Implants, Braces,
Ceramic Crown, Zirconia Crown, Composite Filling, Smile Makeover,
Pediatric Dentistry, Gum Treatment, Teeth Extraction, Dentures, Invisible Braces

APPROXIMATE PRICES:
• Checkup: ₹300       • Filling: ₹600–2,000    • Root Canal: ₹2,500–4,500
• Whitening: ₹3,000–6,000  • Crown: ₹6,000–12,000  • Implants: ₹25,000–45,000
• Braces: ₹20,000–60,000   • Smile Makeover: ₹15,000–80,000

BOOKING FLOW — follow this order:
Step 1: Ask for patient's full name
Step 2: Ask what treatment or dental problem they have
Step 3: Ask for preferred date (accept natural language like "tomorrow", "Saturday")
Step 4: Use [CHECK_SLOTS:YYYY-MM-DD] tool — show the results to the patient
Step 5: Ask which time slot they prefer
Step 6: Confirm all details — name, treatment, date, time
Step 7: Use [BOOK:FullName|YYYY-MM-DD|HH:MM|TreatmentName] to book

TOOL COMMANDS (include exactly in your reply when needed):
  [CHECK_SLOTS:YYYY-MM-DD]                     — check available slots for a date
  [BOOK:FullName|YYYY-MM-DD|HH:MM|Treatment]   — create the appointment
  [MY_APPOINTMENTS]                            — view patient's upcoming appointments

IMPORTANT RULES:
- Keep messages short — this is WhatsApp not email
- NEVER guess slot availability — always use [CHECK_SLOTS] first
- Always confirm details before using [BOOK]
- For dental pain / emergencies: give clinic phone ${C.phone} immediately
- After booking confirmed, wish them well and close conversation warmly`
}

// ─── Tool executor ────────────────────────────────────────────────
async function executeTool(tag, callerPhone) {
  // [CHECK_SLOTS:2025-01-21]
  const slotMatch = tag.match(/\[CHECK_SLOTS:(\d{4}-\d{2}-\d{2})\]/)
  if (slotMatch) {
    const result = await getAvailableSlots(slotMatch[1])
    if (!result.available) {
      return `❌ Clinic not available on ${slotMatch[1]}\nReason: ${result.reason}\n\nPlease choose a different date.`
    }
    const free = result.slots.filter(s => s.available).map(s => s.time)
    if (!free.length) {
      return `😔 All slots on ${slotMatch[1]} are fully booked.\nPlease try another date.`
    }
    return `✅ Available slots on ${slotMatch[1]}:\n\n${free.slice(0, 8).join('  |  ')}\n\nWhich time works for you?`
  }

  // [BOOK:Rahul Sharma|2025-01-21|10:00|Root Canal]
  const bookMatch = tag.match(/\[BOOK:([^|]+)\|(\d{4}-\d{2}-\d{2})\|(\d{2}:\d{2})\|([^\]]+)\]/)
  if (bookMatch) {
    const [, name, date, time, treatment] = bookMatch
    // Extract 10-digit phone from the WhatsApp number
    const phone = callerPhone.replace('whatsapp:', '').replace(/\D/g, '').slice(-10)
    const result = await bookAppointment({ name, date, time, treatment, phone, notes: 'Booked via WhatsApp AI Agent' })

    if (!result.success) {
      if (result.reason === 'slot_taken') {
        const slots = await getAvailableSlots(date)
        const free = slots.slots?.filter(s => s.available).map(s => s.time).slice(0, 5) || []
        return `⚠️ Sorry, that slot was just taken!\n\nOther available times on ${date}:\n${free.join('  |  ')}\n\nWhich one works?`
      }
      return `❌ Booking failed: ${result.reason}\nPlease try again or call ${C.phone}`
    }

    const apt = result.appointment
    return `✅ *Appointment Confirmed!*
━━━━━━━━━━━━━━━━━━━━
🦷 *${apt.treatment}*
📅 Date: ${apt.date}
⏰ Time: ${apt.time}
👤 Patient: ${apt.name}
🆔 Booking ID: #${apt.id}

📍 ${C.address}
📞 ${C.phone}

To cancel, reply: *CANCEL ${apt.id}*
━━━━━━━━━━━━━━━━━━━━`
  }

  // [MY_APPOINTMENTS]
  if (tag.includes('MY_APPOINTMENTS')) {
    const phone = callerPhone.replace('whatsapp:', '').replace(/\D/g, '').slice(-10)
    const apts = await getAppointmentsByPhone(phone)
    if (!apts.length) return '📋 No upcoming appointments found for your number.'
    const lines = apts.map(a => `🆔 #${a.id}  ${a.date} @ ${a.time}\n    ${a.treatment}`)
    return `📋 *Your Upcoming Appointments:*\n\n${lines.join('\n\n')}\n\nTo cancel, reply: CANCEL [ID]`
  }

  return null
}

// ─── Main webhook handler ─────────────────────────────────────────
export async function handleWhatsAppMessage(req, res) {
  const { Body: rawBody = '', From: userPhone = '' } = req.body
  const msg = rawBody.trim()

  // Respond to Twilio immediately to avoid timeout
  res.set('Content-Type', 'text/xml')
  res.send('<Response></Response>')

  // ── Quick commands (no AI needed) ───────────────────────────────
  const upper = msg.toUpperCase()

  if (upper.startsWith('CANCEL ')) {
    const id = parseInt(msg.split(' ')[1])
    if (isNaN(id)) {
      await sendWhatsApp(userPhone, `❌ Invalid booking ID. Use: CANCEL 47`)
      return
    }
    const phone = userPhone.replace('whatsapp:', '').replace(/\D/g, '').slice(-10)
    const cancelled = await cancelAppointment(id, phone)
    if (cancelled) {
      await sendWhatsApp(userPhone, `✅ Appointment #${id} cancelled successfully.\n\nTo rebook, just say *Hi* anytime! 😊`)
    } else {
      await sendWhatsApp(userPhone, `❌ Could not find appointment #${id} linked to your number.\nCall us: ${C.phone}`)
    }
    return
  }

  if (['MY APPOINTMENTS', 'MY BOOKINGS', 'STATUS'].includes(upper)) {
    const result = await executeTool('[MY_APPOINTMENTS]', userPhone)
    await sendWhatsApp(userPhone, result)
    return
  }

  if (['STOP', 'QUIT', 'EXIT', 'BYE'].includes(upper)) {
    sessionStore.clear(userPhone)
    await sendWhatsApp(userPhone, `👋 Goodbye! Come back anytime.\nFor urgent help: 📞 ${C.phone}`)
    return
  }

  if (upper === 'HELP') {
    await sendWhatsApp(userPhone,
      `🦷 *${C.name}*\n\n` +
      `Available commands:\n` +
      `• *Hi* — Start booking an appointment\n` +
      `• *MY APPOINTMENTS* — View your bookings\n` +
      `• *CANCEL 47* — Cancel booking #47\n` +
      `• *TIMINGS* — Clinic hours\n` +
      `• *HELP* — This menu\n\n` +
      `Or just type your question! 😊`
    )
    return
  }

  if (['TIMINGS', 'TIMING', 'HOURS', 'TIME'].includes(upper)) {
    await sendWhatsApp(userPhone,
      `🕐 *Clinic Hours*\n\n${C.hours}\n\n📍 ${C.address}\n📞 ${C.phone}`)
    return
  }

  // ── AI Conversation ──────────────────────────────────────────────
  try {
    const session = sessionStore.get(userPhone)
    const history = (session.history || []).slice(-18)

    history.push({ role: 'user', content: msg })

    // Call Groq AI (free)
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        ...history
      ],
      temperature: 0.35,
      max_tokens: 450
    })

    let reply = completion.choices[0].message.content

    // Execute any tool tags found in the reply
    const toolMatches = reply.match(/\[(CHECK_SLOTS|BOOK|MY_APPOINTMENTS)[^\]]*\]/g) || []
    for (const tag of toolMatches) {
      const result = await executeTool(tag, userPhone)
      if (result) {
        reply = reply.replace(tag, result)
        // If booking was just confirmed, clear session
        if (tag.startsWith('[BOOK:') && result.includes('✅') && result.includes('Confirmed')) {
          sessionStore.clear(userPhone)
          await sendWhatsApp(userPhone, reply.replace(/\[[^\]]+\]/g, '').trim())
          return
        }
      }
    }

    // Remove any leftover unfired tool tags
    reply = reply.replace(/\[[^\]]+\]/g, '').trim()

    // Save conversation history
    history.push({ role: 'assistant', content: reply })
    sessionStore.set(userPhone, { history })

    await sendWhatsApp(userPhone, reply)

  } catch (err) {
    console.error('❌ WhatsApp agent error:', err.message)
    await sendWhatsApp(userPhone,
      `😔 I'm having a technical issue right now.\nPlease call us directly:\n📞 ${C.phone}`)
  }
}

// ─── Send WhatsApp message ────────────────────────────────────────
export async function sendWhatsApp(to, body) {
  try {
    await twilioClient.messages.create({
      from: C.from,
      to,
      body
    })
    console.log(`📤 WhatsApp → ${to}`)
  } catch (err) {
    console.error(`❌ Failed to send WhatsApp to ${to}:`, err.message)
  }
}

// ─── Send booking confirmation (called from frontend after online booking) ──
export async function sendBookingConfirmation(apt) {
  const digits = String(apt.phone).replace(/\D/g, '').slice(-10)
  const to = `whatsapp:+91${digits}`

  await sendWhatsApp(to,
    `🦷 *Appointment Confirmed!*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `*${C.name}*\n\n` +
    `👤 ${apt.name}\n` +
    `💉 ${apt.treatment}\n` +
    `📅 ${apt.date}  ⏰ ${apt.time}\n` +
    `🆔 Booking ID: #${apt.id}\n\n` +
    `📍 ${C.address}\n` +
    `📞 ${C.phone}\n\n` +
    `To cancel, reply: *CANCEL ${apt.id}*\n` +
    `━━━━━━━━━━━━━━━━━━━━`
  )
}

// ─── Send appointment reminder (run via daily cron job) ───────────
export async function sendAppointmentReminder(apt) {
  const digits = String(apt.phone).replace(/\D/g, '').slice(-10)
  const to = `whatsapp:+91${digits}`

  await sendWhatsApp(to,
    `⏰ *Appointment Reminder*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `Hi ${apt.name}! 👋\n\n` +
    `Your appointment is *tomorrow*:\n` +
    `💉 ${apt.treatment}\n` +
    `⏰ ${apt.time}\n\n` +
    `📍 ${C.address}\n\n` +
    `Reply *CANCEL ${apt.id}* if you need to cancel.\n` +
    `See you tomorrow! 🦷\n` +
    `━━━━━━━━━━━━━━━━━━━━`
  )
}
