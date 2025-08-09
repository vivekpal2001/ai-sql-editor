import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSchemaOverview, getTableColumns, getTableSample } from '@/lib/db'

const querySchema = z.object({
  db: z.enum(['postgres', 'mysql']),
  table: z.string().optional(),
  schema: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const parsed = querySchema.parse({
      db: (url.searchParams.get('db') ?? 'postgres') as 'postgres' | 'mysql',
      table: url.searchParams.get('table') ?? undefined,
      schema: url.searchParams.get('schema') ?? undefined,
    })

    if (!parsed.table) {
      const tables = await getSchemaOverview(parsed.db)
      return NextResponse.json({ tables })
    }

    const [columns, sample] = await Promise.all([
      getTableColumns(parsed.db, parsed.table, parsed.schema ?? null),
      getTableSample(parsed.db, parsed.table, parsed.schema ?? null, 5),
    ])

    return NextResponse.json({ columns, sample })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e?.message ?? 'Schema fetch failed' }, { status: 400 })
  }
}
