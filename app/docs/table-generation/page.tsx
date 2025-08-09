export default function TableGeneration() {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>Table Generation</h1>
      <p>The generator converts a lightweight description into a concrete schema plus realistic sample data.</p>
      <h2>Fields</h2>
      <ul>
        <li><strong>Table Name</strong>: snake_case or lower case preferred.</li>
        <li><strong>Columns</strong>: Provide hints (e.g. <code>user_id, email, signup_date, status</code>). Types are inferred.</li>
        <li><strong>Row Count</strong>: Target number of sample rows. The system pads/duplicates to guarantee the requested size.</li>
        <li><strong>Prompt</strong>: Extra context ("e-commerce orders with realistic prices and ISO timestamps").</li>
      </ul>
      <h2>Tips</h2>
      <ul>
        <li>Add a context noun ("orders", "profiles") in the prompt to sharpen inference.</li>
        <li>Specify constraints in prompt: "status among pending|shipped|cancelled".</li>
        <li>Use plural table names for collections; singular for entity detail tables.</li>
      </ul>
    </article>
  )
}
