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
  typeof ciphertext === 'string'
    ? kmsDecrypt(ciphertext)
    : Promise.all(ciphertext.map(kmsDecrypt))
