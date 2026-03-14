#!/bin/bash
set -e

echo "=== Buildeando frontend ==="
cd frontend
npm run build
cd ..

echo "=== Desplegando frontend stack ==="
cd infra
cdk deploy HackathonFrontend --require-approval never
