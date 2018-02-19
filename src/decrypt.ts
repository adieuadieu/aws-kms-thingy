import { KMS } from 'aws-sdk'

const kms = new KMS()

const isBase64 = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/

export const dictionary = new Map()

async function decrypt(ciphertext: string): Promise<string> {
  const result = await kms
    .decrypt({ CiphertextBlob: Buffer.from(ciphertext, 'base64') })
    .promise()
  const plaintext = result.Plaintext ? result.Plaintext.toString() : ciphertext

  return dictionary.set(ciphertext, plaintext) && plaintext
}

export default (ciphertext: string): Promise<string> | string =>
  ciphertext.length === 0 || // empty string?
  process.env.DISABLE_AWS_KMS_THINGY || // we shouldn't decrypt?
  !isBase64.test(ciphertext) // not a base64 encoded ciphertext?
    ? String(ciphertext)
    : // previously decrypted and in cache?
      dictionary.get(ciphertext) ||
      // decrypt it
      decrypt(ciphertext)
