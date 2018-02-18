// tslint:disable no-expression-statement
import { main } from './cli'

const argvBase: ReadonlyArray<string> = [
  '/usr/local/bin/node',
  '/home/mockUser',
]

const mockDecryptedValue = 'foobar'
const mockEncryptedValue = Buffer.from(mockDecryptedValue).toString('base64')

jest.mock('readline', () => ({
  clearLine: jest.fn(),
  createInterface: () => ({
    close: jest.fn(),
    question: (questionText: any, callback: any) =>
      callback(
        questionText.match('encrypted')
          ? mockEncryptedValue
          : mockDecryptedValue,
      ),
  }),
  moveCursor: jest.fn(),
}))

describe('cli', () => {
  it('should be able to encrypt a string', async () => {
    const result = await main([...argvBase, 'encrypt'])

    expect(result).toBe(mockEncryptedValue)
  })

  it('should be able to decrypt an encrypted string', async () => {
    const result = await main([...argvBase, 'decrypt'])

    expect(result).toBe(mockDecryptedValue)
  })

  it('should print usage info if no command specified', async () => {
    process.stdout.columns = undefined // tslint:disable-line no-object-mutation

    jest.resetAllMocks()
    jest.resetModules()
    jest.resetModuleRegistry()

    const consoleSpy = jest.spyOn(console, 'info')
    const cli = require('./cli')

    const result = await cli.main()

    expect(result).toBe(undefined)
    expect(consoleSpy).toHaveBeenCalled()
    expect(consoleSpy.mock.calls[0][0]).toContain('Usage:')
  })
})
