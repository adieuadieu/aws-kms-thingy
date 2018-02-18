// tslint:disable no-expression-statement
import kmsDecrypt, { decryptedDictionary } from './decrypt'

const mockDecryptedValue = 'foobar'
const mockEncryptedValue = Buffer.from(mockDecryptedValue).toString('base64')

describe('decrypt()', () => {
  it('should decrypt an encrypted string', async () => {
    const result = await kmsDecrypt(mockEncryptedValue)

    expect(result).toBe(mockDecryptedValue)
  })

  it('should use cache if item exists in cache', async () => {
    const encryptedValue = Buffer.from('foobar').toString('base64')

    decryptedDictionary.clear()
    decryptedDictionary.set(encryptedValue, 'cached')

    const result = await kmsDecrypt(encryptedValue)

    expect(result).toBe('cached')
  })

  it('should return value as is if not a base64 encoded secret', async () => {
    const result = await kmsDecrypt(mockDecryptedValue)

    expect(result).toBe(mockDecryptedValue)
  })

  it('should return original value if error occurred decrypting with SDK', async () => {
    const mockError = Buffer.from('mockError').toString('base64')
    const result = await kmsDecrypt(mockError)

    expect(result).toBe(mockError)
  })

  it('should return value as is if DISABLE_KMS_DECRYPTION is set', async () => {
    // tslint:disable-next-line no-object-mutation
    process.env.DISABLE_KMS_DECRYPTION = 'true'

    const result = await kmsDecrypt(mockEncryptedValue)

    expect(result).toBe(mockEncryptedValue)

    // tslint:disable-next-line no-object-mutation no-delete
    delete process.env.DISABLE_KMS_DECRYPTION
  })
})
