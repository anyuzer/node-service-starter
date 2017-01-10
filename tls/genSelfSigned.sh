#!/bin/sh
set -o errexit -o nounset

## Generate a local self signed TLS certificate

cd `dirname $0`

if test -d certs; then
  echo "Certs already exist"
  exit 0
fi

PASSPHRASE=${1:-''}

mkdir -p certs

certstrap --depot-path "certs" init --common-name "server-authority" --passphrase "${PASSPHRASE}"
certstrap --depot-path "certs" request-cert --common-name "server" --passphrase "${PASSPHRASE}"
certstrap --depot-path "certs" sign --CA "server-authority" --passphrase "${PASSPHRASE}" "server"

chmod a+r certs/*
