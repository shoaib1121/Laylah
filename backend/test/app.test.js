const { test } = require('node:test')
const assert = require('node:assert/strict')
const request = require('supertest')
const createApp = require('../app')

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

const database = {
  async query(text, values) {
    if (values.length === 0) {
      return { rows: menuItems }
    }

    return {
      rows: menuItems.filter((item) => item.category === values[0]),
    }
  },
}

const app = createApp(database)

test('health endpoint responds successfully without the Express header', async () => {
  const response = await request(app).get('/api/v1/health')

  assert.equal(response.status, 200)
  assert.deepEqual(response.body, { status: 'ok' })
  assert.equal(response.headers['x-powered-by'], undefined)
})

test('menu endpoint returns five items with the expected fields', async () => {
  const response = await request(app).get('/api/v1/menu')

  assert.equal(response.status, 200)
  assert.equal(response.body.items.length, 5)

  const expectedFields = ['category', 'description', 'id', 'name', 'price']

  for (const item of response.body.items) {
    assert.deepEqual(Object.keys(item).sort(), expectedFields)
  }
})

test('menu endpoint filters items by category', async () => {
  const response = await request(app)
    .get('/api/v1/menu')
    .query({ category: 'Indian' })

  assert.equal(response.status, 200)
  assert.equal(response.body.items.length, 2)
  assert.ok(response.body.items.every((item) => item.category === 'Indian'))
})

test('menu endpoint rejects unsupported categories', async () => {
  const response = await request(app)
    .get('/api/v1/menu')
    .query({ category: 'Seafood' })

  assert.equal(response.status, 400)
  assert.deepEqual(response.body, {
    error: {
      code: 'INVALID_CATEGORY',
      message: 'Unsupported menu category.',
    },
  })
})

test('menu endpoint rejects repeated category parameters', async () => {
  const response = await request(app).get(
    '/api/v1/menu?category=Indian&category=Drinks',
  )

  assert.equal(response.status, 400)
  assert.deepEqual(response.body, {
    error: {
      code: 'INVALID_CATEGORY',
      message: 'Provide only one category.',
    },
  })
})


test('database failures return a generic error without internal details', async () => {
  const failingApp = createApp({
    async query() {
      throw Object.assign(new Error('private database connection details'), {
        code: 'TEST_DATABASE_FAILURE',
      })
    },
  })
  const response = await request(failingApp).get('/api/v1/menu')

  assert.equal(response.status, 500)
  assert.deepEqual(response.body, {
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Unable to load the menu right now.',
    },
  })
  assert.equal(response.headers['x-powered-by'], undefined)
})

test('category queries pass the category as a SQL parameter', async () => {
  let observedQuery
  const isolatedApp = createApp({
    async query(text, values) {
      observedQuery = { text, values }
      return { rows: [] }
    },
  })
  const response = await request(isolatedApp)
    .get('/api/v1/menu')
    .query({ category: 'Drinks' })

  assert.equal(response.status, 200)
  assert.deepEqual(response.body, { items: [] })
  assert.match(observedQuery.text, /WHERE category = \$1/)
  assert.deepEqual(observedQuery.values, ['Drinks'])
  assert.ok(!observedQuery.text.includes('Drinks'))
})

test('SQL-like category input is rejected before database access', async () => {
  let queryCount = 0
  const isolatedApp = createApp({
    async query() {
      queryCount += 1
      return { rows: [] }
    },
  })
  const response = await request(isolatedApp)
    .get('/api/v1/menu')
    .query({ category: "Indian' OR '1'='1" })

  assert.equal(response.status, 400)
  assert.equal(response.body.error.code, 'INVALID_CATEGORY')
  assert.equal(queryCount, 0)
})
