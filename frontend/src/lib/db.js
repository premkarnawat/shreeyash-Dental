// src/lib/db.js
// Neon Database connection - used server-side in API routes
// For client, we call our own /api/* endpoints

export const DB_CONFIG = {
  connectionString: import.meta.env.VITE_DATABASE_URL || '',
}

// ─── CLIENT-SIDE API HELPERS ─────────────────────────────────────
const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

// Appointments
export const api = {
  // Appointments
  getAppointments: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return request(`/appointments${q ? '?' + q : ''}`)
  },
  createAppointment: (data) => request('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  updateAppointment: (id, data) => request(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAppointment: (id) => request(`/appointments/${id}`, { method: 'DELETE' }),
  getSlots: (date) => request(`/slots?date=${date}`),

  // Services
  getServices: () => request('/services'),
  createService: (data) => request('/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id, data) => request(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (id) => request(`/services/${id}`, { method: 'DELETE' }),

  // Pricing
  getPricing: () => request('/pricing'),
  updatePricing: (id, data) => request(`/pricing/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // News
  getNews: () => request('/news'),
  createNews: (data) => request('/news', { method: 'POST', body: JSON.stringify(data) }),
  deleteNews: (id) => request(`/news/${id}`, { method: 'DELETE' }),

  // Gallery
  getGallery: () => request('/gallery'),
  addGallery: (data) => request('/gallery', { method: 'POST', body: JSON.stringify(data) }),
  deleteGallery: (id) => request(`/gallery/${id}`, { method: 'DELETE' }),

  // Holidays
  getHolidays: () => request('/holidays'),
  addHoliday: (data) => request('/holidays', { method: 'POST', body: JSON.stringify(data) }),
  deleteHoliday: (id) => request(`/holidays/${id}`, { method: 'DELETE' }),

  // Schedule
  getSchedule: () => request('/schedule'),
  updateSchedule: (data) => request('/schedule', { method: 'PUT', body: JSON.stringify(data) }),

  // Reports
  getReport: (type) => request(`/reports?type=${type}`),

  // Contact
  sendContact: (data) => request('/contact', { method: 'POST', body: JSON.stringify(data) }),

  // Admin Auth
  adminLogin: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
}
