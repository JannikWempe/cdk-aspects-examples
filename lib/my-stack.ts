import * as path from 'path';

import * as cdk from 'aws-cdk-lib';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket, EventType } from 'aws-cdk-lib/aws-s3';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { SqsDestination } from 'aws-cdk-lib/aws-s3-notifications';

export class MyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new Queue(this, 'MyQueue', {
      visibilityTimeout: Duration.seconds(300)
    });
    
    const bucket = new Bucket(this, 'MyBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const myLambda1 = new NodejsFunction(this, 'MyLambda1', {
      entry: path.join(__dirname, 'lambda', 'index.ts'),
      runtime: Runtime.NODEJS_16_X,
      // Make EnforceMinimumLambdaNodeRuntimeVersion fail:
      // runtime: Runtime.NODEJS_12_X
    });

    bucket.addEventNotification(EventType.OBJECT_CREATED, new SqsDestination(queue));
    myLambda1.addEventSource(new SqsEventSource(queue));
    
    
    new NodejsFunction(this, 'MyLambda2', {
      entry: path.join(__dirname, 'lambda', 'index.ts'),
      runtime: Runtime.NODEJS_16_X
    });
  }

}
