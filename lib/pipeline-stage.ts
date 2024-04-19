import { AcmsSharedStack } from "./acms-shared-stack";
import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);

    const acmsSharedStack = new AcmsSharedStack(this, "AcmsSharedStack");

  }
}
