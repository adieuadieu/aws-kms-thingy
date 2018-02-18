import { KMS } from 'aws-sdk'

const kms = new KMS()
export const decryptedDictionary = new Map()

const isBase64 = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/

async function decrypt(ciphertext: string): Promise<string> {
  const params = { CiphertextBlob: Buffer.from(ciphertext, 'base64') }
  const result = await kms.decrypt(params).promise()
  const decrypted = result.Plaintext ? result.Plaintext.toString() : ciphertext

  return decryptedDictionary.set(ciphertext, decrypted) && decrypted
}

export default (ciphertext: string): Promise<string> =>
  // we shouldn't decrypt?
  (process.env.DISABLE_KMS_DECRYPTION && ciphertext) ||
  // not a base64 encoded ciphertext?
  (!isBase64.test(ciphertext) && ciphertext) ||
  // previously decrypted and in cache?
  decryptedDictionary.get(ciphertext) ||
  // decrypt it
  decrypt(ciphertext)
