export default function FAQ() {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>FAQ</h1>
      <h3>Is my data persisted?</h3>
      <p>Tables you create live in the running container databases. For production persistence you'd provision external DB instances.</p>
      <h3>How accurate is AI type inference?</h3>
      <p>It provides strong defaults; always review DDL before creation.</p>
      <h3>Can I modify generated tables?</h3>
      <p>Yes—drop and recreate with refined prompts or use ALTER statements manually.</p>
    </article>
  )
}
