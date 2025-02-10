#!/bin/sh

# Decrypt the file
mkdir -p $HOME/secrets
gpg --quiet --batch --yes --decrypt --passphrase="$ENV_PASSPHRASE" \
--output $HOME/secrets/.env .env.gpg