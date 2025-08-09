import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const bodySchema = z.object({
  db: z.enum(['postgres', 'mysql']),
  tableName: z.string().min(1),
  columns: z.array(z.string().min(1)),
  rowCount: z.number().min(1).max(1000).default(25),
  prompt: z.string().default('Generate realistic synthetic data.'),
})

export async function POST(req: NextRequest) {
  try {
    const { db, tableName, columns, rowCount, prompt } = bodySchema.parse(await req.json())
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      console.error('GEMINI_API_KEY environment variable is not set')
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured. Please set the GEMINI_API_KEY environment variable.' }, { status: 500 })
    }

    console.log('API Key found:', apiKey ? `${apiKey.substring(0, 10)}...` : 'None')

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Generate ${db.toUpperCase()} table schema for "${tableName}" with columns: ${columns.join(', ')}.

Return only this JSON:
{
  "columns": [{"name":"column_name", "type":"sql_type", "nullable":true}],
  "createTableSQL": "CREATE TABLE IF NOT EXISTS ${tableName} (...);",
  "rows": [{"column_name": "value"}]
}

- Use ${db} types: ${db === 'postgres' ? 'varchar(255), integer, bigint, boolean, text' : 'varchar(255), int, bigint, boolean, text'}
- Generate exactly ${rowCount} realistic data rows
- Include id column in schema if needed (use BIGSERIAL PRIMARY KEY for postgres, AUTO_INCREMENT for mysql)
- CRITICAL: rows array must NOT contain any auto-increment ID fields - only include user-specified columns
- Only include the columns: ${columns.join(', ')} in the rows data
- Keep values short and simple
- Ensure rows array has exactly ${rowCount} entries
- ${prompt}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        maxOutputTokens: 2048,
        responseMimeType: "application/json"
      }
    };

    console.log('Making request to Gemini API...')
    console.log('Request body:', JSON.stringify(requestBody, null, 2))

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=' + encodeURIComponent(apiKey)

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    console.log('Gemini API response status:', res.status)
    console.log('Gemini API response headers:', Object.fromEntries(res.headers.entries()))

    if (!res.ok) {
      const errText = await res.text()
      console.error('Gemini API error:', errText)
      return NextResponse.json({ error: `Gemini API error: ${errText}` }, { status: 400 })
    }

    const data = await res.json() as any
    console.log('Gemini API raw response:', JSON.stringify(data, null, 2))
    
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    if (!text) {
      console.error('Empty response from Gemini. Full response:', data)
      return NextResponse.json({ error: 'Empty response from Gemini' }, { status: 400 })
    }

    console.log('Raw Gemini response:', text.substring(0, 500) + (text.length > 500 ? '...' : ''))
    
    // Check if response was truncated
    const finishReason = data?.candidates?.[0]?.finishReason
    if (finishReason === 'MAX_TOKENS') {
      console.warn('Response was truncated due to MAX_TOKENS. Full response:', text)
    }
    
    let parsed: any
    try {
      parsed = JSON.parse(text)
    } catch (_e) {
      console.error('Initial JSON parse failed:', _e)
      console.log('Full response text:', text)
      
      // Try to fix incomplete JSON by adding missing closing brackets
      let fixedText = text.trim()
      
      // Count opening and closing braces/brackets
      const openBraces = (fixedText.match(/\{/g) || []).length
      const closeBraces = (fixedText.match(/\}/g) || []).length
      const openBrackets = (fixedText.match(/\[/g) || []).length
      const closeBrackets = (fixedText.match(/\]/g) || []).length
      
      // Add missing closing brackets/braces
      for (let i = 0; i < openBrackets - closeBrackets; i++) {
        fixedText += ']'
      }
      for (let i = 0; i < openBraces - closeBraces; i++) {
        fixedText += '}'
      }
      
      console.log('Attempting to fix truncated JSON...')
      console.log('Fixed text:', fixedText)
      
      try {
        parsed = JSON.parse(fixedText)
        console.log('Successfully parsed fixed JSON')
      } catch (fixError) {
        console.error('Fixed JSON parse also failed:', fixError)
        return NextResponse.json({ 
          error: `JSON parsing failed. Response was truncated at: ${text.substring(Math.max(0, text.length - 50))}` 
        }, { status: 400 })
      }
    }

    console.log('Parsed response:', parsed)

    // Validate required fields
    if (!parsed.columns || !parsed.createTableSQL) {
      return NextResponse.json({ error: 'Invalid response format from AI' }, { status: 400 })
    }

    // Sanity cleanse rows: only allowed column keys, fill missing with null
    const allowed = new Set<string>((parsed.columns ?? []).map((c: any) => c.name))
    let cleanedRows = Array.isArray(parsed.rows) ? parsed.rows.map((r: any) => {
      const out: Record<string, any> = {}
      for (const k of Object.keys(r ?? {})) {
        if (allowed.has(k)) out[k] = r[k]
      }
      for (const c of parsed.columns ?? []) {
        if (!(c.name in out)) out[c.name] = null
      }
      return out
    }) : []

    // If we got fewer rows than requested, duplicate existing rows with variations
    while (cleanedRows.length < rowCount && cleanedRows.length > 0) {
      const template = cleanedRows[cleanedRows.length % cleanedRows.length]
      const newRow: Record<string, any> = {}
      
      for (const [key, value] of Object.entries(template)) {
        if (typeof value === 'string') {
          newRow[key] = value + '_' + (cleanedRows.length + 1)
        } else if (typeof value === 'number') {
          newRow[key] = value + cleanedRows.length
        } else if (typeof value === 'boolean') {
          newRow[key] = Math.random() > 0.5
        } else {
          newRow[key] = value
        }
      }
      cleanedRows.push(newRow)
    }

    // Trim to exact count if we have too many
    cleanedRows = cleanedRows.slice(0, rowCount)

    console.log(`Generated ${cleanedRows.length} rows (requested: ${rowCount})`)

    return NextResponse.json({
      columns: parsed.columns ?? [],
      createTableSQL: String(parsed.createTableSQL ?? ''),
      rows: cleanedRows,
    })
  } catch (error) {
    console.error('Error in generate-table API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
