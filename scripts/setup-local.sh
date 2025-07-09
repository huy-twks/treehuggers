#!/bin/bash

set -euo pipefail

BASEDIR=$(dirname $0)
source $BASEDIR/shared.sh

step "Setup the base"
npm install
npm audit fix

step "Setup the frontend"
pushd ${BASEDIR}/../frontend
npm install
npm audit fix
popd

step "Setup the backend"
pushd ${BASEDIR}/../backend
npm install
npm audit fix
popd

success "Done"
