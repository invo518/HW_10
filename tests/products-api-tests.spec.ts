import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { OrderDto } from '../src/dto/OrderDto'

test.describe('Lesson 12 -> Product API tests', () => {
  const BaseEndpointURL = 'https://backend.tallinn-learning.ee/products'
  const AUTH = { 'X-API-Key': 'my-secret-api-key' }
  const testOrder = OrderDto.generateDefault()

  test('GET /products - check API returns array with length >= 1', async ({ request }) => {
    const response = await request.get(BaseEndpointURL, {
      headers: AUTH,
    })

    const responseBody: OrderDto[] = await response.json()
    console.log(responseBody)
    expect(response.status()).toBe(StatusCodes.OK)
    expect(responseBody.length).toBeDefined()
    expect(responseBody.length).toBeGreaterThanOrEqual(1)
  })
  test('GET /products without API key should return 401', async ({ request }) => {
    const response = await request.get(BaseEndpointURL)

    expect(response.status()).toBe(401)
  })
  test('Check body structure', async ({ request }) => {
    const response = await request.get(BaseEndpointURL, {
      headers: AUTH,
    })
    const responseBody: OrderDto[] = await response.json()
    const product = responseBody[0]
    expect(response.status()).toBe(StatusCodes.OK)
    expect(typeof product.id).toBe('number')
    expect(typeof product.name).toBe('string')
    expect(typeof product.price).toBe('number')
    expect(typeof product.createdAt).toBeDefined()
  })

  test('POST /products; GET /products/{id};GET /products/{id} - check product creation and product search by id and Change name and price with valid API key, should return 200', async ({
    request,
  }) => {
    const createResponse = await request.post(BaseEndpointURL, {
      headers: AUTH,
      data: testOrder,
    })

    const createResponseBody: OrderDto = await createResponse.json()
    console.log(createResponseBody)
    expect(createResponseBody.id).toBeGreaterThan(0)
    expect(createResponseBody.name).toBe(testOrder.name)
    expect(createResponseBody.price).toBe(testOrder.price)
    expect(createResponseBody.createdAt).toBeDefined()

    const searchResponse = await request.get(`${BaseEndpointURL}/${createResponseBody.id}`, {
      headers: AUTH,
    })
    const searchResponseBody: OrderDto = await searchResponse.json()
    expect(searchResponse.status()).toBe(StatusCodes.OK)
    expect.soft(searchResponseBody.id).toBe(createResponseBody.id)
    expect.soft(searchResponseBody.name).toBe(testOrder.name)
    expect.soft(searchResponseBody.price).toBe(testOrder.price)
    expect.soft(searchResponseBody.createdAt).toBeDefined()
    console.log(createResponseBody)

    const updateOrder = OrderDto.generateCustom('change successfully', 150)
    const response = await request.put(`${BaseEndpointURL}/${createResponseBody.id}`, {
      data: updateOrder,
      headers: AUTH,
    })
    const responseBody: OrderDto = await response.json()
    console.log(responseBody)
    expect(response.status()).toBe(StatusCodes.OK)
    expect(typeof responseBody.id).toBe('number')
    expect(typeof responseBody.name).toBe('string')
    expect(typeof responseBody.price).toBe('number')
    expect(typeof responseBody.createdAt).toBeDefined()

    const deleteResponse = await request.delete(`${BaseEndpointURL}/${updateOrder.id}`, {
      headers: AUTH,
    })
    expect(deleteResponse.status()).toBeTruthy()

    const getResponse = await request.get(`${BaseEndpointURL}/${updateOrder.id}`, {
      headers: AUTH,
    })

    expect(getResponse.status()).toBe(400)
  })

  test('Create product without API key, should return 401', async ({ request }) => {
    const response = await request.post(BaseEndpointURL, {
      data: testOrder,
    })
    expect(response.status()).toBe(401)
  })

  test('DELETE /products - check not existing product deletion', async ({ request }) => {
    const deleteResponse = await request.delete(`${BaseEndpointURL}/-1`, {
      headers: AUTH,
    })

    expect(deleteResponse.status()).toBe(400)
  })
})
