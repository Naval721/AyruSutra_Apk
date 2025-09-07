#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AyurSutraBackendStack } from './cdk-stack';

const app = new cdk.App();
new AyurSutraBackendStack(app, 'AyurSutraBackendStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
});

