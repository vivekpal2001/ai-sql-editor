'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Trash2, Rows2, Settings } from 'lucide-react'
import { ResultsTable } from './results-table'
import type { DBType } from './schema-sidebar'
import { useToast } from '@/hooks/use-toast'
import dynamic from 'next/dynamic'

// Dynamically import Monaco Editor to avoid SSR issues
const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-muted rounded-md flex items-center justify-center">
      <div className="text-sm text-muted-foreground">Loading editor...</div>
    </div>
  )
})

type QueryResult = { columns: string[]; rows: any[] }

// Store SQL content for each database separately
const sqlStorage: Record<DBType, string> = {
  postgres: 'SELECT NOW() as current_time, version() as database_version',
  mysql: 'SELECT NOW() as `current_time`, version() as `database_version`'
}

export function SQLEditor({ db }: { db: DBType }) {
  const { toast } = useToast()
  const [sql, setSql] = useState(sqlStorage[db])
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark')
  const previousDb = useRef<DBType>(db)

  // Save SQL content when it changes and restore when db changes
  useEffect(() => {
    // Save current SQL to storage before switching
    if (previousDb.current !== db) {
      sqlStorage[previousDb.current] = sql
      setSql(sqlStorage[db])
      previousDb.current = db
      // Clear results when switching databases
      setResult(null)
    }
  }, [db, sql])

  // Update storage when SQL changes
  const handleSqlChange = (newSql: string | undefined) => {
    const sqlValue = newSql || ''
    setSql(sqlValue)
    sqlStorage[db] = sqlValue
  }

  // Configure Monaco Editor for SQL
  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
    lineNumbers: 'on' as const,
    renderWhitespace: 'selection' as const,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: 'on' as const,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    roundedSelection: false,
    padding: { top: 16, bottom: 16 },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on' as const,
    snippetSuggestions: 'top' as const,
    // Enable error highlighting
    glyphMargin: true,
    folding: true,
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 3,
    // Enhanced validation features
    renderValidationDecorations: 'on' as const,
    showUnused: true,
    showDeprecated: true,
  }

  const handleEditorMount = (editor: any, monaco: any) => {
    // Configure SQL language features
    monaco.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: () => {
        const suggestions = [
          // SQL Keywords
          ...['SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 
              'GROUP BY', 'ORDER BY', 'HAVING', 'INSERT', 'UPDATE', 'DELETE', 
              'CREATE', 'DROP', 'ALTER', 'TABLE', 'INDEX', 'VIEW', 'DATABASE',
              'UNION', 'LIMIT', 'OFFSET', 'DISTINCT', 'AS', 'COUNT', 'SUM', 
              'AVG', 'MIN', 'MAX', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'].map(keyword => ({
            label: keyword,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: keyword,
          })),
          // Database-specific functions
          ...(db === 'postgres' ? ['NOW()', 'CURRENT_TIMESTAMP', 'EXTRACT()', 'AGE()', 'COALESCE()'] 
                                : ['NOW()', 'CURRENT_TIMESTAMP()', 'DATE()', 'TIME()', 'IFNULL()']).map(func => ({
            label: func,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: func,
          }))
        ]
        return { suggestions }
      }
    })

    // Register SQL diagnostics provider for error checking
    const sqlDiagnosticsProvider = {
      provideMarkers: (model: any) => {
        const markers: any[] = []
        const text = model.getValue()
        const lines = text.split('\n')
        
        lines.forEach((line: string, lineIndex: number) => {
          const trimmed = line.trim().toLowerCase()
          
          // Check for common SQL syntax errors
          if (trimmed && !trimmed.startsWith('--')) {
            // Check for missing semicolon at end of statements
            if (trimmed.match(/^(select|insert|update|delete|create|drop|alter)/)) {
              const nextLineIndex = lineIndex + 1
              const isLastStatement = nextLineIndex >= lines.length || 
                                    lines.slice(nextLineIndex).every((l: string) => !l.trim() || l.trim().startsWith('--'))
              
              if (isLastStatement && !trimmed.endsWith(';') && !trimmed.includes('select') && trimmed !== '') {
                markers.push({
                  severity: monaco.MarkerSeverity.Warning,
                  message: 'Consider adding semicolon at end of statement',
                  startLineNumber: lineIndex + 1,
                  startColumn: line.length,
                  endLineNumber: lineIndex + 1,
                  endColumn: line.length + 1
                })
              }
            }
            
            // Check for unmatched parentheses
            const openParens = (line.match(/\(/g) || []).length
            const closeParens = (line.match(/\)/g) || []).length
            if (openParens !== closeParens) {
              markers.push({
                severity: monaco.MarkerSeverity.Error,
                message: 'Unmatched parentheses in this line',
                startLineNumber: lineIndex + 1,
                startColumn: 1,
                endLineNumber: lineIndex + 1,
                endColumn: line.length + 1
              })
            }
            
            // Check for SQL injection patterns (basic check)
            if (trimmed.includes("'; drop") || trimmed.includes('"; drop')) {
              markers.push({
                severity: monaco.MarkerSeverity.Error,
                message: 'Potential SQL injection pattern detected',
                startLineNumber: lineIndex + 1,
                startColumn: 1,
                endLineNumber: lineIndex + 1,
                endColumn: line.length + 1
              })
            }
            
            // Check for common typos in keywords
            const commonTypos = {
              'slect': 'SELECT',
              'form': 'FROM', 
              'whre': 'WHERE',
              'gropu': 'GROUP',
              'ordr': 'ORDER',
              'updat': 'UPDATE',
              'delet': 'DELETE',
              'crete': 'CREATE',
              'drp': 'DROP'
            }
            
            Object.entries(commonTypos).forEach(([typo, correct]) => {
              const regex = new RegExp(`\\b${typo}\\b`, 'gi')
              let match
              while ((match = regex.exec(line)) !== null) {
                markers.push({
                  severity: monaco.MarkerSeverity.Error,
                  message: `Did you mean "${correct}"?`,
                  startLineNumber: lineIndex + 1,
                  startColumn: match.index + 1,
                  endLineNumber: lineIndex + 1,
                  endColumn: match.index + match[0].length + 1
                })
              }
            })
            
            // Check for missing FROM clause in SELECT statements
            if (trimmed.startsWith('select') && !trimmed.includes(' from ') && !trimmed.includes('now()')) {
              markers.push({
                severity: monaco.MarkerSeverity.Warning,
                message: 'SELECT statement might be missing FROM clause',
                startLineNumber: lineIndex + 1,
                startColumn: 1,
                endLineNumber: lineIndex + 1,
                endColumn: line.length + 1
              })
            }
          }
        })
        
        return markers
      }
    }

    // Register the diagnostics provider
    const disposable = monaco.editor.onDidCreateModel((model: any) => {
      if (model.getLanguageId() === 'sql') {
        const updateMarkers = () => {
          const markers = sqlDiagnosticsProvider.provideMarkers(model)
          monaco.editor.setModelMarkers(model, 'sql-diagnostics', markers)
        }
        
        updateMarkers()
        model.onDidChangeContent(updateMarkers)
      }
    })

    // Update markers for current model
    const model = editor.getModel()
    if (model) {
      const updateMarkers = () => {
        const markers = sqlDiagnosticsProvider.provideMarkers(model)
        monaco.editor.setModelMarkers(model, 'sql-diagnostics', markers)
      }
      
      updateMarkers()
      model.onDidChangeContent(updateMarkers)
    }

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      run()
    })
  }

  const run = async () => {
    setRunning(true)
    setResult(null)
    try {
      const res = await fetch('/api/run-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ db, sql }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Query failed')
      setResult(data as QueryResult)
    } catch (e: any) {
      toast({ title: 'Query error', description: e?.message ?? 'Failed to run query', variant: 'destructive' })
    } finally {
      setRunning(false)
    }
  }

  return (
    <Card className="backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">SQL Editor</CardTitle>
            <CardDescription>
              Write and execute SQL queries. Press Ctrl+Enter to run. SELECTs are limited for safety.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditorTheme(editorTheme === 'vs-dark' ? 'light' : 'vs-dark')}
          >
            <Settings className="h-4 w-4 mr-2" />
            {editorTheme === 'vs-dark' ? 'Light' : 'Dark'} Theme
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="border rounded-md overflow-hidden">
          <Editor
            height="300px"
            language="sql"
            theme={editorTheme}
            value={sql}
            onChange={handleSqlChange}
            onMount={handleEditorMount}
            options={editorOptions}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            onClick={run} 
            disabled={running} 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
          >
            <Play className="h-4 w-4 mr-2" />
            {running ? 'Running...' : 'Run Query'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleSqlChange(sqlStorage[db] = db === 'postgres' 
              ? 'SELECT NOW() as current_time, version() as database_version'
              : 'SELECT NOW() as `current_time`, version() as `database_version`'
            )}
          >
            <Rows2 className="h-4 w-4 mr-2" />
            Example Query
          </Button>
          <Button variant="ghost" onClick={() => setResult(null)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Results
          </Button>
          <div className="text-xs text-muted-foreground ml-auto hidden sm:block">
            Tip: Use Ctrl+Enter to execute
          </div>
        </div>
        {result && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-2">Query Results</div>
            <ResultsTable columns={result.columns} rows={result.rows} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
