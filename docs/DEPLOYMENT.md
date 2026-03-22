# 🚀 Deployment Guide — Step by Step

## Prerequisites
- GitHub account (free)
- Vercel account (free) — vercel.com
- Render account (free) — render.com
- Neon account (free) — neon.tech
- Twilio account (free $15 credit) — twilio.com
- Groq account (free) — console.groq.com

---

## PART 1 — Neon Database Setup

1. Go to **https://console.neon.tech**
2. Sign up free → Click **"New Project"**
3. Name: `shreeyash-dental` → Click Create
4. Go to **Connection Details** → copy the connection string:
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. Save this — you'll use it in both frontend and agents

---

## PART 2 — Deploy Frontend on Vercel

### 2a. Push frontend to GitHub
```bash
cd frontend
git init
git add .
git commit -m "Shree Yash Dental Website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shreeyash-frontend.git
git push -u origin main
```

### 2b. Import on Vercel
1. Go to **https://vercel.com** → Login with GitHub
2. Click **"Add New Project"**
3. Import `shreeyash-frontend` repo
4. Framework: **Vite** (auto-detected)
5. Click **Deploy**

### 2c. Add Environment Variables on Vercel
Go to: Project → Settings → Environment Variables

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon connection string |
| `ADMIN_USER` | `admin` |
| `ADMIN_PASS` | `clinic123` |
| `INIT_SECRET` | `init-shreeyash-2025` |

Click **Redeploy** after adding variables.

### 2d. Initialize Database (run once)
Visit this URL in your browser:
```
https://YOUR-APP.vercel.app/api/init?key=init-shreeyash-2025
```
You should see:
```json
{ "success": true, "message": "DB initialized!" }
```

✅ **Frontend is live!**

---

## PART 3 — Deploy AI Agents on Render

### 3a. Push agents to GitHub
```bash
cd agents
git init
git add .
git commit -m "Shree Yash AI Agents"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shreeyash-agents.git
git push -u origin main
```

### 3b. Create Web Service on Render
1. Go to **https://render.com** → New → **Web Service**
2. Connect your `shreeyash-agents` GitHub repo
3. Settings:
   - **Name:** shreeyash-dental-agents
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### 3c. Add Environment Variables on Render
| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Same Neon connection string |
| `GROQ_API_KEY` | From console.groq.com |
| `TWILIO_ACCOUNT_SID` | From Twilio console |
| `TWILIO_AUTH_TOKEN` | From Twilio console |
| `TWILIO_WHATSAPP_FROM` | `whatsapp:+14155238886` |
| `TWILIO_VOICE_NUMBER` | Your Twilio phone number |
| `BASE_URL` | `https://shreeyash-dental-agents.onrender.com` |
| `CRON_SECRET` | `cron-shreeyash-2025` |
| `CLINIC_NAME` | `Shree Yash Multispeciality Dental Clinic` |
| `DOCTOR_NAME` | `Dr. Sagar Jadhav` |
| `CLINIC_PHONE` | `+919850044913` |

4. Click **Create Web Service** → Deploy

✅ **Agents server is live!**

---

## PART 4 — Configure Twilio Webhooks

### WhatsApp
1. Twilio Console → **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Scroll to **Sandbox Settings**
3. Set **"When a message comes in":**
   ```
   URL:    https://shreeyash-dental-agents.onrender.com/whatsapp/webhook
   Method: POST
   ```
4. Save

### Voice
1. Twilio Console → **Phone Numbers** → **Manage** → **Active Numbers**
2. Click your number
3. Under **Voice Configuration → A Call Comes In:**
   ```
   URL:    https://shreeyash-dental-agents.onrender.com/voice/incoming
   Method: POST
   ```
4. Save

---

## PART 5 — Connect Frontend to Agents

In your Vercel environment variables, add:
```
AGENTS_URL = https://shreeyash-dental-agents.onrender.com
```

This allows the website to trigger WhatsApp confirmations after online bookings.

---

## PART 6 — Set Up Daily Reminders (Free Cron)

1. Go to **https://cron-job.org** (free)
2. Create account → New Cronjob
3. Settings:
   - URL: `https://shreeyash-dental-agents.onrender.com/jobs/reminders?secret=cron-shreeyash-2025`
   - Schedule: Daily at 18:00 (6 PM)
4. Save → Enable

Patients will automatically get WhatsApp reminders the day before their appointment.

---

## ✅ Final Checklist

- [ ] Neon DB created and connection string copied
- [ ] Frontend deployed on Vercel
- [ ] Frontend env variables added on Vercel
- [ ] Database initialized via /api/init
- [ ] Agents deployed on Render
- [ ] Agents env variables added on Render
- [ ] Groq API key added
- [ ] Twilio WhatsApp sandbox webhook set
- [ ] Twilio Voice webhook set
- [ ] Cron job set up for reminders
- [ ] Test WhatsApp by messaging sandbox
- [ ] Test Voice by calling Twilio number
- [ ] Test online booking form
- [ ] Login to admin panel at /admin/login

---

## 🔗 Your URLs After Deployment

| Service | URL |
|---------|-----|
| Website | `https://YOUR-APP.vercel.app` |
| Admin Panel | `https://YOUR-APP.vercel.app/admin/login` |
| Agents Server | `https://shreeyash-dental-agents.onrender.com` |
| Agents Health | `https://shreeyash-dental-agents.onrender.com/` |
| WhatsApp Webhook | `https://shreeyash-dental-agents.onrender.com/whatsapp/webhook` |
| Voice Webhook | `https://shreeyash-dental-agents.onrender.com/voice/incoming` |
