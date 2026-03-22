// src/voiceAgent.js
// AI Voice Calling Agent
// Uses: Twilio Voice (free $15 trial) + Groq AI llama-3.3-70b (free)
// Mode: Twilio Gather — works on ALL Twilio plans including free trial
//
// HOW IT WORKS:
// 1. Patient calls your Twilio number
// 2. Twilio POSTs to /voice/incoming on this server
// 3. We return TwiML to greet and capture speech
// 4. Patient speaks → Twilio POSTs to /voice/gather
// 5. We send speech to Groq AI → get reply → return as TwiML
// 6. Loop continues until booking confirmed or caller hangs up

import twilio from 'twilio'
import Groq from 'groq-sdk'
import { getAvailableSlots, bookAppointment, sessionStore } from './db.js'

const VoiceResponse = twilio.twiml.VoiceResponse

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const C = {
  name:    process.env.CLINIC_NAME  || 'Shree Yash Multispeciality Dental Clinic',
  doctor:  process.env.DOCTOR_NAME  || 'Dr. Sagar Jadhav',
  phone:   process.env.CLINIC_PHONE || '+91 98500 44913',
  address: 'Plot L-C9B, near Amrita Vidyalayam, behind Ganesh Sweets, Nigdi, Pimpri-Chinchwad, Pune',
  hours:   'Monday to Friday from 9 AM to 8 PM, and Saturday from 9 AM to 2 PM. We are closed on Sundays.'
}

// ─── Voice system prompt ──────────────────────────────────────────
// Optimised for voice: short sentences, no markdown, natural speech
function buildVoicePrompt() {
  const today = new Date().toISOString().split('T')[0]
  return `You are Yash, the AI receptionist for ${C.name} in Pune, India.
You are speaking on a phone call. Speak naturally and clearly.
Use short sentences. Never use bullet points or asterisks or markdown.
Maximum 2-3 sentences per turn — the caller is on a phone.

CLINIC:
Doctor: ${C.doctor}, BDS from Pune.
Hours: ${C.hours}
Address: ${C.address}
Phone: ${C.phone}
Today: ${today}

BOOKING FLOW — follow step by step:
1. Warm greeting, ask how you can help
2. If they want an appointment: ask their full name
3. Ask what dental problem or treatment they need
4. Ask for their preferred date. Convert "tomorrow" or day names to YYYY-MM-DD
5. Say [CHECK_SLOTS:YYYY-MM-DD] — I will give you the result — read 4 slots to the caller
6. Ask which time they prefer
7. Confirm name, treatment, date, time — ask "shall I confirm this booking?"
8. Say [BOOK:FullName|YYYY-MM-DD|HH:MM|TreatmentName]
9. Tell them the booking ID and address, wish them well, say goodbye

TOOL COMMANDS (include exactly in your reply):
  [CHECK_SLOTS:YYYY-MM-DD]                     — get available slots
  [BOOK:FullName|YYYY-MM-DD|HH:MM|Treatment]   — create the appointment

PRICES (say "approximately"):
Checkup 300 rupees. Filling 600 to 2000. Root canal 2500 to 4500.
Whitening 3000 to 6000. Crown 6000 to 12000. Braces 20000 to 60000. Implants 25000 to 45000.

RULES:
- Emergencies or severe pain: tell them to visit immediately or call the clinic
- Never invent slot times — always use [CHECK_SLOTS] first
- Speak slowly and clearly — caller may be elderly
- After booking done, say goodbye warmly and end`
}

// ─── Step 1: Incoming call — greet and listen ─────────────────────
export function handleIncomingCall(req, res) {
  const { CallSid, From: callerPhone = '' } = req.body

  // Initialize session for this call
  sessionStore.set(CallSid, {
    phone: callerPhone,
    history: [],
    state: 'active'
  })

  const twiml = new VoiceResponse()

  // Greet the caller
  twiml.say(
    { voice: 'Polly.Raveena', language: 'en-IN' },
    `Namaste! Thank you for calling ${C.name}. 
     I am Yash, your AI dental assistant. 
     How can I help you today?`
  )

  // Start listening
  const gather = twiml.gather({
    input: 'speech',
    action: '/voice/gather',
    method: 'POST',
    speechTimeout: 'auto',
    language: 'en-IN',
    enhanced: 'true',
    speechModel: 'phone_call',
    timeout: 8
  })

  // No-input fallback
  twiml.say(
    { voice: 'Polly.Raveena', language: 'en-IN' },
    'I did not hear anything. Please speak after the beep.'
  )
  twiml.redirect({ method: 'POST' }, '/voice/incoming')

  res.type('text/xml')
  res.send(twiml.toString())
}

