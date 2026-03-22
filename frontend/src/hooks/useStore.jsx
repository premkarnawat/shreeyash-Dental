// src/hooks/useStore.jsx
import React, { useState, useEffect, createContext, useContext } from 'react'
import {
  SERVICES, PRICING, NEWS, GALLERY, HOLIDAYS,
  SCHEDULE, SAMPLE_APPOINTMENTS, CLINIC_INFO, TIME_SLOTS
} from '../lib/mockData'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [appointments, setAppointments] = useState(
    JSON.parse(localStorage.getItem('sy_appointments') || 'null') || SAMPLE_APPOINTMENTS
  )
  const [services, setServices] = useState(
    JSON.parse(localStorage.getItem('sy_services') || 'null') || SERVICES
  )
  const [pricing, setPricing] = useState(PRICING)
  const [news, setNews] = useState(
    JSON.parse(localStorage.getItem('sy_news') || 'null') || NEWS
  )
  const [gallery, setGallery] = useState(
    JSON.parse(localStorage.getItem('sy_gallery') || 'null') || GALLERY
  )
  const [holidays, setHolidays] = useState(
    JSON.parse(localStorage.getItem('sy_holidays') || 'null') || HOLIDAYS
  )
  const [schedule, setSchedule] = useState(
    JSON.parse(localStorage.getItem('sy_schedule') || 'null') || SCHEDULE
  )
  const [isAdmin, setIsAdmin] = useState(
    sessionStorage.getItem('sy_admin') === 'true'
  )
  const nextIdRef = React.useRef(100)
  const nextId = () => nextIdRef.current++

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('sy_appointments', JSON.stringify(appointments)) }, [appointments])
  useEffect(() => { localStorage.setItem('sy_services', JSON.stringify(services)) }, [services])
  useEffect(() => { localStorage.setItem('sy_news', JSON.stringify(news)) }, [news])
  useEffect(() => { localStorage.setItem('sy_gallery', JSON.stringify(gallery)) }, [gallery])
  useEffect(() => { localStorage.setItem('sy_holidays', JSON.stringify(holidays)) }, [holidays])
  useEffect(() => { localStorage.setItem('sy_schedule', JSON.stringify(schedule)) }, [schedule])

  // Appointment actions
  const addAppointment = (apt) => {
    const newApt = { ...apt, id: nextId(), status: 'confirmed', createdAt: new Date().toISOString() }
    setAppointments(prev => [...prev, newApt])
    return newApt
  }
  const updateAppointment = (id, updates) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
  }
  const deleteAppointment = (id) => {
    setAppointments(prev => prev.filter(a => a.id !== id))
  }
  const getSlots = (date) => {
    if (!date) return []
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    const daySchedule = schedule[dayName]
    if (!daySchedule || daySchedule.closed) return []
    const holidayDates = holidays.map(h => h.date)
    if (holidayDates.includes(date)) return []
    const taken = appointments
      .filter(a => a.date === date && a.status !== 'cancelled')
      .map(a => a.time)
    const [oh, om] = (daySchedule.open || '09:00').split(':').map(Number)
    const [ch, cm] = (daySchedule.close || '20:00').split(':').map(Number)
    return TIME_SLOTS
      .filter(t => {
        const [h, m] = t.split(':').map(Number)
        return (h * 60 + m) >= (oh * 60 + om) && (h * 60 + m) < (ch * 60 + cm)
      })
      .map(t => ({ time: t, available: !taken.includes(t) }))
  }

  // Services
  const addService = (svc) => {
    setServices(prev => [...prev, { ...svc, id: nextId(), category: 'general', featured: false }])
  }
  const removeService = (id) => setServices(prev => prev.filter(s => s.id !== id))

  // News
  const addNews = (item) => {
    setNews(prev => [{ ...item, id: nextId(), date: new Date().toISOString().split('T')[0] }, ...prev])
  }
  const removeNews = (id) => setNews(prev => prev.filter(n => n.id !== id))

  // Gallery
  const addGallery = (item) => setGallery(prev => [...prev, { ...item, id: nextId() }])
  const removeGallery = (id) => setGallery(prev => prev.filter(g => g.id !== id))

  // Holidays
  const addHoliday = (h) => {
    if (holidays.find(x => x.date === h.date)) return false
    setHolidays(prev => [...prev, { ...h, id: nextId() }])
    return true
  }
  const removeHoliday = (id) => setHolidays(prev => prev.filter(h => h.id !== id))

  // Schedule
  const updateSchedule = (newSchedule) => setSchedule(newSchedule)

  // Auth
  const adminLogin = (user, pass) => {
    if (user === 'admin' && pass === 'clinic123') {
      setIsAdmin(true)
      sessionStorage.setItem('sy_admin', 'true')
      return true
    }
    return false
  }
  const adminLogout = () => {
    setIsAdmin(false)
    sessionStorage.removeItem('sy_admin')
  }

  const isHoliday = (date) => holidays.some(h => h.date === date)
  const getHolidayReason = (date) => holidays.find(h => h.date === date)?.reason || ''

  return (
    <StoreContext.Provider value={{
      appointments, services, pricing, news, gallery, holidays, schedule,
      isAdmin, clinicInfo: CLINIC_INFO,
      addAppointment, updateAppointment, deleteAppointment, getSlots,
      addService, removeService,
      addNews, removeNews,
      addGallery, removeGallery,
      addHoliday, removeHoliday,
      updateSchedule, updatePricing: (id, data) => setPricing(prev => prev.map(p => p.id === id ? { ...p, ...data } : p)),
      adminLogin, adminLogout,
      isHoliday, getHolidayReason,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be inside StoreProvider')
  return ctx
}
