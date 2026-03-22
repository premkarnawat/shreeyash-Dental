# 🗄️ Database Guide — Neon PostgreSQL

## Setup

1. Go to **https://console.neon.tech**
2. Sign up free (no credit card)
3. Create project: `shreeyash-dental`
4. Copy connection string from **Connection Details**

---

## Initialize Tables

After deploying frontend to Vercel, visit once:
```
https://YOUR-APP.vercel.app/api/init?key=init-shreeyash-2025
```

This creates all tables and seeds default data automatically.

---

## Schema

```sql
-- Appointments
CREATE TABLE appointments (
  id          SERIAL PRIMARY KEY,
  date        DATE NOT NULL,
  time        TIME NOT NULL,
  name        TEXT NOT NULL,
  treatment   TEXT NOT NULL,
  phone       TEXT NOT NULL,
  email       TEXT,
  notes       TEXT,
  status      TEXT NOT NULL DEFAULT 'pending',  -- confirmed | pending | cancelled
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Services / Treatments
CREATE TABLE services (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  price       TEXT NOT NULL,
  icon        TEXT DEFAULT '🦷',
  category    TEXT DEFAULT 'general',
  featured    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Pricing Tiers
CREATE TABLE pricing (
  id       SERIAL PRIMARY KEY,
  name     TEXT NOT NULL,
  subtitle TEXT,
  price    TEXT NOT NULL,
  period   TEXT DEFAULT 'per visit',
  items    JSONB DEFAULT '[]',
  featured BOOLEAN DEFAULT FALSE
);

-- News & Updates
CREATE TABLE news (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  content    TEXT,
  category   TEXT DEFAULT 'Announcement',
  emoji      TEXT DEFAULT '📰',
  date       DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery
CREATE TABLE gallery (
  id         SERIAL PRIMARY KEY,
  label      TEXT NOT NULL,
  category   TEXT DEFAULT 'General',
  emoji      TEXT DEFAULT '📸',
  url        TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Holidays / Closed Days
CREATE TABLE holidays (
  id     SERIAL PRIMARY KEY,
  date   DATE NOT NULL UNIQUE,
  reason TEXT DEFAULT 'Holiday'
);

-- Weekly Schedule
CREATE TABLE schedule (
  day    TEXT PRIMARY KEY,  -- monday, tuesday, etc.
  open   TIME,
  close  TIME,
  closed BOOLEAN DEFAULT FALSE
);
```

---

## API Routes (Vercel Serverless)

```
GET    /api/appointments              List all (filter: ?status= &date=)
POST   /api/appointments              Create (checks conflict + holiday)
PUT    /api/appointments/:id          Update status/date/time
DELETE /api/appointments/:id          Delete

GET    /api/slots?date=YYYY-MM-DD     Live slot availability

GET    /api/services                  List all services
POST   /api/services                  Add service
PUT    /api/services/:id              Update
DELETE /api/services/:id              Delete

GET    /api/pricing                   List pricing tiers
PUT    /api/pricing/:id               Update price

GET    /api/news                      List all news
POST   /api/news                      Publish news
DELETE /api/news/:id                  Delete

GET    /api/gallery                   List gallery items
POST   /api/gallery                   Add item
DELETE /api/gallery/:id               Delete

GET    /api/holidays                  List holidays
POST   /api/holidays                  Add holiday
DELETE /api/holidays/:id              Remove

GET    /api/schedule                  Get weekly schedule
PUT    /api/schedule                  Update schedule

POST   /api/contact                   Contact form submission
POST   /api/auth/login                Admin login
GET    /api/init?key=SECRET           Initialize DB (run once)
GET    /api/reports?type=daily        Analytics report
```

---

## Free Tier Limits (Neon)

| Resource | Free Limit |
|----------|-----------|
| Storage | 0.5 GB |
| Compute | 191.9 compute-hours/month |
| Projects | 1 |
| Branches | 10 |

More than sufficient for a dental clinic with thousands of appointments.
