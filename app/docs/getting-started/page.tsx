export default function GettingStarted() {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>Getting Started</h1>
      <ol>
        <li>Open the SQL Editor from the navigation.</li>
        <li>Select your database engine (PostgreSQL or MySQL).</li>
        <li>Use the AI Table Generator panel: enter a table name, comma-separated column ideas, desired rows, and an optional prompt.</li>
        <li>Review the generated CREATE TABLE DDL + sample rows.</li>
        <li>Click Create Table to apply schema and insert sample data.</li>
        <li>Query immediately in the editor area.</li>
      </ol>
      <p>Tables appear in the sidebar; select any to preview column metadata and sample rows.</p>
    </article>
  )
}
