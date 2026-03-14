import * as cdk from "aws-cdk-lib/core";
import * as ecr_assets from "aws-cdk-lib/aws-ecr-assets";
import * as apprunner from "aws-cdk-lib/aws-apprunner";
import * as iam from "aws-cdk-lib/aws-iam";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";
import { Construct } from "constructs";

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
    const librosTable = new dynamodb.Table(this, "LibrosTable", {
      tableName: "hackathon-libros",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    librosTable.grantReadWriteData(instanceRole);

    // --- App Runner ---
    const backendService = new apprunner.CfnService(this, "BackendService", {
      serviceName: "hackathon-backend",
      sourceConfiguration: {
        authenticationConfiguration: { accessRoleArn: accessRole.roleArn },
        imageRepository: {
          imageIdentifier: backendImage.imageUri,
          imageRepositoryType: "ECR",
          imageConfiguration: { port: "8080" },
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
