# aws-kms-thingy

Convenience wrapper around the AWS Node.js SDK to simplify encrypting/decrypting secrets with the AWS KMS service. Suitable for use with AWS Lambda.

[![CircleCI](https://img.shields.io/circleci/project/github/adieuadieu/aws-kms-thingy/master.svg?style=flat-square)](https://circleci.com/gh/adieuadieu/aws-kms-thingy)
[![GitHub release](https://img.shields.io/github/release/adieuadieu/aws-kms-thingy.svg?style=flat-square)](https://github.com/adieuadieu/aws-kms-thingy)

## Contents

1. [Features](#features)
1. [Usage](#usage)
   1. [With the CLI](#with-the-cli)
   1. [With AWS Lambda](#with-aws-lambda)
   1. [With Multiple Secrets](#with-multiple-secrets)
   1. [Locally In Development](#locally-in-development)
1. [API](#api)
1. [Related Thingies](#related-thingies)
1. [License](#license)

### Features

* Unencrypted strings simply returned, useful for testing/local development
* Encrypt/decrypt multiple values in one go
* Results are cached, so multiple decrypt/encrypt calls incur only a single call to the AWS SDK
* CLI to encrypt/decrypt secrets
* Well tested

## Usage

The module assumes that the Amazon SDK has access to AWS credentials that are able to access the KMS key used for encryption and decryption.

```bash
npm install aws-kms-thingy
```

### With the CLI

Encrypt with:

```bash
aws-kms-thingy encrypt
```

You'll be prompted for the string to encrypt.

Decrypt with:

```bash
aws-kms-thingy decrypt
```

You'll be prompted for the encrypted string to decrypt.

### With AWS Lambda

Safe to use within a Lambda handler. After cold-start, decrypted values are cached so subsequent invocations won't incur an AWS KMS API call:

```javascript
const { decrypt } = require('aws-kms-thingy')

module.exports.myLambdaHandler = (event, context, callback) => {
  decrypt(process.env.SOME_API_TOKEN) // Only incurs network call on cold-start
    .then(doStuffWithDecryptedApiToken)
    .then(resultOrWhatever => callback(null, resultOrWhatever))
    .catch(callback)
}
```

### With Multiple Secrets

Decrypt multiple values in parallel

```typescript
import { decrypt } from 'aws-kms-thingy'

const [
  decryptedApiToken1,
  decryptedApiToken2,
  decryptedDatabasePassword,
  somethingElseSecret,
] = await decrypt([
  process.env.API_TOKEN_1,
  process.env.API_TOKEN_2,
  process.env.DATABASE_PASSWORD,
  process.env.SOMETHING_ELSE_SECRET,
])
```

### Locally In Development

Providing a non-base64 encoded value will skip en/decrypting with AWS KMS and just return the same value. This is useful in local development where you may not be necessary to have your secrets encrypted. This helps to avoid the need to write development environment exception code:

```typescript
import { decrypt } from 'aws-kms-thingy'

process.env.DATABASE_PASSWORD = 'foobar'

const dbPassword = await decrypt(process.env.DATABASE_PASSWORD)

console.log(dbPassword) // "foobar"
```

An `undefined` value is also OK. This does nothing and returns undefined. Useful when environment variables are unset in local development.

```typescript
process.env.DATABASE_PASSWORD = undefined // e.g. not set in development

const dbPassword = await decrypt(process.env.DATABASE_PASSWORD)

console.log(dbPassword) // undefined
```

Alternatively, one can also disable en/decryption entirely with `DISABLE_AWS_KMS_THINGY` environment variable:

```typescript
import { decrypt } from 'aws-kms-thingy'

process.env.DISABLE_AWS_KMS_THINGY = 'true'

const token = await decrypt('aHR0cDovL2JpdC5seS8xVHFjd243')

console.log(token) // "aHR0cDovL2JpdC5seS8xVHFjd243"
```

## API

**Methods**

* [`encrypt(parameters)`](#api-encrypt)
* [`decrypt(ciphertext)`](#api-decrypt)

---

<a name="api-encrypt" />

### encrypt(parameters)

```typescript
interface InterfaceEncryptParameters {
  readonly plaintext: string
  readonly keyId: string
}

async function encrypt(
  parameters:
    | InterfaceEncryptParameters
    | ReadonlyArray<InterfaceEncryptParameters>,
): Promise<string | ReadonlyArray<string>>
```

Encrypt a plaintext string. Requires a AWS KMS key ID (or key Arn).

```js
const ciphertext = await encrypt({
  plaintext: 'secret text',
  keyId:
    'arn:aws:kms:eu-west-1:000000000000:key/55kkmm11-aann-99ff-mmaa-3322115566hh',
})
```

---

<a name="api-decrypt" />

### decrypt(ciphertext)

AWS KMS encrypted ciphertext contains metadata so it is not necessary to provide context or key ID.

```typescript
async function decrypt(
  ciphertext: undefined | string | ReadonlyArray<string>,
): Promise<undefined | string | ReadonlyArray<string>>
```

Decrypt KMS-encrypted ciphertext.

```js
const plaintext = await decrypt('aHR0cDovL2JpdC5seS8xVHFjd243')
```

## Related Thingies

* [aws-s3-thingy](https://github.com/adieuadieu/aws-s3-thingy)
* [alagarr](https://github.com/adieuadieu/alagarr) — AWS Lambda/API Gateway Request/Response Thingy
* [aws-kms-crypt](https://github.com/sjakthol/aws-kms-crypt)

## License

**aws-kms-thingy** © [Marco Lüthy](https://github.com/adieuadieu). Released under the [MIT](./LICENSE) license.<br>
Authored and maintained by Marco Lüthy with help from [contributors](https://github.com/adieuadieu/aws-kms-thingy/contributors).

> [github.com/adieuadieu](https://github.com/adieuadieu) · GitHub [@adieuadieu](https://github.com/adieuadieu) · Twitter [@adieuadieu](https://twitter.com/adieuadieu) · Medium [@marco.luethy](https://medium.com/@marco.luethy)
