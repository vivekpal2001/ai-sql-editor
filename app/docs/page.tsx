export default function DocsHome() {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>AI SQL Studio Documentation</h1>
      <p>Welcome to the documentation. This guide will help you quickly understand how to use the platform to generate tables, craft prompts, and learn core PostgreSQL and MySQL concepts.</p>
      <h2>Main Concepts</h2>
      <ul>
        <li><strong>Table Generator</strong>: Describe your dataset; we build schema + sample rows.</li>
        <li><strong>SQL Editor</strong>: Run queries against live Postgres or MySQL instances.</li>
        <li><strong>Prompts</strong>: Influence column inference and data characteristics.</li>
      </ul>
      <p>Use the sidebar to navigate topics.</p>
    </article>
  )
}
