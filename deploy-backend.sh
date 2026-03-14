#!/bin/bash
set -e

export CDK_DOCKER=finch

echo "=== Buildeando backend ==="
cd backend
./mvnw clean package -DskipTests
cd ..

echo "=== Desplegando backend stack ==="
cd infra
cdk deploy HackathonBackend --require-approval never
