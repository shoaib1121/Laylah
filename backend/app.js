const express = require('express')

function createApp(database) {
  const app = express()
  app.disable('x-powered-by')

  app.get('/api/v1/health', (request, response) => {
    response.json({ status: 'ok' })
  })

  const supportedCategories = ['Indian', 'Arabian', 'Drinks']

  app.get('/api/v1/menu', async (request, response) => {
    const category = request.query.category

    if (Array.isArray(category)) {
      return response.status(400).json({
        error: {
          code: 'INVALID_CATEGORY',
          message: 'Provide only one category.',
        },
      })
    }

    if (category !== undefined && !supportedCategories.includes(category)) {
      return response.status(400).json({
        error: {
          code: 'INVALID_CATEGORY',
          message: 'Unsupported menu category.',
        },
      })
    }

    const query = category
      ? {
          text: `
            SELECT id, name, category, description, price
            FROM app.menu_items
            WHERE category = $1
            ORDER BY id
          `,
          values: [category],
        }
      : {
          text: `
            SELECT id, name, category, description, price
            FROM app.menu_items
            ORDER BY id
          `,
          values: [],
        }

    try {
      const result = await database.query(query.text, query.values)
      return response.json({ items: result.rows })
    } catch (error) {
      console.error('Menu database query failed:', error.code || 'unknown error')
      return response.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Unable to load the menu right now.',
        },
      })
    }
  })

  return app
}

module.exports = createApp
