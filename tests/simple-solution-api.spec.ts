import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'
import {describe} from 'node:test'

describe('Test endpoint GET /test-orders/{id}',() => {
  const baseUrl = 'https://backend.tallinn-learning.ee/test-orders/'

test('get order with correct id should receive code 200', async ({ request }) => {
  const response = await request.get(`${baseUrl}1`)
  const responseBody = await response.json()
  const statusCode = response.status()
  console.log('response body:', responseBody)
  expect(statusCode).toBe(200)
})
test('get order with incorrect id should receive code 400', async ({ request }) => {
  const response = await request.get(`${baseUrl}12`);
  const statusCode = response.status()
  console.log('Order not found');
  expect(statusCode). toBe(400)
})
test("get order with incorrect id should receive code 405", async ({ request }) => {
  const response = await request.get(`${baseUrl}`)
  const statusCode = response.status()
  console.log('Method not Allowed')
  expect(statusCode).toBe(405)
})
test('get order where id is in letters should receive 400', async ({ request }) => {
  const response = await request.get(`${baseUrl}rew`)
  const statusCode = response.status();
  console.log('ID incorrect');
  expect(statusCode).toBe(400);
})
})
describe('Test endpoint PUT /test-orders/{id}',() => {
  const baseUrl = 'https://backend.tallinn-learning.ee/test-orders/'
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'string',
    customerPhone: 'string',
    comment: 'string',
    id: 0,
  }

test('Successful update order with correct length api_key and correct id should receive code 200', async ({ request }) => {
  const requestHeaders = { "api_key":"1234566678876767"};
  const response = await request.put(`${baseUrl}1`, {headers: requestHeaders, data:requestBody})
  const responseBody = await response.json()
  const statusCode = response.status()
  console.log('response status:', statusCode)
  console.log('response body:', responseBody)
  expect(statusCode).toBe(StatusCodes.OK)
})
  test('Not successful update order with correct Id and incorrect length api_key  should receive code 401', async ({ request }) => {
    const requestHeaders = { "api_key":"123456"};
    const response = await request.put(`${baseUrl}1`, {headers: requestHeaders, data:requestBody})
    const statusCode = response.status()
    console.log('response status:', statusCode)
    console.log('Unauthorized')
    expect(statusCode).toBe(401)
})
  test('Not successful update order with incorrect Id and correct length api_key  should receive code 400', async ({
    request,
  }) => {
    const requestHeaders = { api_key: '1234566745347856' }
    const response = await request.put(`${baseUrl}11`, {
      headers: requestHeaders,
      data: requestBody,
    })
    const statusCode = response.status()
    console.log('response status:', statusCode)
    console.log('Bad Request')
    expect(statusCode).toBe(400)
  })
  test("should return 400 when request body is missing", async ({ request }) => {
    const requestHeaders = { api_key: '1234566745347856' }
    const response = await request.put(`${baseUrl}1`, { headers: requestHeaders })
      const statusCode = response.status()
      console.log('response status:', statusCode)
      console.log('Unauthorized',statusCode)
      expect(statusCode).toBe(400)
    })
})
describe('Test endpoint Delete/test-orders/{id}',() => {
  const baseUrl = 'https://backend.tallinn-learning.ee/test-orders/'

  test('Delete order with correct id should return 204', async ({ request }) => {
    const requestHeaders = { api_key: '1234566745347856' };
    const response = await request.delete(`${baseUrl}1`, {headers: requestHeaders})
    const statusCode = response.status()
    console.log('Order deleted successfully', statusCode)
    expect(statusCode).toBe(204)

  })
  test('Not successfully delete order with incorrect length api_key should return 401', async ({ request }) => {
    const requestHeaders = { api_key: '1234' };
    const response = await request.delete(`${baseUrl}1`, {headers: requestHeaders})
    const statusCode = response.status()
    console.log('Bad request', statusCode)
    expect(statusCode).toBe(401)

     })
  })