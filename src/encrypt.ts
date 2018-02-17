import { KMS } from 'aws-sdk'

const kms = new KMS()

export default async function kmsEncrypt(text: string): Promise<string> {
  return kms.encrypt({ text }).promise()
}
