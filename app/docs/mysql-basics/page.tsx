export default function MysqlBasics() {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>MySQL Basics</h1>
      <p>MySQL is a widely-used relational database known for its speed and reliability.</p>
      <h2>Common Types</h2>
      <ul>
        <li><code>INT AUTO_INCREMENT</code> – auto incrementing integer PK</li>
        <li><code>VARCHAR(n)</code> – variable length string</li>
        <li><code>DATETIME</code> – date and time (no TZ)</li>
        <li><code>JSON</code> – native JSON storage (5.7+)</li>
      </ul>
      <h2>Sample Query</h2>
      <pre><code>{`SELECT id, email, created_at\nFROM users\nWHERE created_at > NOW() - INTERVAL 7 DAY\nORDER BY created_at DESC;`}</code></pre>
      <h2>Indexes</h2>
      <p>Create indexes for frequent lookups: <code>CREATE INDEX idx_users_email ON users(email);</code></p>
    </article>
  )
}
