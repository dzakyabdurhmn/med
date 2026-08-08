import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL || env('DATABASE_URL') || "postgresql://neondb_owner:npg_HAmRfpxZz8h1@ep-shiny-pine-aypu7cg4-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
})
