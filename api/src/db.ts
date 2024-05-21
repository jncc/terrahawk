
import { Pool } from 'pg'
import { env } from './env'

// shared PG pool
const pool = new Pool({
    host: env.PGHOST,
    database: env.PGDATABASE,
    user: env.PGUSER,
    password: env.PGPASSWORD,
    port: 5432,
    ssl: true
})

// TODO type better
export const query = (text: string, params: any) => pool.query(text, params)
