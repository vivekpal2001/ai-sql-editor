'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Database, Play, TableIcon, Wand2, Plus, RefreshCw, TerminalSquare, Layers, ClipboardList, Eye, Rows2, Rows3, Trash2, ChevronRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Hero } from '@/components/hero'

type DBType = 'postgres' | 'mysql'

type TableInfo = {
  schema?: string | null
  name: string
}

type ColumnInfo = {
  name: string
  dataType: string
  isNullable: boolean
}

type SchemaOverview = {
  tables: TableInfo[]
}

type QueryResult = {
  columns: string[]
  rows: any[]
}

type GeneratedPreview = {
  createTableSQL: string
  columns: { name: string; type: string; nullable: boolean }[]
  rows: Record<string, any>[]
}

export default function HomePage() {
  const { toast } = useToast()
  const [dbType, setDbType] = useState<DBType>('postgres')
  const [schema, setSchema] = useState<SchemaOverview>({ tables: [] })
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null)
  const [selectedTableColumns, setSelectedTableColumns] = useState<ColumnInfo[]>([])
  const [selectedTableSample, setSelectedTableSample] = useState<any[]>([])

  const [sql, setSql] = useState<string>('SELECT NOW();')
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<QueryResult | null>(null)

  const [tableName, setTableName] = useState('')
  const [columnsInput, setColumnsInput] = useState<string>('name, email, joined_at, is_active')
  const [rowCount, setRowCount] = useState<number>(25)
  const [prompt, setPrompt] = useState<string>('Generate realistic user data for a SaaS app.')
  const [genLoading, setGenLoading] = useState(false)
  const [preview, setPreview] = useState<GeneratedPreview | null>(null)
  const [creating, setCreating] = useState(false)

  const selectedTableLabel = useMemo(() => {
    if (!selectedTable) return ''
    return selectedTable.schema ? `${selectedTable.schema}.${selectedTable.name}` : selectedTable.name
  }, [selectedTable])

  const loadSchema = async () => {
    try {
      const res = await fetch(`/api/schema?db=${dbType}`)
      if (!res.ok) throw new Error(await res.text())
      const data = (await res.json()) as SchemaOverview
      setSchema(data)
    } catch (e: any) {
      console.error(e)
      toast({
        title: 'Failed to load schema',
        description: e?.message ?? 'Check server logs.',
        variant: 'destructive',
      })
    }
  }

  const loadTableDetails = async (t: TableInfo) => {
    try {
      const params = new URLSearchParams()
      params.set('db', dbType)
      params.set('table', t.name)
      if (t.schema) params.set('schema', t.schema)
      const res = await fetch(`/api/schema?${params.toString()}`)
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setSelectedTableColumns(data.columns as ColumnInfo[])
      setSelectedTableSample(data.sample as any[])
    } catch (e: any) {
      console.error(e)
      toast({
        title: 'Failed to load table details',
        description: e?.message ?? 'Check server logs.',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    loadSchema()
  }, [dbType])

  const runQuery = async () => {
    setRunning(true)
    setResult(null)
    try {
      const res = await fetch('/api/run-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ db: dbType, sql }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Query failed')
      setResult(data as QueryResult)
    } catch (e: any) {
      toast({
        title: 'Query error',
        description: e?.message ?? 'Failed to run query',
        variant: 'destructive',
      })
    } finally {
      setRunning(false)
    }
  }

  const generatePreview = async () => {
    if (!tableName.trim()) {
      toast({ title: 'Missing table name', description: 'Enter a table name to continue.', variant: 'destructive' })
      return
    }
    const cols = columnsInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)
    if (cols.length === 0) {
      toast({ title: 'Missing columns', description: 'Add at least one column name.', variant: 'destructive' })
      return
    }
    setGenLoading(true)
    setPreview(null)
    try {
      const res = await fetch('/api/generate-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          db: dbType,
          tableName,
          columns: cols,
          rowCount,
          prompt,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Generation failed')
      setPreview(data as GeneratedPreview)
      toast({ title: 'Preview generated', description: 'Review DDL and sample rows before creating.' })
    } catch (e: any) {
      toast({ title: 'Generation error', description: e?.message ?? 'Failed to generate preview', variant: 'destructive' })
    } finally {
      setGenLoading(false)
    }
  }

  const createTableAndInsert = async () => {
    if (!preview) return
    setCreating(true)
    try {
      const res = await fetch('/api/create-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          db: dbType,
          tableName,
          createTableSQL: preview.createTableSQL,
          rows: preview.rows,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Creation failed')
      toast({ title: 'Table created', description: `Inserted ${data.inserted} rows into ${tableName}` })
      // Refresh schema and focus the new table
      await loadSchema()
      const t: TableInfo = dbType === 'postgres'
        ? { schema: 'public', name: tableName }
        : { name: tableName }
      setSelectedTable(t)
      await loadTableDetails(t)
    } catch (e: any) {
      toast({ title: 'Create error', description: e?.message ?? 'Failed to create table', variant: 'destructive' })
    } finally {
      setCreating(false)
    }
  }

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
        <SiteHeader />
        <Hero />
        <SiteFooter />
      </main>
    </TooltipProvider>
  )
}
