# 📱 Twilio Setup Guide — WhatsApp + Voice

## Step 1 — Create Free Twilio Account
1. Go to: **https://www.twilio.com/try-twilio**
2. Sign up — you get **$15.50 FREE credit** (no credit card needed)
3. Verify your email and phone number

## Step 2 — Get Your Credentials
1. Go to: **https://console.twilio.com**
2. From the Dashboard, copy:
   - **Account SID** (starts with AC...)
   - **Auth Token** (click to reveal)

---

## 📱 WhatsApp Setup (FREE Sandbox)

### Join the Sandbox
1. Console → **Messaging** → **Try it out** → **Send a WhatsApp message**
2. You'll see instructions to join the sandbox:
   - Save this number on your phone: **+1 415 523 8886**
   - Open WhatsApp and send the join code (e.g., `join silver-tiger`)
3. You'll receive: *"You have joined the sandbox"*

### Configure Webhook
1. Console → Messaging → Settings → **WhatsApp Sandbox Settings**
2. Set:
   ```
   When a message comes in:
   URL:    https://shreeyash-dental-agents.onrender.com/whatsapp/webhook
   Method: POST
   ```
3. Save

### Test It
Send any message to **+1 415 523 8886** on WhatsApp.
The AI agent should reply within 2-3 seconds.

### WhatsApp Sandbox Limitation
- Only numbers that have joined the sandbox can message you
- For production (public use), you need WhatsApp Business Account
- See "Going to Production" section below

---

## 📞 Voice Setup (Uses $1 from free credit)

### Buy a Phone Number
1. Console → **Phone Numbers** → **Manage** → **Buy a number**
2. Search for available numbers
3. Select any number → Click **Buy** (~$1/month deducted from free credit)
4. Save the number as `TWILIO_VOICE_NUMBER` in your env

### Configure Voice Webhook
1. Console → Phone Numbers → Manage → **Active Numbers**
2. Click your number
3. Scroll to **Voice & Fax** section
4. Under **"A Call Comes In":**
   ```
   URL:    https://shreeyash-dental-agents.onrender.com/voice/incoming
   Method: POST
   ```
5. Save

### Test It
Call your Twilio number. The AI agent should pick up and greet you.

---

## 🔊 Voice Agent Details

The voice agent uses:
- **Twilio Gather** — captures patient's speech (free on all plans)
- **Groq AI** — processes speech and generates responses (free)
- **Amazon Polly Raveena** — Indian English female voice (included with Twilio)
- **Language:** `en-IN` (Indian English)

Flow:
```
Patient calls → Twilio answers → Speech captured → Groq AI responds
→ Polly speaks back → Patient speaks again → Loop until booking done
```

---

## 📲 WhatsApp Quick Commands

Patients can use these commands:

| Command | Action |
|---------|--------|
| `Hi` or `Hello` | Start conversation |
| `BOOK` | Start booking flow |
| `MY APPOINTMENTS` | View upcoming bookings |
| `STATUS` | Same as MY APPOINTMENTS |
| `CANCEL 47` | Cancel appointment #47 |
| `TIMINGS` | Get clinic hours |
| `HELP` | See all commands |
| `STOP` | End conversation |

---

## 🚀 Going to Production (WhatsApp Business)

When you're ready for real patients to message any number:

1. **Apply for WhatsApp Business Account:**
   - Console → Messaging → Senders → WhatsApp Senders
   - Click "Add a Sender" → Follow verification steps
   - Requires: Facebook Business Manager account (free)
   - Approval takes 1-7 days

2. **Once approved:**
   - Change `TWILIO_WHATSAPP_FROM` to your business number
   - Any patient can message your WhatsApp without joining sandbox

---

## 💰 Twilio Cost Reference

| Service | Cost |
|---------|------|
| WhatsApp sandbox | FREE |
| Incoming voice call (US number) | ~$0.0085/min |
| Outgoing voice call | ~$0.013/min |
| Phone number rental | ~$1/month |
| WhatsApp message (Business) | $0.005-0.008 each |
| Polly TTS voice | Included |

**With $15.50 free credit you get:**
- ~1,800 minutes of voice calls, OR
- 15 months of phone number rental
- More than enough for testing
