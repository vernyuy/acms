import { AcmsSharedStack } from "./acms-shared-stack";
import { Stage, StageProps } from "aws-cdk-lib";
import { UserLamdaStacks } from "./user-stack";
import { BuildingLamdaStacks } from "./building-stack";
import { ApartmentLamdaStacks } from "./apartment-stack";
import { Construct } from "constructs";

export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);

    const acmsSharedStack = new AcmsSharedStack(this, "AcmsSharedStack");

    new UserLamdaStacks(this, "UserLambdaStacks", {
        acmsDatabase: acmsSharedStack.acmsDatabase,
        acmsGraphqlApi: acmsSharedStack.acmsGraphqlApi,
      });

      new BuildingLamdaStacks(this, "BuildingLambdaStacks", {
        acmsDatabase: acmsSharedStack.acmsDatabase,
        acmsGraphqlApi: acmsSharedStack.acmsGraphqlApi,
      });

      new ApartmentLamdaStacks(this, "ApartmentLambdaStacks", {
        acmsDatabase: acmsSharedStack.acmsDatabase,
        acmsGraphqlApi: acmsSharedStack.acmsGraphqlApi,
      });
  }
}
