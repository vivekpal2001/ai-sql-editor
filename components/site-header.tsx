'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Github, Database, Sparkles } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-zinc-900/60">
      <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow">
            <Sparkles className="h-5 w-5" />
          </span>
          <span>AI SQL Studio</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/sql">
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-colors">
              <Database className="mr-2 h-4 w-4" />
              Try Now
            </Button>
          </Link>
          <Button variant="outline" asChild>
            <a href="https://github.com/" target="_blank" rel="noreferrer">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
        </nav>
      </div>
    </header>
  )
}
