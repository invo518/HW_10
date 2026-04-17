import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { ProductDto } from '../src/dto/ProductDto'

//Get/products
test.describe('Lesson 11 -> Product API tests', () => {
  const BaseEndpointURL = 'https://backend.tallinn-learning.ee/products'
  const AUTH = { 'X-API-Key': 'my-secret-api-key' }
  type Product = {
    id: number
    name: string
    price: number
    createdAt: string | null
  }
  test('GET /products - check API returns array with length >= 1', async ({ request }) => {
    const response = await request.get(BaseEndpointURL, {
      headers: AUTH,
    })

    const responseBody: ProductDto[] = await response.json()
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
    const responseBody: ProductDto[] = await response.json()
    const product = responseBody[0]
    expect(response.status()).toBe(StatusCodes.OK)
    expect(typeof product.id).toBe('number')
    expect(typeof product.name).toBe('string')
    expect(typeof product.price).toBe('number')
    expect(typeof product.createdAt).toBeDefined()
  })

  //Post/products

  test('POST /products; GET /products/{id} - check product creation and product search by id', async ({
    request,
  }) => {
    const testProduct = ProductDto.generateDefault()

    const createResponse = await request.post(BaseEndpointURL, {
      headers: AUTH,
      data: testProduct,
    })

    const createResponseBody: ProductDto = await createResponse.json()
    expect(createResponseBody.id).toBeDefined()
    expect(createResponseBody.name).toBe(testProduct.name)
    expect(createResponseBody.price).toBe(testProduct.price)
    expect(createResponseBody.createdAt).toBeDefined()

    const searchResponse = await request.get(`${BaseEndpointURL}/${createResponseBody.id}`, {
      headers: AUTH,
    })
    const searchResponseBody: ProductDto = await searchResponse.json()
    expect(searchResponse.status()).toBe(StatusCodes.OK)
    expect.soft(searchResponseBody.id).toBe(createResponseBody.id)
    expect.soft(searchResponseBody.name).toBe(testProduct.name)
    expect.soft(searchResponseBody.price).toBe(testProduct.price)
    expect.soft(searchResponseBody.createdAt).toBeDefined()
    console.log(createResponseBody)
  })

  test('Create product without API key, should return 401', async ({ request }) => {
    const testProduct = ProductDto.generateCustom('bu', 124523643)
    const response = await request.post(BaseEndpointURL, {
      data: testProduct,
    })
    expect(response.status()).toBe(401)
  })

  //Put/products/{id}
  test('Change price in product with correct id', async ({ request }) => {
    const updateProduct = ProductDto.generateCustom('test DTO', 34)
    const response = await request.put(`${BaseEndpointURL}/1118`, {
      data: updateProduct,
      headers: AUTH,
    })
    const changeBody: ProductDto = await response.json()
    expect(response.status()).toBe(StatusCodes.OK)
    expect(changeBody.id).toBeDefined()
    expect(changeBody.name).toBe(updateProduct.name)
    expect(changeBody.price).toBe(34)
    expect(changeBody.createdAt).toBeDefined()
    console.log(changeBody)
  })
  test('Change price in product with correct id and without API-key should return 401', async ({
    request,
  }) => {
    const updateProduct = ProductDto.generateCustom('re', 3)
    const response = await request.put(`${BaseEndpointURL}/1118`, {
      data: updateProduct,
    })
    expect(response.status()).toBe(401)
    console.log(process.env['TEST '])
  })
  //Delete/products/{id}
  test('DELETE /products - check not existing product deletion', async ({ request }) => {
    const deleteResponse = await request.delete(`${BaseEndpointURL}/-1`, {
      headers: AUTH,
    })

    expect(deleteResponse.status()).toBe(400)
  })

  test('DELETE /products - check product deletion', async ({ request }) => {
    const deleteResponse = await request.delete(`${BaseEndpointURL}/1118`, {
      headers: AUTH,
    })

    expect(deleteResponse.status()).toBe(204)
  })
})
