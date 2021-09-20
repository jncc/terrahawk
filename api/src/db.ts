
import { Pool } from 'pg'

// shared PG pool
const pool = new Pool()

// TODO type better
export const query = (text: string, params: any) => pool.query(text, params)
