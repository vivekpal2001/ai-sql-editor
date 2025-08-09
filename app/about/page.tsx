import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
      <SiteHeader />
      <div className="max-w-[900px] mx-auto px-4 py-16 prose dark:prose-invert">
        <h1>About This Project</h1>
        <p>Hi, I'm <strong>Vivek Pal</strong>. This project was built to streamline learning and experimentation with relational databases by combining AI-assisted schema generation with an integrated SQL workspace.</p>
        <h2>Vision</h2>
        <p>Create the fastest path from idea to query: describe your dataset, inspect generated DDL, and start validating assumptions immediately.</p>
        <h2>Roadmap Ideas</h2>
        <ul>
          <li>Query history & saved snippets</li>
          <li>Schema diffing & migration suggestions</li>
          <li>Collaboration & shared workspaces</li>
          <li>AI-assisted query optimization tips</li>
          <li>Learning tracks & progress metrics</li>
        </ul>
        <h2>Contributing</h2>
        <p>Feedback and contributions are welcome. Open issues or PRs on the GitHub repo to help shape the future.</p>
      </div>
      <SiteFooter />
    </main>
  )
}
