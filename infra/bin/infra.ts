#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { BackendStack } from "../lib/backend-stack";
import { FrontendStack } from "../lib/frontend-stack";

const app = new cdk.App();
const env = { region: "us-east-1" };

const backend = new BackendStack(app, "HackathonBackend", { env });

new FrontendStack(app, "HackathonFrontend", {
  env,
  backendUrl: backend.backendUrl,
});
