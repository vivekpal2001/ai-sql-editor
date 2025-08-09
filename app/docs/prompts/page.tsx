export default function PromptsDocs() {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>Writing Effective Prompts</h1>
      <p>Prompts guide AI toward the correct domain assumptions.</p>
      <h2>Structure</h2>
      <pre><code>Context: (domain)
Include: (fields, ranges, enums)
Quality: (realistic/unique/distribution)
Constraints: (relationships, nullability)</code></pre>
      <h2>Examples</h2>
      <ul>
        <li><strong>E-commerce Orders</strong>: realistic price (5-500), ISO dates last 90 days, status among pending|paid|shipped.</li>
        <li><strong>SaaS Users</strong>: emails unique, signup spread across past year, plan among free|pro|enterprise.</li>
      </ul>
      <p>Be explicit about enumerations and date ranges for best reproducibility.</p>
    </article>
  )
}
