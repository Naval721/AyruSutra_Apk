import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class AyurSutraBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Environment variables for all functions
    const commonEnvVars = {
      SUPABASE_URL: process.env.SUPABASE_URL || '',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
      FCM_SERVER_KEY: process.env.FCM_SERVER_KEY || '',
    };

    // HTTP Lambda Functions
    const assistantFunction = new lambda.Function(this, 'AssistantFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/assistant'),
      environment: commonEnvVars,
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
    });

    const dailyReportFunction = new lambda.Function(this, 'DailyReportFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/daily-report'),
      environment: commonEnvVars,
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
    });

    // Scheduled Lambda Functions
    const enqueueRemindersFunction = new lambda.Function(this, 'EnqueueRemindersFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/enqueue-reminders'),
      environment: {
        SUPABASE_URL: commonEnvVars.SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: commonEnvVars.SUPABASE_SERVICE_ROLE_KEY,
      },
      timeout: cdk.Duration.minutes(5),
      memorySize: 128,
    });

    const sendNotificationsFunction = new lambda.Function(this, 'SendNotificationsFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/send-notifications'),
      environment: commonEnvVars,
      timeout: cdk.Duration.minutes(5),
      memorySize: 256,
    });

    // API Gateway
    const api = new apigateway.RestApi(this, 'AyurSutraApi', {
      restApiName: 'AyurSutra Backend API',
      description: 'API for AyurSutra Guide backend services',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // Assistant endpoint
    const assistantIntegration = new apigateway.LambdaIntegration(assistantFunction);
    api.root.addResource('assistant').addMethod('POST', assistantIntegration);

    // Daily report endpoint
    const dailyReportIntegration = new apigateway.LambdaIntegration(dailyReportFunction);
    api.root.addResource('daily-report').addMethod('POST', dailyReportIntegration);

    // CloudWatch Events for scheduled functions
    const enqueueRemindersRule = new events.Rule(this, 'EnqueueRemindersRule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(5)),
      description: 'Trigger enqueue reminders every 5 minutes',
    });
    enqueueRemindersRule.addTarget(new targets.LambdaFunction(enqueueRemindersFunction));

    const sendNotificationsRule = new events.Rule(this, 'SendNotificationsRule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(5)),
      description: 'Trigger send notifications every 5 minutes',
    });
    sendNotificationsRule.addTarget(new targets.LambdaFunction(sendNotificationsFunction));

    // IAM permissions for Lambda functions
    assistantFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: ['*'],
    }));

    dailyReportFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: ['*'],
    }));

    enqueueRemindersFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: ['*'],
    }));

    sendNotificationsFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: ['*'],
    }));

    // Outputs
    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url,
      description: 'API Gateway URL for frontend integration',
    });

    new cdk.CfnOutput(this, 'AssistantFunctionName', {
      value: assistantFunction.functionName,
      description: 'Assistant Lambda function name',
    });

    new cdk.CfnOutput(this, 'DailyReportFunctionName', {
      value: dailyReportFunction.functionName,
      description: 'Daily Report Lambda function name',
    });
  }
}

