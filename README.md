# 🦷 Shree Yash Multispeciality Dental Clinic
## Complete Full-Stack Website + AI Agents

**Dr. Sagar Jadhav B.D.S. (Pune) · Nigdi, Pimpri-Chinchwad, Pune 411044**

---

## 📁 Project Structure

```
shreeyash-complete/
│
├── frontend/               ← React website (deploy on Vercel)
│   ├── src/
│   │   ├── components/     ← All UI components
│   │   ├── pages/          ← Home, AdminLogin, AdminDashboard
│   │   ├── hooks/          ← useStore (state management)
│   │   └── lib/            ← mockData, db helpers
│   ├── api/                ← Vercel serverless functions (Neon DB)
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── vercel.json
│   └── .env.example
│
├── agents/                 ← AI Agents server (deploy on Render)
│   ├── src/
│   │   ├── server.js       ← Express server entry point
│   │   ├── whatsappAgent.js← WhatsApp AI booking agent
│   │   ├── voiceAgent.js   ← AI voice calling agent
│   │   └── db.js           ← Neon DB helpers
│   ├── package.json
│   ├── vercel.json
│   └── .env.example
│
├── docs/
│   ├── DEPLOYMENT.md       ← Step-by-step deployment guide
│   ├── TWILIO_SETUP.md     ← Twilio WhatsApp + Voice setup
│   └── DATABASE.md         ← Neon DB schema + setup
│
└── README.md               ← This file
```

---

## 🚀 Quick Deploy Overview

```
Step 1 → Create Neon Database (free)     → neon.tech
Step 2 → Deploy Frontend on Vercel       → vercel.com
Step 3 → Deploy AI Agents on Render      → render.com
Step 4 → Configure Twilio webhooks       → console.twilio.com
Step 5 → Initialize database             → /api/init?key=YOUR_SECRET
```

**Full instructions in:** `docs/DEPLOYMENT.md`

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + Vite | UI framework |
| Tailwind CSS 3 | Styling |
| Framer Motion 11 | Animations |
| React Router v6 | Navigation |
| Lucide React | Icons |
| React Hot Toast | Notifications |
| Cormorant Garamond + DM Sans | Fonts |

### Backend
| Technology | Purpose |
|-----------|---------|
| Vercel Serverless Functions | API routes |
| Neon PostgreSQL | Database |
| @neondatabase/serverless | DB driver |

### AI Agents
| Technology | Purpose |
|-----------|---------|
| Groq AI (FREE) | LLM brain (llama-3.3-70b) |
| Twilio WhatsApp Sandbox | WhatsApp messaging (free) |
| Twilio Voice Trial | Phone calls ($15 free credit) |
| Express.js | Agent server |

---

## ✨ Features

### Patient Website
- Hero section with animated stats
- 12+ dental services with glassmorphism cards
- Transparent pricing tiers
- Live appointment booking (real-time slot availability)
- Holiday/closed day blocking
- About section with doctor profile
- Clinic photo gallery
- News & dental camp updates
- Contact form with clinic hours
- AI chatbot (keyword + Groq powered)
- WhatsApp floating button

### Admin Dashboard (`/admin/login`)
- Login: `admin` / `clinic123`
- Overview with live stats
- Appointments — view, confirm, cancel, reschedule
- Schedule — set daily open/close times
- Holidays — mark closed days (blocks booking)
- Services & Pricing — add/remove/edit
- Gallery & News — publish updates
- Reports — daily/weekly/monthly + CSV export

### AI Agents
- 📱 **WhatsApp Agent** — books appointments via chat, sends confirmations + reminders
- 📞 **Voice Agent** — answers calls, books appointments by voice, sends reminders

---

## 📞 Clinic Info
- **Doctor:** Dr. Sagar Jadhav, B.D.S. (Pune)
- **Phone 1:** +91 98500 44913
- **Phone 2:** +91 97674 06395
- **Address:** Plot No. L-C9B, Near Amrita Vidyalayam, Behind Ganesh Sweets, Yamuna Nagar, Nigdi, Pimpri-Chinchwad, Maharashtra 411044
- **Rating:** 4.9 ⭐ (41 Google Reviews)

---

## 💰 Cost Summary

| Service | Cost |
|---------|------|
| Vercel (frontend) | FREE |
| Render (agents server) | FREE |
| Neon PostgreSQL | FREE (0.5GB) |
| Groq AI | FREE (14,400 req/day) |
| Twilio WhatsApp Sandbox | FREE (testing) |
| Twilio Voice Trial | $15 free credit |
| **Total for testing** | **₹0** |
