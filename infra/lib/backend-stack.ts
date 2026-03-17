import * as cdk from "aws-cdk-lib/core";
import * as ecr_assets from "aws-cdk-lib/aws-ecr-assets";
import * as apprunner from "aws-cdk-lib/aws-apprunner";
import * as iam from "aws-cdk-lib/aws-iam";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";
import * as fs from "fs";
import { Construct } from "constructs";

/** Lee un fichero .env y devuelve un Record<string, string> */
function loadEnv(filePath: string): Record<string, string> {
  const env: Record<string, string> = {};
  if (!fs.existsSync(filePath)) return env;
  const lines = fs.readFileSync(filePath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    env[trimmed.substring(0, idx)] = trimmed.substring(idx + 1);
  }
  return env;
}

export class BackendStack extends cdk.Stack {
  /** URL del servicio App Runner, consumida por FrontendStack */
  public readonly backendUrl: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // --- Docker image for App Runner ---
    const backendImage = new ecr_assets.DockerImageAsset(this, "BackendImage", {
      directory: path.join(__dirname, "../../backend"),
      platform: ecr_assets.Platform.LINUX_AMD64,
    });

    // IAM roles
    const accessRole = new iam.Role(this, "AppRunnerAccessRole", {
      assumedBy: new iam.ServicePrincipal("build.apprunner.amazonaws.com"),
    });
    backendImage.repository.grantPull(accessRole);

    const instanceRole = new iam.Role(this, "AppRunnerInstanceRole", {
      assumedBy: new iam.ServicePrincipal("tasks.apprunner.amazonaws.com"),
    });

    instanceRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["bedrock:InvokeModel"],
        resources: ["*"],
      })
    );

    // --- DynamoDB ---
    const usuariosTable = new dynamodb.Table(this, "UsuariosTable", {
      tableName: "hackathon-usuarios",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    usuariosTable.grantReadWriteData(instanceRole);

    const condicionesUsuarioTable = new dynamodb.Table(this, "CondicionesUsuarioTable", {
      tableName: "hackathon-condiciones-usuario",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    condicionesUsuarioTable.grantReadWriteData(instanceRole);

    const alertasTable = new dynamodb.Table(this, "AlertasTable", {
      tableName: "hackathon-alertas",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    alertasTable.grantReadWriteData(instanceRole);

    const llmCallsTable = new dynamodb.Table(this, "LLMCallsTable", {
      tableName: "hackathon-llm-calls",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    llmCallsTable.grantReadWriteData(instanceRole);
    
    const condicionesClimaticaTable = new dynamodb.Table(this, "CondicionesClimaticaTable", {
      tableName: "hackathon-condiciones-climatica",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    condicionesClimaticaTable.grantReadWriteData(instanceRole);

    // --- App Runner ---
    const envVars = loadEnv(path.join(__dirname, "../../.env"));

    const runtimeEnv: apprunner.CfnService.KeyValuePairProperty[] = Object.entries(envVars).map(
      ([name, value]) => ({ name, value })
    );

    const backendService = new apprunner.CfnService(this, "BackendService", {
      serviceName: "hackathon-backend",
      sourceConfiguration: {
        authenticationConfiguration: { accessRoleArn: accessRole.roleArn },
        imageRepository: {
          imageIdentifier: backendImage.imageUri,
          imageRepositoryType: "ECR",
          imageConfiguration: {
            port: "8080",
            runtimeEnvironmentVariables: runtimeEnv,
          },
        },
      },
      instanceConfiguration: {
        cpu: "1 vCPU",
        memory: "2 GB",
        instanceRoleArn: instanceRole.roleArn,
      },
    });

    this.backendUrl = backendService.attrServiceUrl;

    new cdk.CfnOutput(this, "AppRunnerURL", {
      value: `https://${backendService.attrServiceUrl}`,
      description: "URL directa del backend (App Runner)",
    });
  }
}
