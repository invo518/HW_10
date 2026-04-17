import { expect, test } from '@playwright/test'
import { LoginDto } from '../src/dto/LoginDto'

test.describe('login api tests', () => {
  const baseUrl = 'https://backend.tallinn-learning.ee/login/student'
  test('incorrect login with empty fields', async ({ request }) => {
    const loginResponse = await request.post(baseUrl, {
      data: LoginDto.generateIncorrectPair(),
    })
    expect(loginResponse.status()).toBe(401)
  })
  test('incorrect password, correct login should be return 401', async ({ request }) => {
    const loginResponse = await request.post(baseUrl, {
      data: LoginDto.generateIncorrectPair1(),
    })
    expect(loginResponse.status()).toBe(401)
  })
  test('incorrect login, correct password should be return 401', async ({ request }) => {
    const loginResponse = await request.post(baseUrl, {
      data: LoginDto.generateIncorrectPair2(),
    })
    expect(loginResponse.status()).toBe(401)
  })
  test('correct login', async ({ request }) => {
    console.log(LoginDto.generateCorrectPair())
    const loginResponse = await request.post(baseUrl, {
      data: LoginDto.generateCorrectPair(),
    })
    const token = await loginResponse.text()
    console.log(await loginResponse.text())
    expect(loginResponse.status()).toBe(200)
    expect(token.length).toBeGreaterThan(0)
  })
})
