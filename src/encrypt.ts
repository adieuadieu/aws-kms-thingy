import { KMS } from 'aws-sdk' // tslint:disable-line:no-implicit-dependencies

const kms = new KMS()

export const dictionary = new Map()

export interface InterfaceEncryptParameters {
  readonly plaintext: string
  readonly keyId: string
}

async function encrypt({
  plaintext,
  keyId,
}: InterfaceEncryptParameters): Promise<string> {
  const result = await kms
    .encrypt({ KeyId: keyId, Plaintext: plaintext })
    .promise()

  const ciphertext = result.CiphertextBlob
    ? (result.CiphertextBlob as Buffer).toString('base64')
    : plaintext

  return dictionary.set(plaintext, ciphertext) && ciphertext
}

export default ({
  plaintext,
  keyId,
}: InterfaceEncryptParameters): Promise<string> | string =>
  process.env.DISABLE_AWS_KMS_THINGY // we shouldn't encrypt?
    ? String(plaintext)
    : // previously encrypted and in cache?
      dictionary.get(keyId + plaintext) ||
      // encrypt it
      encrypt({ plaintext, keyId })
