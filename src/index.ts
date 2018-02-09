
export default async function decrypt(
  ciphertext: string | ReadonlyArray<string>
): Promise<string | ReadonlyArray<string>> {
  if (typeof ciphertext === 'string') {
    return kmsDecrypt(ciphertext)
  }

  return Promise.all(ciphertext.map(kmsDecrypt))
}
