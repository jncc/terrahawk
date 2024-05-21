
// Validate and provide environment variables

import * as dotenv from 'dotenv'

dotenv.config()

let NODE_ENV                        = process.env.NODE_ENV as 'development' | 'production' | undefined
let AWS_PROFILE                     = process.env.AWS_PROFILE
let PGHOST                          = process.env.PGHOST
let PGDATABASE                      = process.env.PGDATABASE
let PGUSER                          = process.env.PGUSER
let PGPASSWORD                      = process.env.PGPASSWORD
let MONTHLY_NEAREST_50_TABLE        = process.env.MONTHLY_NEAREST_50_TABLE
let MONTHLY_NEAREST_50_TEST_TABLE   = process.env.MONTHLY_NEAREST_50_TEST_TABLE
let CEDA_ARD_URL_BASE               = process.env.CEDA_ARD_URL_BASE
let CEDA_INDICES_URL_BASE           = process.env.CEDA_INDICES_URL_BASE
let GWS_INDICES_URL_BASE            = process.env.GWS_INDICES_URL_BASE

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
if (!MONTHLY_NEAREST_50_TEST_TABLE) {
    throw(`Environment variable MONTHLY_NEAREST_50_TEST_TABLE is required.`)
}
if (!MONTHLY_NEAREST_50_TABLE) {
    throw(`Environment variable MONTHLY_NEAREST_50_TABLE is required.`)
}
if (!CEDA_ARD_URL_BASE) {
    throw(`Environment variable CEDA_ARD_URL_BASE is required.`)
}
if (!CEDA_INDICES_URL_BASE) {
    throw(`Environment variable CEDA_INDICES_URL_BASE is required.`)
}
if (!GWS_INDICES_URL_BASE) {
    throw(`Environment variable GWS_INDICES_URL_BASE is required.`)
}

/**
 * Provides the environment variables for the application.
 */
export const env = {
    NODE_ENV,
    AWS_PROFILE,
    PGHOST,
    PGDATABASE,
    PGUSER,
    PGPASSWORD,
    MONTHLY_NEAREST_50_TABLE,
    MONTHLY_NEAREST_50_TEST_TABLE,
    CEDA_ARD_URL_BASE,
    CEDA_INDICES_URL_BASE,
    GWS_INDICES_URL_BASE
    // the PG env vars are actually accessed from process.env directly by the libraries
    // so we don't actually need to export them
}
