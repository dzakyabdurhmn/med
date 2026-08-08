import 'dotenv/config'

export function getDatabaseUrl() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    'postgresql://neondb_owner:npg_HAmRfpxZz8h1@ep-shiny-pine-aypu7cg4-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required')
  }

  return databaseUrl
}
