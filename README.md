# AI SQL Studio

AI-powered SQL editor for PostgreSQL and MySQL with a modern, responsive UI. Generate realistic dummy data with the Gemini API, create tables directly from a prompt, and run queries.

## Stack
- Next.js (App Router) + TypeScript
- shadcn/ui + Tailwind CSS  
- Direct Gemini REST API
- pg and mysql2/promise
- Docker + docker-compose
- Monaco Editor for SQL editing

## Features
- 🤖 AI-powered table generation with realistic data
- 📊 Support for PostgreSQL and MySQL databases
- 🎨 Modern UI with elegant footer design
- 📝 Monaco Editor with SQL syntax highlighting
- 🗃️ Schema browser and table management
- 🔍 Query results visualization
- 🐳 Docker containerization

## Environment Variables
Server-side environment variables:
- `GEMINI_API_KEY=your_key`
- `POSTGRES_URL=postgres://app:app@postgres:5432/app`
- `MYSQL_URL=mysql://root:root@mysql:3306/app?connectionLimit=10`

## Getting Started (Docker)
1. Clone the repository
2. Run `docker-compose up --build`
3. Open http://localhost:3000

## Notes
- SELECT queries are capped with LIMIT for safety
- For production, add authentication and query rate limiting
- Uses AI SDK structured outputs to ensure well-formed schema and data
- Factored components: schema browser, AI generator, editor, results table
