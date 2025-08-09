'use client'

import { useState } from 'react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Database } from 'lucide-react'
import { SchemaSidebar, type DBType } from '@/components/sql/schema-sidebar'
import { AITableGenerator } from '@/components/sql/ai-table-generator'
import { SQLEditor } from '@/components/sql/sql-editor'
import { Button } from '@/components/ui/button'

export default function SQLStudioPage() {
  const [db, setDb] = useState<DBType>('postgres')
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
      <SiteHeader />
      <div className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
        <Card className="mb-6">
          <CardContent className="py-4 flex items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Choose your database and start generating tables or running queries.
            </div>
            <div className="flex items-center gap-2">
              <Select value={db} onValueChange={(v) => setDb(v as DBType)}>
                <SelectTrigger className="w-[160px]">
                  <Database className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Database" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="postgres">PostgreSQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => setRefreshKey((k) => k + 1)}>
                {'Refresh'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <div key={`schema-${refreshKey}`}>
            <SchemaSidebar db={db} />
          </div>
          <div className="space-y-6">
            <AITableGenerator db={db} onCreated={() => setRefreshKey((k) => k + 1)} />
            <SQLEditor db={db} />
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  )
}
