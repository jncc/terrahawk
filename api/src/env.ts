
// Validate and provide environment variables

import * as dotenv from 'dotenv'
dotenv.config()

let NODE_ENV    = process.env.NODE_ENV as 'development' | 'production' | undefined
let AWS_PROFILE = process.env.AWS_PROFILE
let PGHOST      = process.env.PGHOST
let PGDATABASE  = process.env.PGDATABASE
let PGUSER      = process.env.PGUSER
let PGPASSWORD  = process.env.PGPASSWORD

if (NODE_ENV === 'development') {
    if (!AWS_PROFILE) {
        throw(`Environment variable AWS_PROFILE is required in development mode.`)
    }
}
if (!PGHOST) {
  throw(`Environment variable PGHOST is required.`)
}
if (!PGDATABASE) {
    throw(`Environment variable PGDATABASE is required.`)
}
if (!PGUSER) {
    throw(`Environment variable PGUSER is required.`)
}
if (!PGPASSWORD) {
    throw(`Environment variable PGPASSWORD is required.`)
}

/**
 * Provides the environment variables for the application.
 */
export const env = {
    NODE_ENV,
    AWS_PROFILE,
    PGHOST,
    // the PG env vars are actually accessed from process.env directly by the libraries
    // so we don't actually need to export them
}
