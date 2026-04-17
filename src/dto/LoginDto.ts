export class LoginDto {
  username: string
  password: string
  constructor(username: string, password: string) {
    this.username = username
    this.password = password
  }
  static generateIncorrectPair(): LoginDto {
    return new LoginDto('', '')
  }
  static generateCorrectPair(): LoginDto {
    return new LoginDto(
      process.env.USER || 'missing USER env var',
      process.env.PASSWORD || 'missing PASSWORD env var',
    )
  }
  static generateIncorrectPair1(): LoginDto {
    return new LoginDto(process.env.USER || 'missing USER env var', 'invalid password')
  }
  static generateIncorrectPair2(): LoginDto {
    return new LoginDto('invalid USER env var', process.env.PASSWORD || 'invalid USER env var')
  }
}
