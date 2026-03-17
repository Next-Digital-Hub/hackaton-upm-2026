#!/bin/bash
set -e

echo "=== Obteniendo credenciales AWS ==="
ada credentials update --account=537090272297 --provider=conduit --role=IibsAdminAccess-DO-NOT-DELETE --once

export CDK_DOCKER=finch

echo "=== Buildeando backend ==="
cd backend
./mvnw clean package -DskipTests
cd ..

echo "=== Buildeando frontend ==="
cd frontend
npm run build
cd ..

echo "=== Desplegando ambos stacks con CDK ==="
cd infra
cdk deploy --all --require-approval never
