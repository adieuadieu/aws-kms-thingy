// tslint:disable no-expression-statement
import { decrypt, encrypt } from './'

const mockDecryptedValue = 'foobar'
const mockEncryptedValue = Buffer.from(mockDecryptedValue).toString('base64')

const mockArrayOfDecryptedValues: ReadonlyArray<string> = [
  'foobar-1',
  'foobar-2',
  'foobar-3',
  'foobar-4',
]

const mockArrayOfEncryptedValues: ReadonlyArray<string> = [
  Buffer.from(mockArrayOfDecryptedValues[0]).toString('base64'),
  Buffer.from(mockArrayOfDecryptedValues[1]).toString('base64'),
  Buffer.from(mockArrayOfDecryptedValues[2]).toString('base64'),
  Buffer.from(mockArrayOfDecryptedValues[3]).toString('base64'),
]

describe('lib', () => {
  it('should encrypt an string', async () => {
    const result = await encrypt({
      keyId: 'foobar-key',
      plaintext: mockDecryptedValue,
    })

    expect(result).toBe(mockEncryptedValue)
  })

  it('should encrypt an array of strings', async () => {
    const result = await encrypt(
      mockArrayOfDecryptedValues.map(item => ({
        keyId: 'foobar-key',
        plaintext: item,
      })),
    )

    expect(result).toEqual(mockArrayOfEncryptedValues)
  })

  it('should decrypt an encrypted string', async () => {
    const result = await decrypt(mockEncryptedValue)

    expect(result).toBe(mockDecryptedValue)
  })

  it('should decrypt an array of encrypted strings', async () => {
    const result = await decrypt(mockArrayOfEncryptedValues)

    expect(result).toEqual(mockArrayOfDecryptedValues)
  })
})