// ─── Step 2: Handle caller's speech → AI → speak response ─────────
export async function handleVoiceGather(req, res) {
  const {
    SpeechResult: speech = '',
    CallSid,
    From: callerPhone = '',
    Confidence: confidence = '0'
  } = req.body

  const twiml = new VoiceResponse()

  // Handle empty or low-confidence speech
  if (!speech.trim() || parseFloat(confidence) < 0.3) {
    twiml.say(
      { voice: 'Polly.Raveena', language: 'en-IN' },
      "I'm sorry, I didn't catch that. Could you please repeat?"
    )
    twiml.gather({
      input: 'speech',
      action: '/voice/gather',
      method: 'POST',
      speechTimeout: 'auto',
      language: 'en-IN',
      enhanced: 'true',
      speechModel: 'phone_call',
      timeout: 8
    })
    res.type('text/xml')
    return res.send(twiml.toString())
  }

  console.log(`📞 [${CallSid}] Caller said: "${speech}"`)

  try {
    const session = sessionStore.get(CallSid) || {
      phone: callerPhone, history: [], state: 'active'
    }

    // Add caller speech to history
    session.history.push({ role: 'user', content: speech })
    const trimmedHistory = session.history.slice(-12)

    // Call Groq AI (free)
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: buildVoicePrompt() },
        ...trimmedHistory
      ],
      temperature: 0.3,
      max_tokens: 200
    })

    let reply = completion.choices[0].message.content
    console.log(`🤖 [${CallSid}] Agent: "${reply}"`)

    // ── Execute [CHECK_SLOTS] tool ──────────────────────────────
    const slotMatch = reply.match(/\[CHECK_SLOTS:(\d{4}-\d{2}-\d{2})\]/)
    if (slotMatch) {
      const result = await getAvailableSlots(slotMatch[1])
      let slotText = ''

      if (!result.available) {
        slotText = `The clinic is not available on that day because of ${result.reason}. Please suggest another date.`
      } else {
        const free = result.slots.filter(s => s.available).map(s => s.time).slice(0, 4)
        if (free.length > 0) {
          slotText = `Available times are ${free.join(', ')}.`
        } else {
          slotText = `All slots on that day are fully booked. Please ask for another date.`
        }
      }
      reply = reply.replace(slotMatch[0], slotText)
    }

    // ── Execute [BOOK] tool ────────────────────────────────────
    const bookMatch = reply.match(/\[BOOK:([^|]+)\|(\d{4}-\d{2}-\d{2})\|(\d{2}:\d{2})\|([^\]]+)\]/)
    if (bookMatch) {
      const [, name, date, time, treatment] = bookMatch
      const phone = callerPhone.replace(/\D/g, '').slice(-10) || '0000000000'
      const result = await bookAppointment({
        name, date, time, treatment, phone,
        notes: 'Booked via AI Voice Agent'
      })

      let bookText = ''
      if (result.success) {
        const apt = result.appointment
        bookText = `Your appointment is confirmed. Booking ID is ${apt.id}. Please arrive at ${C.address}. See you on ${apt.date} at ${apt.time}.`
        sessionStore.clear(CallSid)
      } else {
        bookText = `I'm sorry, that slot is no longer available. Please choose another time.`
      }
      reply = reply.replace(bookMatch[0], bookText)
    }

    // Remove any leftover tool tags
    reply = reply.replace(/\[[^\]]+\]/g, '').trim()

    // Save to session history
    session.history.push({ role: 'assistant', content: reply })
    sessionStore.set(CallSid, session)

    // ── Build TwiML response ───────────────────────────────────
    twiml.say({ voice: 'Polly.Raveena', language: 'en-IN' }, reply)

    // Detect if call should end
    const endPhrases = [
      'goodbye', 'see you', 'have a great', 'take care',
      'thank you, bye', 'have a nice day', 'see you soon', 'have a good'
    ]
    const shouldEnd = endPhrases.some(p => reply.toLowerCase().includes(p))

    if (shouldEnd) {
      sessionStore.clear(CallSid)
      twiml.hangup()
    } else {
      // Keep listening
      twiml.gather({
        input: 'speech',
        action: '/voice/gather',
        method: 'POST',
        speechTimeout: 'auto',
        language: 'en-IN',
        enhanced: 'true',
        speechModel: 'phone_call',
        timeout: 8
      })
      // If no input
      twiml.say(
        { voice: 'Polly.Raveena', language: 'en-IN' },
        'Are you still there? Please speak when ready.'
      )
      twiml.redirect({ method: 'POST' }, '/voice/incoming')
    }

  } catch (err) {
    console.error('❌ Voice agent error:', err.message)
    twiml.say(
      { voice: 'Polly.Raveena', language: 'en-IN' },
      `I apologize for the inconvenience. Please call us directly at ${C.phone}. Thank you for calling!`
    )
    twiml.hangup()
  }

  res.type('text/xml')
  res.send(twiml.toString())
}

// ─── Outbound reminder call TwiML ────────────────────────────────
export function handleReminderCallTwiML(req, res) {
  const { name = 'Patient', date = '', time = '', treatment = '' } = req.query
  const twiml = new VoiceResponse()

  twiml.say(
    { voice: 'Polly.Raveena', language: 'en-IN' },
    `Hello ${name}! This is a reminder call from ${C.name}. 
     You have an appointment tomorrow for ${treatment} at ${time}. 
     Please arrive 5 minutes early. 
     If you need to cancel or reschedule, please call us at ${C.phone}. 
     We look forward to seeing you. Have a great day!`
  )
  twiml.hangup()

  res.type('text/xml')
  res.send(twiml.toString())
}

// ─── Make outbound reminder call ────────────────────────────────
export async function makeReminderCall(appointment) {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  )
  const baseUrl = process.env.BASE_URL
  const params = new URLSearchParams({
    name: appointment.name,
    date: appointment.date,
    time: appointment.time,
    treatment: appointment.treatment
  })

  const call = await client.calls.create({
    to: `+91${appointment.phone}`,
    from: process.env.TWILIO_VOICE_NUMBER,
    url: `${baseUrl}/voice/reminder?${params.toString()}`
  })

  console.log(`📞 Outbound reminder call: ${call.sid}`)
  return call.sid
}
