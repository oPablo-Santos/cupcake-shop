import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const envPath = resolve(process.cwd(), '.env')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = value
  }
}

if (process.env.DIRECT_URL?.trim()) process.exit(0)

const unpooled = process.env.DATABASE_URL_UNPOOLED?.trim()
if (unpooled) {
  process.env.DIRECT_URL = unpooled
  process.exit(0)
}

console.error(
  [
    'DIRECT_URL is required for prisma migrate deploy.',
    'On Vercel (Neon): add DIRECT_URL or DATABASE_URL_UNPOOLED (direct connection, no pooler).',
    'Also set DATABASE_URL (pooled).',
  ].join('\n'),
)
process.exit(1)