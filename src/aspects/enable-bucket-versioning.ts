import { IAspect } from "aws-cdk-lib";
import { CfnBucket } from "aws-cdk-lib/aws-s3";
import { IConstruct } from "constructs";

export class EnableBucketVersioning implements IAspect {
  
  visit(node: IConstruct): void {
    if (node instanceof CfnBucket) {
      console.log(`Enabling bucket versioning for ${node.node.path}`);
      node.versioningConfiguration = {
        status: 'Enabled',
      };
    }
  }
}