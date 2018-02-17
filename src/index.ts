import kmsDecrypt from './decrypt'
import kmsEncrypt from './encrypt'

type Action = (
  textOrCiphertext: string | ReadonlyArray<string>,
) => Promise<string | ReadonlyArray<string>>

type KmsAction = (text: string) => Promise<string>

const partial = (fn: KmsAction): Action => textOrCiphertext =>
  typeof textOrCiphertext === 'string'
    ? fn(textOrCiphertext)
    : Promise.all(textOrCiphertext.map(fn))

export const encrypt = partial(kmsEncrypt)
export const decrypt = partial(kmsDecrypt)
