import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { runQuery } from '@/lib/db'

const deleteTableSchema = z.object({
  db: z.enum(['postgres', 'mysql']),
  tableName: z.string(),
})

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { db, tableName } = deleteTableSchema.parse(body)

    console.log(`Deleting table ${tableName} from ${db} database`)

    // Sanitize table name to prevent SQL injection
    const sanitizedTableName = tableName.replace(/[^a-zA-Z0-9_]/g, '')
    
    if (sanitizedTableName !== tableName) {
      return NextResponse.json(
        { error: 'Invalid table name. Only alphanumeric characters and underscores are allowed.' },
        { status: 400 }
      )
    }

    let sql: string
    if (db === 'postgres') {
      sql = `DROP TABLE IF EXISTS "${sanitizedTableName}" CASCADE`
    } else {
      sql = `DROP TABLE IF EXISTS \`${sanitizedTableName}\``
    }

    console.log(`Executing SQL: ${sql}`)
    await runQuery(db, sql)

    console.log(`Successfully deleted table: ${tableName}`)
    return NextResponse.json({ 
      success: true, 
      message: `Table ${tableName} deleted successfully` 
    })

  } catch (error: any) {
    console.error('Error deleting table:', error)
    return NextResponse.json(
      { error: error?.message ?? 'Failed to delete table' },
      { status: 500 }
    )
  }
}
