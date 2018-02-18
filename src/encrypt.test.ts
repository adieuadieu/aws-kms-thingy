// tslint:disable no-expression-statement
import kmsEncrypt, { dictionary } from './encrypt'

const mockDecryptedValue = 'foobar'
const mockEncryptedValue = Buffer.from(mockDecryptedValue).toString('base64')
const keyId = 'foobar-key'

const mock = (plaintext: string) => ({ keyId, plaintext })

describe('encrypt()', () => {
  it('should encrypt a string and store it in cache', async () => {
    const result = await kmsEncrypt(mock(mockDecryptedValue))

    expect(result).toBe(mockEncryptedValue)
    expect(dictionary.get(mockDecryptedValue)).toBe(mockEncryptedValue)
  })

  it('should use cache if item exists in cache', async () => {
    dictionary.clear()
    dictionary.set(keyId + mockDecryptedValue, 'cached')

    const result = await kmsEncrypt(mock(mockDecryptedValue))

    expect(result).toBe('cached')
  })

  it('should return original value if error occurred encrypting with SDK', async () => {
    const mockError = 'mockError'
    const result = await kmsEncrypt(mock(mockError))

    expect(result).toBe(mockError)
  })

  it('should return value as is if DISABLE_AWS_KMS_THINGY is set', async () => {
    // tslint:disable-next-line no-object-mutation
    process.env.DISABLE_AWS_KMS_THINGY = 'true'

    const result = await kmsEncrypt(mock(mockDecryptedValue))

    expect(result).toBe(mockDecryptedValue)

    // tslint:disable-next-line no-object-mutation no-delete
    delete process.env.DISABLE_AWS_KMS_THINGY
  })
})
