import kmsDecrypt from './decrypt'
import kmsEncrypt, { InterfaceEncryptParameters } from './encrypt'

export async function encrypt(
  parameters: InterfaceEncryptParameters,
): Promise<string>
export async function encrypt(
  parameters: ReadonlyArray<InterfaceEncryptParameters>,
): Promise<ReadonlyArray<string>>
export async function encrypt(parameters: any): Promise<any> {
  return 'plaintext' in parameters
    ? kmsEncrypt(parameters)
    : Promise.all(parameters.map(kmsEncrypt))
}

export async function decrypt(ciphertext: undefined): Promise<undefined>
export async function decrypt(ciphertext: string): Promise<string>
export async function decrypt(
  ciphertext: ReadonlyArray<string>,
): Promise<ReadonlyArray<string>>
export async function decrypt(ciphertext: any): Promise<any> {
  return typeof ciphertext === 'undefined'
    ? undefined // useful in development when process.env.SECRET may be unset
    : typeof ciphertext === 'string'
      ? kmsDecrypt(ciphertext)
      : Promise.all(ciphertext.map(kmsDecrypt))
}
