// src/db.js
// Neon PostgreSQL helpers — shared by WhatsApp agent and Voice agent
// Connects to the SAME database as the main frontend website

import { neon } from '@neondatabase/serverless'

let _sql = null

export function getDB() {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set in environment variables.')
    }
    _sql = neon(process.env.DATABASE_URL)
  }
  return _sql
}

// ─────────────────────────────────────────────────────────────────
// SLOT AVAILABILITY
// Returns available + taken slots for a given date
// ─────────────────────────────────────────────────────────────────
export async function getAvailableSlots(date) {
  const sql = getDB()

  // 1. Check if date is a holiday
  const holidays = await sql`
    SELECT reason FROM holidays WHERE date = ${date} LIMIT 1
  `
  if (holidays.length > 0) {
    return {
      available: false,
      reason: `Holiday — ${holidays[0].reason}`,
      slots: []
    }
  }

  // 2. Get day-of-week schedule
  const dayName = new Date(date + 'T12:00:00')
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase()

  const schedule = await sql`
    SELECT * FROM schedule WHERE day = ${dayName} LIMIT 1
  `
  if (!schedule.length || schedule[0].closed) {
    return {
      available: false,
      reason: `Clinic is closed on ${dayName}s`,
      slots: []
    }
  }

  // 3. Get already booked slots
  const booked = await sql`
    SELECT time FROM appointments
    WHERE date = ${date} AND status != 'cancelled'
  `
  const bookedTimes = booked.map(b => b.time.slice(0, 5))

  // 4. Filter slots within open hours
  const ALL_SLOTS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30'
  ]

  const s = schedule[0]
  const [oh, om] = (s.open || '09:00').slice(0, 5).split(':').map(Number)
  const [ch, cm] = (s.close || '20:00').slice(0, 5).split(':').map(Number)

  const slots = ALL_SLOTS
    .filter(t => {
      const [h, m] = t.split(':').map(Number)
      return (h * 60 + m) >= (oh * 60 + om) && (h * 60 + m) < (ch * 60 + cm)
    })
    .map(t => ({ time: t, available: !bookedTimes.includes(t) }))

  return { available: true, slots }
}

// ─────────────────────────────────────────────────────────────────
// BOOK APPOINTMENT
// Creates appointment after double-checking slot is free
// ─────────────────────────────────────────────────────────────────
export async function bookAppointment({ name, phone, date, time, treatment, notes = '' }) {
  const sql = getDB()

  // Re-check conflict (race condition guard)
  const conflict = await sql`
    SELECT id FROM appointments
    WHERE date = ${date} AND time = ${time} AND status != 'cancelled'
    LIMIT 1
  `
  if (conflict.length > 0) {
    return { success: false, reason: 'slot_taken' }
  }

  // Re-check holiday
  const holiday = await sql`
    SELECT reason FROM holidays WHERE date = ${date} LIMIT 1
  `
  if (holiday.length > 0) {
    return { success: false, reason: 'holiday', detail: holiday[0].reason }
  }

  // Create appointment
  const [apt] = await sql`
    INSERT INTO appointments (date, time, name, treatment, phone, notes, status)
    VALUES (${date}, ${time}, ${name}, ${treatment}, ${phone}, ${notes}, 'confirmed')
    RETURNING *
  `
  return { success: true, appointment: apt }
}

// ─────────────────────────────────────────────────────────────────
// GET APPOINTMENTS BY PHONE
// Used to let patients check their own bookings
// ─────────────────────────────────────────────────────────────────
export async function getAppointmentsByPhone(phone) {
  const sql = getDB()
  return await sql`
    SELECT * FROM appointments
    WHERE phone = ${phone}
      AND date >= CURRENT_DATE
      AND status != 'cancelled'
    ORDER BY date ASC, time ASC
    LIMIT 5
  `
}

// ─────────────────────────────────────────────────────────────────
// CANCEL APPOINTMENT
// Only cancels if the phone number matches (security)
// ─────────────────────────────────────────────────────────────────
export async function cancelAppointment(id, phone) {
  const sql = getDB()
  const [apt] = await sql`
    UPDATE appointments
    SET status = 'cancelled'
    WHERE id = ${id} AND phone = ${phone}
    RETURNING *
  `
  return apt || null
}

// ─────────────────────────────────────────────────────────────────
// SESSION STORE
// In-memory store for conversation history per user
// In production, replace with Redis for persistence
// ─────────────────────────────────────────────────────────────────
const _sessions = new Map()

export const sessionStore = {
  get(key) {
    return _sessions.get(key) || {}
  },
  set(key, data) {
    const existing = _sessions.get(key) || {}
    _sessions.set(key, { ...existing, ...data })
  },
  clear(key) {
    _sessions.delete(key)
  }
}
