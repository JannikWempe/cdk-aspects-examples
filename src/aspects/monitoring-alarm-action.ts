import { IAspect } from "aws-cdk-lib";
import { Alarm, AlarmProps } from "aws-cdk-lib/aws-cloudwatch";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import { Topic } from "aws-cdk-lib/aws-sns";
import { Construct, IConstruct } from "constructs";

export class MonitoringAlarmAction implements IAspect {

  constructor() {}

  public visit(node: IConstruct): void {
    if (node instanceof MonitoringAlarm) {
      const action = new SnsAction(
        Topic.fromTopicArn(
          node,
          'AlarmTopic',
          'my-topic-arn' // TODO: replace with actual topic ARN
        )
      );
      node.addAlarmAction(action);
    }
  }
}

/**
 * Alarm that will be connected to the Alerter by
 */
export class MonitoringAlarm extends Alarm {
  constructor(scope: Construct, id: string, props: AlarmProps) {
    super(scope, id, props);
  }
}