import { Annotations, IAspect } from "aws-cdk-lib";
import { CfnFunction, Runtime, RuntimeFamily } from "aws-cdk-lib/aws-lambda";
import { IConstruct } from "constructs";

export class EnforceMinimumLambdaNodeRuntimeVersion implements IAspect {
  #minimumNodeRuntimeVersion: Runtime;

  constructor(minimumNodeRuntimeVersion: Runtime) {
    if (minimumNodeRuntimeVersion.family !== RuntimeFamily.NODEJS) {
      throw new Error('Minimum NodeJS runtime version must be a NodeJS runtime');
    }
    this.#minimumNodeRuntimeVersion = minimumNodeRuntimeVersion;
  }

  visit(node: IConstruct) {
    if (node instanceof CfnFunction) {

      // runtime is optional for functions not being deployed from a package
      if (!node.runtime) {
        throw new Error(`Runtime not specified for ${node.node.path}`);
      }

      if (!node.runtime.includes('nodejs')) return;

      const actualNodeJsRuntimeVersion = this.parseNodeRuntimeVersion(node.runtime);
      const minimumNodeJsRuntimeVersion = this.parseNodeRuntimeVersion(this.#minimumNodeRuntimeVersion.name);

      if (actualNodeJsRuntimeVersion < minimumNodeJsRuntimeVersion) {
        Annotations
          .of(node)
          // .addDeprecation('Lambda Runtime', `Node.js runtime version ${node.runtime} is less than the minimum version ${this.#minimumNodeRuntimeVersion.name}.`)
          .addError(`Node.js runtime version ${node.runtime} is less than the minimum version ${this.#minimumNodeRuntimeVersion.name}.`);
      }
    }
}

  private parseNodeRuntimeVersion(runtimeName: string): number {
    const runtimeVersion = runtimeName.replace('nodejs', '').split('.')[0];
    return +runtimeVersion;
  }
}