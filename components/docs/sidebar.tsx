"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const sections = [
  { title: 'Introduction', items: [ { href: '/docs', label: 'Overview' }, { href: '/docs/getting-started', label: 'Getting Started' } ] },
  { title: 'Using the Generator', items: [ { href: '/docs/table-generation', label: 'Table Generation' }, { href: '/docs/prompts', label: 'Writing Prompts' } ] },
  { title: 'SQL Engines', items: [ { href: '/docs/postgres-basics', label: 'PostgreSQL Basics' }, { href: '/docs/mysql-basics', label: 'MySQL Basics' } ] },
  { title: 'Platform', items: [ { href: '/docs/faq', label: 'FAQ' } ] }
]

export function DocsSidebar() {
  const pathname = usePathname()
  return (
    <nav className="text-sm space-y-8">
      {sections.map(section => (
        <div key={section.title} className="space-y-3">
          <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">{section.title}</h4>
          <ul className="space-y-1">
            {section.items.map(item => {
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link href={item.href} className={cn('block rounded px-2 py-1.5 transition-colors', active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50')}>
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
