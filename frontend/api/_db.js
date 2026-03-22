// api/_db.js
// Shared Neon database helper for all Vercel serverless functions

import { neon } from '@neondatabase/serverless'

let sql

export function getDB() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set. Please add your Neon connection string.')
    }
    sql = neon(process.env.DATABASE_URL)
  }
  return sql
}

// ─── SCHEMA INIT ─────────────────────────────────────────────────
// Call this once to create tables. Run via: GET /api/init
export async function initSchema() {
  const sql = getDB()
  await sql`
    CREATE TABLE IF NOT EXISTS appointments (
      id          SERIAL PRIMARY KEY,
      date        DATE NOT NULL,
      time        TIME NOT NULL,
      name        TEXT NOT NULL,
      treatment   TEXT NOT NULL,
      phone       TEXT NOT NULL,
      email       TEXT,
      notes       TEXT,
      status      TEXT NOT NULL DEFAULT 'pending',
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS services (
      id          SERIAL PRIMARY KEY,
      name        TEXT NOT NULL,
      description TEXT,
      price       TEXT NOT NULL,
      icon        TEXT DEFAULT '🦷',
      category    TEXT DEFAULT 'general',
      featured    BOOLEAN DEFAULT FALSE,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS pricing (
      id       SERIAL PRIMARY KEY,
      name     TEXT NOT NULL,
      subtitle TEXT,
      price    TEXT NOT NULL,
      period   TEXT DEFAULT 'per visit',
      items    JSONB DEFAULT '[]',
      featured BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS news (
      id         SERIAL PRIMARY KEY,
      title      TEXT NOT NULL,
      content    TEXT,
      category   TEXT DEFAULT 'Announcement',
      emoji      TEXT DEFAULT '📰',
      date       DATE DEFAULT CURRENT_DATE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id       SERIAL PRIMARY KEY,
      label    TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      emoji    TEXT DEFAULT '📸',
      url      TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS holidays (
      id     SERIAL PRIMARY KEY,
      date   DATE NOT NULL UNIQUE,
      reason TEXT DEFAULT 'Holiday'
    );

    CREATE TABLE IF NOT EXISTS schedule (
      day    TEXT PRIMARY KEY,
      open   TIME,
      close  TIME,
      closed BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id       SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `
}

export function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
}
