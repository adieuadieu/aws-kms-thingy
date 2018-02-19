import kmsDecrypt from './decrypt'
import kmsEncrypt, { InterfaceEncryptParameters } from './encrypt'

export const encrypt = async (
  parameters:
    | InterfaceEncryptParameters
    | ReadonlyArray<InterfaceEncryptParameters>,
): Promise<string | ReadonlyArray<string>> =>
  'plaintext' in parameters
    ? kmsEncrypt(parameters)
    : Promise.all(parameters.map(kmsEncrypt))

export const decrypt = async (
  ciphertext: undefined | string | ReadonlyArray<string>,
): Promise<undefined | string | ReadonlyArray<string>> =>
  typeof ciphertext === 'undefined'
    ? undefined // useful in development when process.env.SECRET may be unset
    : typeof ciphertext === 'string'
      ? kmsDecrypt(ciphertext)
      : Promise.all(ciphertext.map(kmsDecrypt))
