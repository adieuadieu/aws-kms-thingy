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
1. [Related Thingies](#related-thingies)
1. [License](#license)

### Features

* unencrypted strings simply returned, useful for testing/local development
* encrypt/decrypt multiple values in one go
* results are cached, so multiple decrypt/encrypt calls incur only a single call to the AWS SDK
* well tested

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

You'll be prompted for the encrypted string to decrypt

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

Alternatively, one can also disable en/decryption entirely with `DISABLE_AWS_KMS_THINGY` environment variable:

```typescript
import { decrypt } from 'aws-kms-thingy'

process.env.DISABLE_AWS_KMS_THINGY = 'true'

const token = await decrypt(
  'aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1ETHp4cnpGQ3lPcw==',
)

console.log(token) // "aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1ETHp4cnpGQ3lPcw=="
```

## Related Thingies

* [aws-s3-thingy](https://github.com/adieuadieu/aws-s3-thingy)
* [alagarr](https://github.com/adieuadieu/alagarr) — AWS Lambda/API Gateway Request/Response Thingy
* [aws-kms-crypt](https://github.com/sjakthol/aws-kms-crypt)

## License

**aws-kms-thingy** © [Marco Lüthy](https://github.com/adieuadieu). Released under the [MIT](./LICENSE) license.<br>
Authored and maintained by Marco Lüthy with help from [contributors](https://github.com/adieuadieu/aws-kms-thingy/contributors).

> [github.com/adieuadieu](https://github.com/adieuadieu) · GitHub [@adieuadieu](https://github.com/adieuadieu) · Twitter [@adieuadieu](https://twitter.com/adieuadieu) · Medium [@marco.luethy](https://medium.com/@marco.luethy)
