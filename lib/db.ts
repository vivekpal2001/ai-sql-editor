import { Pool as PgPool } from 'pg'
import mysql from 'mysql2/promise'

export type DBType = 'postgres' | 'mysql'

let pgPool: PgPool | null = null
let mysqlPool: mysql.Pool | null = null

function getPgPool() {
  if (!pgPool) {
    const url = process.env.POSTGRES_URL || process.env.DATABASE_URL
    if (!url) throw new Error('POSTGRES_URL is not set')
    pgPool = new PgPool({ connectionString: url })
  }
  return pgPool
}

function getMySQLPool() {
  if (!mysqlPool) {
    const url = process.env.MYSQL_URL
    if (!url) throw new Error('MYSQL_URL is not set')
    const u = new URL(url)
    mysqlPool = mysql.createPool({
      host: u.hostname,
      port: parseInt(u.port || '3306'),
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.replace(/^\//, ''),
      connectionLimit: Number(u.searchParams.get('connectionLimit') ?? '10'),
      dateStrings: true,
    })
  }
  return mysqlPool
}

export async function runQuery(db: DBType, sql: string) {
  if (db === 'postgres') {
    const pool = getPgPool()
    const res = await pool.query(sql)
    const columns = res.fields.map((f) => f.name)
    return { columns, rows: res.rows as any[] }
  } else {
    const pool = getMySQLPool()
    const [rows, fields] = await pool.query(sql)
    const columns = Array.isArray(fields) ? fields.map((f: any) => f.name) : []
    return { columns, rows: rows as any[] }
  }
}

function limitSelect(sql: string, cap: number) {
  const trimmed = sql.trim()
  const lowered = trimmed.toLowerCase()
  
  // Only apply LIMIT to SELECT statements
  if (!lowered.startsWith('select')) return sql
  
  // Don't add LIMIT if already present
  if (/\blimit\s+\d+/i.test(lowered)) return sql
  
  // Remove trailing semicolon before adding LIMIT
  const withoutSemicolon = trimmed.replace(/;+$/, '')
  
  // Check if this is a simple SELECT or has complex structure
  if (lowered.includes(' union ') || lowered.includes(' except ') || lowered.includes(' intersect ')) {
    // For complex queries, wrap in subquery
    return `SELECT * FROM (${withoutSemicolon}) AS limited_result LIMIT ${cap}`
  }
  
  return `${withoutSemicolon} LIMIT ${cap}`
}

export async function runQueryCapped(db: DBType, sql: string, cap: number) {
  const bounded = limitSelect(sql, cap)
  return runQuery(db, bounded)
}

export async function createTableAndInsert(
  db: DBType,
  tableName: string,
  createTableSQL: string,
  rows: Record<string, any>[]
) {
  if (db === 'postgres') {
    const pool = getPgPool()
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      await client.query(createTableSQL)
      if (rows.length > 0) {
        const cols = Object.keys(rows[0])
        const colList = cols.map((c) => `"${c}"`).join(', ')
        for (let i = 0; i < rows.length; i += 500) {
          const chunk = rows.slice(i, i + 500)
          const values: any[] = []
          const placeholders = chunk
            .map((r, idx) => {
              cols.forEach((c) => values.push((r as any)[c]))
              const base = idx * cols.length
              const ph = cols.map((_, j) => `$${base + j + 1}`).join(', ')
              return `(${ph})`
            })
            .join(', ')
          const insert = `INSERT INTO "${tableName}" (${colList}) VALUES ${placeholders}`
          await client.query(insert, values)
        }
      }
      await client.query('COMMIT')
      return rows.length
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  } else {
    const pool = getMySQLPool()
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      await conn.query(createTableSQL)
      if (rows.length > 0) {
        const cols = Object.keys(rows[0])
        const colList = cols.map((c) => `\`${c}\``).join(', ')
        const placeholders = `(${cols.map(() => '?').join(', ')})`
        const insert = `INSERT INTO \`${tableName}\` (${colList}) VALUES ${new Array(rows.length).fill(placeholders).join(', ')}`
        const values: any[] = []
        for (const r of rows) for (const c of cols) values.push((r as any)[c])
        await conn.query(insert, values)
      }
      await conn.commit()
      return rows.length
    } catch (e) {
      await conn.rollback()
      throw e
    } finally {
      conn.release()
    }
  }
}

export async function getSchemaOverview(db: DBType) {
  if (db === 'postgres') {
    const pool = getPgPool()
    const q = `
      select table_schema, table_name
      from information_schema.tables
      where table_type='BASE TABLE'
        and table_schema not in ('pg_catalog','information_schema')
      order by table_schema, table_name;
    `
    const res = await pool.query(q)
    return res.rows.map((r: any) => ({ schema: r.table_schema as string, name: r.table_name as string }))
  } else {
    const pool = getMySQLPool()
    const q = `
      select table_schema, table_name
      from information_schema.tables
      where table_type='BASE TABLE' and table_schema = database()
      order by table_name;
    `
    const [rows] = await pool.query(q)
    return (rows as any[]).map((r) => ({ 
      schema: (r.TABLE_SCHEMA || r.table_schema) as string, 
      name: (r.TABLE_NAME || r.table_name) as string 
    }))
  }
}

export async function getTableColumns(db: DBType, table: string, schema: string | null) {
  if (db === 'postgres') {
    const pool = getPgPool()
    const s = schema ?? 'public'
    const q = `
      select column_name, data_type, is_nullable
      from information_schema.columns
      where table_schema = $1 and table_name = $2
      order by ordinal_position;
    `
    const res = await pool.query(q, [s, table])
    return res.rows.map((r: any) => ({
      name: r.column_name as string,
      dataType: r.data_type as string,
      isNullable: r.is_nullable === 'YES',
    }))
  } else {
    const pool = getMySQLPool()
    const q = `
      select column_name, data_type, is_nullable
      from information_schema.columns
      where table_schema = database() and table_name = ?
      order by ordinal_position;
    `
    const [rows] = await pool.query(q, [table])
    return (rows as any[]).map((r) => ({
      name: (r.COLUMN_NAME || r.column_name) as string,
      dataType: (r.DATA_TYPE || r.data_type) as string,
      isNullable: String(r.IS_NULLABLE || r.is_nullable).toUpperCase() === 'YES',
    }))
  }
}

export async function getTableSample(db: DBType, table: string, schema: string | null, limit = 5) {
  if (db === 'postgres') {
    const pool = getPgPool()
    const s = schema ?? 'public'
    const q = `select * from "${s}"."${table}" limit ${limit};`
    const res = await pool.query(q)
    return res.rows as any[]
  } else {
    const pool = getMySQLPool()
    const q = `select * from \`${table}\` limit ${limit};`
    const [rows] = await pool.query(q)
    return rows as any[]
  }
}
