const createApp = require('./app')
const database = require('./database')

const app = createApp(database)
const port = 3000

async function startServer() {
  try {
    await database.query('SELECT 1')
  } catch (error) {
    console.error(
      'Could not connect to PostgreSQL:',
      error.code || 'unknown error',
    )
    await database.end()
    process.exitCode = 1
    return
  }

  app.listen(port, '127.0.0.1', () => {
    console.log(`Laylah API listening at http://127.0.0.1:${port}`)
  })
}

startServer()
