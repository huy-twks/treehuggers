#!/usr/bin/env bash

set -euo pipefail

step () {
  printf "š· $1 \n"
}

question () {
  printf "ā $1 \n"
}

warn () {
  printf "ā $1 \n"
}

success () {
  printf "\nšŗ $1 \n\n"
}