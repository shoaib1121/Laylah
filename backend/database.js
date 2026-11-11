const { Pool } = require('pg')

const requiredSettings = [
  'PGHOST',
  'PGPORT',
  'PGDATABASE',
  'PGUSER',
  'PGPASSWORD',
]

const missingSettings = requiredSettings.filter((name) => !process.env[name])

if (missingSettings.length > 0) {
  throw new Error(
    `Missing PostgreSQL environment settings: ${missingSettings.join(', ')}`,
  )
}

const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
})

module.exports = pool
