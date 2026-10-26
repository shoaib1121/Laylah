const express = require('express')

const app = express()
const port = 3000

const menuItems = [
  {
    id: 1,
    name: 'Chicken Dum Biryani',
    category: 'Indian',
    description: 'Fragrant basmati rice layered with slow-cooked spices.',
    price: 249,
  },
  {
    id: 2,
    name: 'Mutton Dum Biryani',
    category: 'Indian',
    description: 'Tender mutton, aromatic rice, and rich traditional spices.',
    price: 349,
  },
  {
    id: 3,
    name: 'Chicken Mandi',
    category: 'Arabian',
    description: 'Smoky roasted chicken served with fragrant mandi rice.',
    price: 299,
  },
  {
    id: 4,
    name: 'Chicken Grill',
    category: 'Arabian',
    description: 'Grilled chicken seasoned with bold Arabian spices.',
    price: 279,
  },
  {
    id: 5,
    name: 'Mint Lime',
    category: 'Drinks',
    description: 'A refreshing lime drink with a hint of mint.',
    price: 79,
  },
]

const supportedCategories = ['Indian', 'Arabian', 'Drinks']

app.get('/api/v1/health', (request, response) => {
  response.json({ status: 'ok' })
})

app.get('/api/v1/menu', (request, response) => {
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

  const items = category
    ? menuItems.filter((item) => item.category === category)
    : menuItems

  response.json({ items })
})

app.listen(port, '127.0.0.1', () => {
  console.log(`Lamp API listening at http://127.0.0.1:${port}`)
})