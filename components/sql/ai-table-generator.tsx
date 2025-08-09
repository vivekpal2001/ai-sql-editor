'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Wand2, Plus } from 'lucide-react'
import { ResultsTable } from './results-table'
import type { DBType } from './schema-sidebar'
import { useToast } from '@/hooks/use-toast'

type GeneratedPreview = {
  createTableSQL: string
  columns: { name: string; type: string; nullable: boolean }[]
  rows: Record<string, any>[]
}

export function AITableGenerator({ db, onCreated }: { db: DBType; onCreated?: (tableName: string) => void }) {
  const { toast } = useToast()
  const [tableName, setTableName] = useState('')
  const [columnsInput, setColumnsInput] = useState('name, email, joined_at, is_active')
  const [rowCount, setRowCount] = useState(25)
  const [prompt, setPrompt] = useState('Generate realistic user data for a SaaS app.')
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [preview, setPreview] = useState<GeneratedPreview | null>(null)

  const generate = async () => {
    if (!tableName.trim()) {
      toast({ title: 'Enter a table name', variant: 'destructive' })
      return
    }
    const cols = columnsInput.split(',').map((c) => c.trim()).filter(Boolean)
    if (cols.length === 0) {
      toast({ title: 'Add at least one column', variant: 'destructive' })
      return
    }
    
    console.log('Generating table with params:', { db, tableName, columns: cols, rowCount, prompt })
    
    setLoading(true)
    setPreview(null)
    try {
      const res = await fetch('/api/generate-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ db, tableName, columns: cols, rowCount, prompt }),
      })
      const data = await res.json()
      if (!res.ok) {
        console.error('Generation failed:', res.status, data)
        throw new Error(data?.error ?? 'Generation failed')
      }
      setPreview(data as GeneratedPreview)
      toast({ title: 'Preview ready', description: 'Review DDL and sample rows before creating.' })
    } catch (e: any) {
      console.error('Generation error:', e)
      toast({ title: 'Generation error', description: e?.message ?? 'Failed to generate', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const create = async () => {
    if (!preview) {
      console.error('Create called but no preview available')
      return
    }
    if (!tableName.trim()) {
      console.error('Create called but no table name')
      toast({ title: 'Table name required', variant: 'destructive' })
      return
    }
    
    console.log('Creating table with params:', { db, tableName, createTableSQL: preview.createTableSQL, rowsCount: preview.rows.length })
    
    setCreating(true)
    try {
      const res = await fetch('/api/create-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ db, tableName, createTableSQL: preview.createTableSQL, rows: preview.rows }),
      })
      const data = await res.json()
      if (!res.ok) {
        console.error('Create failed:', res.status, data)
        throw new Error(data?.error ?? 'Create failed')
      }
      toast({ title: 'Table created', description: `Inserted ${data.inserted} rows.` })
      onCreated?.(tableName)
      setPreview(null)
      setTableName('')
    } catch (e: any) {
      console.error('Create error:', e)
      toast({ title: 'Create error', description: e?.message ?? 'Failed to create', variant: 'destructive' })
    } finally {
      setCreating(false)
    }
  }

  return (
    <Card className="backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Wand2 className="h-4 w-4" /> AI Table Generator
        </CardTitle>
        <CardDescription>Infer types and generate rows with the Gemini API.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Table name</label>
            <Input placeholder="users" value={tableName} onChange={(e) => setTableName(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Column names (comma-separated)</label>
            <Input value={columnsInput} onChange={(e) => setColumnsInput(e.target.value)} />
            <div className="flex flex-wrap gap-2 pt-1">
              {columnsInput.split(',').map((c, i) => {
                const col = c.trim()
                if (!col) return null
                return <Badge key={i} variant="outline">{col}</Badge>
              })}
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Rows</label>
            <Input type="number" min={1} max={1000} value={rowCount} onChange={(e) => setRowCount(parseInt(e.target.value || '1'))} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Data prompt</label>
            <Textarea rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the domain for realistic data..." />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={generate} disabled={loading} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600">
            <Wand2 className="h-4 w-4 mr-2" />
            {loading ? 'Generating...' : 'Generate preview'}
          </Button>
          {preview && (
            <Button onClick={create} variant="secondary" disabled={creating}>
              <Plus className="h-4 w-4 mr-2" />
              {creating ? 'Creating...' : 'Create table + insert'}
            </Button>
          )}
        </div>

        {preview && (
          <Tabs defaultValue="ddl" className="mt-2">
            <TabsList>
              <TabsTrigger value="ddl">DDL</TabsTrigger>
              <TabsTrigger value="rows">Rows</TabsTrigger>
            </TabsList>
            <TabsContent value="ddl" className="mt-2">
              <div className="rounded-md border bg-muted/30 p-3 font-mono text-xs overflow-auto">
                <pre className="whitespace-pre-wrap">{preview.createTableSQL}</pre>
              </div>
            </TabsContent>
            <TabsContent value="rows" className="mt-2">
              <ResultsTable
                columns={Object.keys(preview.rows[0] ?? {})}
                rows={preview.rows.slice(0, 10)}
              />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
