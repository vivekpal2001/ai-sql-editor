import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { DocsSidebar } from '@/components/docs/sidebar'
import type { ReactNode } from 'react'

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
      <SiteHeader />
      <div className="max-w-[1300px] mx-auto px-4 py-10 grid md:grid-cols-[260px_1fr] gap-8">
        <aside className="hidden md:block"><DocsSidebar /></aside>
        <div>{children}</div>
      </div>
      <SiteFooter />
    </main>
  )
}
