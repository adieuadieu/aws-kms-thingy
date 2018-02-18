import kmsDecrypt from './decrypt'
import kmsEncrypt, { InterfaceEncryptParameters } from './encrypt'

export const encrypt = (
  parameters:
    | InterfaceEncryptParameters
    | ReadonlyArray<InterfaceEncryptParameters>,
) =>
  'plaintext' in parameters
    ? kmsEncrypt(parameters)
    : Promise.all(parameters.map(kmsEncrypt))

export const decrypt = (ciphertext: string | ReadonlyArray<string>) =>
  typeof ciphertext === 'undefined'
    ? undefined // useful in development when process.env.SECRET may be unset
    : typeof ciphertext === 'string'
      ? kmsDecrypt(ciphertext)
      : Promise.all(ciphertext.map(kmsDecrypt))
