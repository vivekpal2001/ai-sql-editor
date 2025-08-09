'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { TableIcon, ChevronRight, Trash2 } from 'lucide-react'
import { ResultsTable } from './results-table'

export type DBType = 'postgres' | 'mysql'
export type TableInfo = { schema?: string | null; name: string }
export type ColumnInfo = { name: string; dataType: string; isNullable: boolean }

export function SchemaSidebar({ db }: { db: DBType }) {
  const [tables, setTables] = useState<TableInfo[]>([])
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null)
  const [columns, setColumns] = useState<ColumnInfo[]>([])
  const [sample, setSample] = useState<any[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  const selectedLabel = useMemo(() => {
    if (!selectedTable) return ''
    return selectedTable.schema ? `${selectedTable.schema}.${selectedTable.name}` : selectedTable.name
  }, [selectedTable])

  const loadSchema = async () => {
    const res = await fetch(`/api/schema?db=${db}`)
    if (!res.ok) return
    const data = await res.json()
    setTables(data.tables)
  }

  const loadTableDetails = async (t: TableInfo) => {
    // Add validation to prevent API calls with undefined table names
    if (!t || !t.name || t.name.trim() === '') {
      console.error('loadTableDetails called with invalid table:', t)
      return
    }
    
    const params = new URLSearchParams()
    params.set('db', db)
    params.set('table', t.name)
    if (t.schema) params.set('schema', t.schema)
    
    console.log('Loading table details for:', t.name, 'with params:', params.toString())
    
    const res = await fetch(`/api/schema?${params.toString()}`)
    if (!res.ok) {
      console.error('Failed to load table details:', res.status, res.statusText)
      return
    }
    const data = await res.json()
    setColumns(data.columns)
    setSample(data.sample)
  }

  const deleteTable = async (tableName: string) => {
    setIsDeleting(true)
    try {
      const res = await fetch('/api/delete-table', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          db,
          tableName,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to delete table')
      }

      // Refresh the tables list
      await loadSchema()
      
      // Clear selected table if it was deleted
      if (selectedTable?.name === tableName) {
        setSelectedTable(null)
        setColumns([])
        setSample([])
      }
    } catch (error) {
      console.error('Error deleting table:', error)
      alert(`Failed to delete table: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    setSelectedTable(null)
    setColumns([])
    setSample([])
    loadSchema()
  }, [db])

  return (
    <Card className="backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Schema</CardTitle>
        <CardDescription>Browse tables and sample rows.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Tables</span>
          <Badge variant="secondary">{tables.length}</Badge>
        </div>
        <ScrollArea className="h-[320px]">
          <div className="space-y-1">
            {tables.length === 0 && (
              <div className="text-sm text-muted-foreground">No tables found.</div>
            )}
            {tables.map((t) => {
              const key = `${t.schema ?? 'default'}.${t.name}`
              const active = selectedTable && (selectedTable.schema ?? 'default') + '.' + selectedTable.name === key
              return (
                <div key={key} className="flex items-center gap-1 group">
                  <button
                    onClick={() => {
                      setSelectedTable(t)
                      loadTableDetails(t)
                    }}
                    className={cn(
                      'flex-1 text-left text-sm px-3 py-2 rounded-md hover:bg-muted/70 flex items-center justify-between',
                      active && 'bg-muted'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <TableIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">
                        {t.schema ? <span className="text-muted-foreground">{t.schema}.</span> : null}
                        <span>{t.name}</span>
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Table</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the table "{t.name}"? This action cannot be undone and will permanently remove all data in this table.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteTable(t.name)}
                          className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border-0 font-medium"
                          style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
                        >
                          Delete Table
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )
            })}
          </div>
        </ScrollArea>
        <Separator />
        {selectedTable && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium">Selected</div>
              <Badge variant="outline" className="font-mono">{selectedLabel}</Badge>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Columns</div>
              <div className="flex flex-wrap gap-2">
                {columns.map((c) => (
                  <Badge key={c.name} variant="secondary" className="text-xs">
                    {c.name}:{' '}<span className="ml-1 text-muted-foreground">{c.dataType}</span>
                  </Badge>
                ))}
                {columns.length === 0 && (
                  <div className="text-xs text-muted-foreground">No columns</div>
                )}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-2">Sample rows</div>
              <ResultsTable columns={columns.map((c) => c.name)} rows={sample} dense />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
