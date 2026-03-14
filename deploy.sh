#!/bin/bash
set -e

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
