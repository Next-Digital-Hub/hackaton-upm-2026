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

echo "=== Desplegando con CDK (usando finch) ==="
cd infra
cdk deploy --require-approval never
