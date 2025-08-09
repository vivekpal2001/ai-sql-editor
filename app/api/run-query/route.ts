import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { runQueryCapped } from '@/lib/db'

const bodySchema = z.object({
  db: z.enum(['postgres', 'mysql']),
  sql: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const { db, sql } = bodySchema.parse(await req.json())
    const { columns, rows } = await runQueryCapped(db, sql, 200)
    return NextResponse.json({ columns, rows })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e?.message ?? 'Query failed' }, { status: 400 })
  }
}
