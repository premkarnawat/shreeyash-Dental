// api/reports.js
import { getDB, cors } from './_db.js'

export default async function handler(req, res) {
  cors(res)
  if (req.method !== 'GET') return res.status(405).end()
  const sql = getDB()

  try {
    const [total]      = await sql`SELECT COUNT(*) AS count FROM appointments`
    const [confirmed]  = await sql`SELECT COUNT(*) AS count FROM appointments WHERE status='confirmed'`
    const [pending]    = await sql`SELECT COUNT(*) AS count FROM appointments WHERE status='pending'`
    const [cancelled]  = await sql`SELECT COUNT(*) AS count FROM appointments WHERE status='cancelled'`
    const today        = new Date().toISOString().split('T')[0]
    const [todayCount] = await sql`SELECT COUNT(*) AS count FROM appointments WHERE date=${today}`
    const top          = await sql`SELECT treatment, COUNT(*) AS cnt FROM appointments GROUP BY treatment ORDER BY cnt DESC LIMIT 6`
    const [svcCount]   = await sql`SELECT COUNT(*) AS count FROM services`

    return res.status(200).json({
      generatedAt: new Date().toISOString(),
      appointments: {
        total:     Number(total.count),
        confirmed: Number(confirmed.count),
        pending:   Number(pending.count),
        cancelled: Number(cancelled.count),
        today:     Number(todayCount.count),
      },
      topTreatments: top.map(t => ({ treatment: t.treatment, count: Number(t.cnt) })),
      services: Number(svcCount.count),
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
