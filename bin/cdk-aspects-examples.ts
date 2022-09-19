#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Aspects } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { AwsSolutionsChecks } from 'cdk-nag';
import 'source-map-support/register';
import { MyStack } from '../lib/my-stack';
import { ApplyTags } from '../src/aspects/apply-tags';
import { EnableBucketVersioning } from '../src/aspects/enable-bucket-versioning';
import { EnforceMinimumLambdaNodeRuntimeVersion } from '../src/aspects/enforce-minimum-lambda-node-runtime-version';
import { LambdaLogGroupConfig } from '../src/aspects/lambda-log-group-config';

const app = new cdk.App();
new MyStack(app, 'MyStack');

const appAspects = Aspects.of(app);

// apply our custom Aspects
appAspects.add(new LambdaLogGroupConfig({
  retention: RetentionDays.ONE_DAY
}));

appAspects.add(new ApplyTags({
  stage: 'dev',
  project: 'CDK Aspects',
  owner: 'Jannik Wempe'
}));

appAspects.add(new EnableBucketVersioning());

appAspects.add(new EnforceMinimumLambdaNodeRuntimeVersion(Runtime.NODEJS_14_X));

// use 3rd party
appAspects.add(new AwsSolutionsChecks());