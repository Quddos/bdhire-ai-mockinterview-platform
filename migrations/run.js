import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { migrate } from 'drizzle-orm/neon-http/migrator'

const runMigrations = async () => {
  try {
    const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DB_URL)
    const db = drizzle(sql)
    
    console.log('Running migrations...')
    
    await migrate(db, { migrationsFolder: 'migrations' })
    
    console.log('Migrations completed!')
    process.exit(0)
  } catch (error) {
    console.error('Error running migrations:', error)
    process.exit(1)
  }
}

runMigrations() 