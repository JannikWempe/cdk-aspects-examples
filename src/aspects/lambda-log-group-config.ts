import { IAspect } from 'aws-cdk-lib';
import { CfnFunction } from 'aws-cdk-lib/aws-lambda';
import { LogGroup, LogGroupProps } from 'aws-cdk-lib/aws-logs';

import { IConstruct } from 'constructs';

/**
 * Configures the log group for all Lambda functions.
 */
export class LambdaLogGroupConfig implements IAspect {
  #logGroupProps?: Omit<LogGroupProps, "logGroupName">;

  constructor(logGroupProps?: Omit<LogGroupProps, "logGroupName">) {
    this.#logGroupProps = logGroupProps;
  }

  visit(node: IConstruct): void {
    if (node instanceof CfnFunction) {
    console.log(`Adding log group for Lambda function ${node.node.path}`);

      this.createLambdaLogGroup(node);
    }
  }

  private createLambdaLogGroup(lambda: CfnFunction) {
    console.log(`Lambda functionName: ${lambda.functionName}`);
    
    new LogGroup(lambda, `LogGroup`, {
      ...this.#logGroupProps,
      logGroupName: `/aws/lambda/${lambda.ref}`,
    });
  }
}