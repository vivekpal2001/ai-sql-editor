'use client'

type Props = {
  columns: string[]
  rows: any[]
  dense?: boolean
}

export function ResultsTable({ columns, rows, dense }: Props) {
  return (
    <div className="rounded-md border overflow-auto">
      <table className={`w-full ${dense ? 'text-xs' : 'text-sm'}`}>
        <thead className="bg-muted/50">
          <tr>
            {columns.map((c) => (
              <th key={c} className={`${dense ? 'p-1.5' : 'p-2'} text-left font-medium`}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td className={`${dense ? 'p-3' : 'p-4'} text-muted-foreground`}>No rows</td></tr>
          ) : rows.map((r, i) => (
            <tr key={i} className="border-t">
              {columns.map((c) => (
                <td key={c} className={`${dense ? 'p-1.5' : 'p-2'}`}>{String(r[c] ?? '')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
