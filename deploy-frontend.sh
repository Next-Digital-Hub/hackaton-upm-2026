#!/bin/bash
set -e

echo "=== Obteniendo credenciales AWS ==="
ada credentials update --account=537090272297 --provider=conduit --role=IibsAdminAccess-DO-NOT-DELETE --once

echo "=== Buildeando frontend ==="
cd frontend
npm run build
cd ..

echo "=== Desplegando frontend stack ==="
cd infra
cdk deploy HackathonFrontend --require-approval never
