#!/usr/bin/env bash

set -euo pipefail

step () {
  printf "🔷 $1 \n"
}

question () {
  printf "❓ $1 \n"
}

warn () {
  printf "⛔ $1 \n"
}

success () {
  printf "\n🍺 $1 \n\n"
}