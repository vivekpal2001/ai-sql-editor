export default function PostgresBasics() {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>PostgreSQL Basics</h1>
      <p>PostgreSQL is a powerful open-source relational database with rich data types and extensions.</p>
      <h2>Common Types</h2>
      <ul>
        <li><code>serial</code>, <code>bigserial</code> – auto-incrementing integers</li>
        <li><code>text</code>, <code>varchar(n)</code> – string data</li>
        <li><code>timestamptz</code> – timestamp with time zone</li>
        <li><code>jsonb</code> – binary JSON storage with indexing capabilities</li>
      </ul>
      <h2>Sample Query</h2>
  <pre><code>{`SELECT id, email, created_at\nFROM users\nWHERE created_at > now() - interval '7 days'\nORDER BY created_at DESC;`}</code></pre>
      <h2>Indexes</h2>
      <p>Create indexes for frequently filtered columns: <code>CREATE INDEX ON users(email);</code></p>
    </article>
  )
}
