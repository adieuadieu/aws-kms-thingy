#!/bin/sh

#
# Exports deployment configuration as environment variables.
#
# The deployment stage is identified based on the git tag:
# * Untagged commits go to staging.
# * Prerelease tags go to prerelease.
# * Other tags go to production.
# 
# Arguments after the end of options (identified by "--") are executed as
# command, which inherits the exported variables.
#
# Usage: ./kms-encrypt.sh string-to-encrypt
#

#set -e

cd "$(dirname "$0")/.."

PLAIN_TEXT=$1

if [ -z "$PLAIN_TEXT" ]; then
  printf "\nPlease provide plain text to encrypt.\n\n"
  exit 1
fi

if [ -z "$AWS_KMS_KEY_ARN" ]; then
  AWS_KMS_KEY_ARN=$(jq -r '.config.awsKmsKeyArn' package.json)

  if [ "$AWS_KMS_KEY_ARN" = "null" ]; then
    printf "\AWS_KMS_KEY_ARN environment variable not set, nor defined in package.json.\n\n"
    exit 1
  fi
fi

if [ -z "$AWS_REGION" ]; then
  AWS_REGION=$(jq -r '.config.awsRegion' package.json)

  if [ "$AWS_REGION" = "null" ]; then
    printf "\AWS_REGION environment variable not set, nor defined in package.json.\n\n"
    exit 1
  fi
fi


CYPHERTEXT=$(aws-vault exec allthings-deploy -- \
  aws kms encrypt \
  --region "$AWS_REGION" \
  --key-id "$AWS_KMS_KEY_ARN" \
  --plaintext "$PLAIN_TEXT" | \
  jq -r '.CiphertextBlob' \
)

if [ -n "$CYPHERTEXT" ]; then
  printf "\nUsing KMS key with Arn: %s\n\nDecrypted: %s\nEncrypted: %s\n\n" \
    "$AWS_KMS_KEY_ARN" "$PLAIN_TEXT" "$CYPHERTEXT"
fi
