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

    // Tests the ReadonlyArray<string> overload
    const [zero, one, two, three] = result

    expect(zero).toEqual(mockArrayOfEncryptedValues[0])
    expect(one).toEqual(mockArrayOfEncryptedValues[1])
    expect(two).toEqual(mockArrayOfEncryptedValues[2])
    expect(three).toEqual(mockArrayOfEncryptedValues[3])
  })

  it('should decrypt an encrypted string', async () => {
    const result = await decrypt(mockEncryptedValue)

    expect(result).toBe(mockDecryptedValue)
  })

  it('should decrypt an array of encrypted strings', async () => {
    const result = await decrypt(mockArrayOfEncryptedValues)

    expect(result).toEqual(mockArrayOfDecryptedValues)

    // Tests the ReadonlyArray<string> overload
    const [zero, one, two, three] = result

    expect(zero).toEqual(mockArrayOfDecryptedValues[0])
    expect(one).toEqual(mockArrayOfDecryptedValues[1])
    expect(two).toEqual(mockArrayOfDecryptedValues[2])
    expect(three).toEqual(mockArrayOfDecryptedValues[3])
  })

  it('should be able to handle empty or undefined parameters', async () => {
    expect(await decrypt(undefined)).toBe(undefined)
    expect(await decrypt('')).toBe('')
  })
})
