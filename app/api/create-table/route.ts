import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createTableAndInsert } from '@/lib/db'

const bodySchema = z.object({
  db: z.enum(['postgres', 'mysql']),
  tableName: z.string().min(1),
  createTableSQL: z.string().min(1),
  rows: z.array(z.record(z.any())).min(1),
})

export async function POST(req: NextRequest) {
  try {
    const { db, tableName, createTableSQL, rows } = bodySchema.parse(await req.json())
    
    // Filter out auto-increment ID fields from rows data to prevent insertion conflicts
    const filteredRows = rows.map(row => {
      const filteredRow = { ...row }
      // Remove common auto-increment ID field names
      delete filteredRow.id
      delete filteredRow.ID
      delete filteredRow._id
      return filteredRow
    }).filter(row => Object.keys(row).length > 0) // Only include rows that have data after filtering
    
    const inserted = await createTableAndInsert(db, tableName, createTableSQL, filteredRows)
    return NextResponse.json({ ok: true, inserted })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e?.message ?? 'Create failed' }, { status: 400 })
  }
}
