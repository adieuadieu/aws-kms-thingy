#!/usr/bin/env node
// tslint:disable no-console
import * as readline from 'readline'
import * as lib from './'
import { IndexSignature } from './types'

const COLUMNS = process.stdout.columns || 32

const askQuestion = (
  question: string,
  prompt: string = '→',
  sensitive: boolean = false,
): Promise<string> => {
  const line = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise(resolve =>
    line.question(
      `\n${question}:\n\n${prompt} `,
      answer =>
        !line.close() &&
        (sensitive
          ? !readline.moveCursor(process.stdin, 0, -1) &&
            !readline.clearLine(process.stdin, 0) &&
            !console.log(prompt + '  ' + '*'.repeat(answer.length))
          : true) &&
        resolve(answer.trim()),
    ),
  )
}

const printUsageText = () =>
  console.info(`
Usage: aws-kms-thingy [command]

Commands:
  - encrypt       Encrypt a string with an AWS KMS key
  - decrypt       Decrypt ciphertext encrypted with AWS KMS
`)

const prettyResult = (title: string, text: string) =>
  !console.log(
    `\n${'〰️'.repeat(
      (COLUMNS - (title.length + 2)) / 4,
    )} ${title} ${'〰️'.repeat((COLUMNS - (title.length + 2)) / 4)}\n`,
    text,
    `\n${'〰️'.repeat(COLUMNS / 2)}\n`,
  ) && text

async function encrypt(): Promise<string | ReadonlyArray<string>> {
  const keyId =
    process.env.AWS_KMS_KEY_ARN ||
    (await askQuestion('Please enter AWS KMS Key ARN to use'))
  const plaintext = await askQuestion('Enter plain text to encrypt', '🔓', true)
  const result = (await lib.encrypt({ keyId, plaintext })) as string

  return prettyResult('🔐 Encrypted', result)
}

async function decrypt(): Promise<string | ReadonlyArray<string>> {
  const ciphertext = await askQuestion('Enter ciphertext to decrypt', '🔐')
  const result = (await lib.decrypt(ciphertext)) as string

  return prettyResult('🔓 Decrypted', result)
}

export async function main([, , action] = process.argv): Promise<string> {
  const actions: IndexSignature = {
    decrypt,
    encrypt,
  }

  return action && action in actions
    ? !console.log(`aws-kms-thingy ${action}`) && actions[action]()
    : printUsageText()
}

// tslint:disable-next-line no-unused-expression no-expression-statement
main().catch(console.error) // ¯\_(ツ)_/¯
