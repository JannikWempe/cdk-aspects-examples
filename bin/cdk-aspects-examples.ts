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

// 1) Apply changes

// appAspects.add(new ApplyTags({
//   stage: 'dev',
//   project: 'CDK Aspects',
//   owner: 'Jannik Wempe'
// }));

// appAspects.add(new EnableBucketVersioning());

// https://github.com/aws/aws-cdk/blob/f834a4537643b32131076111be0693c6f8f96b24/packages/@aws-cdk/aws-redshift/test/integ.cluster-elasticip.ts#L10-L16


// 2) Throw errors

// appAspects.add(new EnforceMinimumLambdaNodeRuntimeVersion(Runtime.NODEJS_14_X));

// appAspects.add(new AwsSolutionsChecks());



// 4) Add resources

appAspects.add(new LambdaLogGroupConfig({
  retention: RetentionDays.ONE_DAY
}));