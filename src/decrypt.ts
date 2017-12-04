import { KMS } from 'aws-sdk'

const kms = new KMS()
const decryptedDictionary = new Map()
const isBase64 = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/

async function kmsDecrypt(ciphertext: string): Promise<string> {
  if (decryptedDictionary.has(ciphertext)) {
    return decryptedDictionary.get(ciphertext)
  } else if (!isBase64.test(ciphertext) || process.env.DISABLE_KMS_DECRYPTION) {
    // useful in development mode.
    // Pass an unencrypted string, get back the same string.
    return ciphertext
  }

  const params = { CiphertextBlob: Buffer.from(ciphertext, 'base64') }
  const result = await kms.decrypt(params).promise()
  const decrypted = result.Plaintext ? result.Plaintext.toString() : ciphertext

  // Don't know of any other way to Map.set() without
  // doing an expression-statement.. Could test for
  // success, but .set() always returns the Map, so it'd
  // be a useless test just to satisfy the linter, which is dumb.
  // tslint:disable no-expression-statement
  decryptedDictionary.set(ciphertext, decrypted)

  return decrypted
}
