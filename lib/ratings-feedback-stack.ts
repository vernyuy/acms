import { Stack, StackProps } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import * as appsync from "aws-cdk-lib/aws-appsync";
import { bundleAppSyncResolver } from "./helpers";
import { join } from "path";

interface RatingsAndFeedbackStackProps extends StackProps {
  acmsGraphqlApi: appsync.GraphqlApi;
  acmsDatabase: Table;
}

export class RatingsAndFeedbackStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: RatingsAndFeedbackStackProps
  ) {
    super(scope, id, props);

    const { acmsDatabase, acmsGraphqlApi } = props;

    const leaveFeedback = new appsync.AppsyncFunction(this, "leaveFeedback", {
      name: "leaveFeedback",
      api: acmsGraphqlApi,
      dataSource: acmsGraphqlApi.addDynamoDbDataSource(
        "acmsFeedbackDataSource",
        acmsDatabase
      ),
      code: bundleAppSyncResolver(
        "src/resolvers/ratingsAndFeedback/leaveFeedback.ts"
      ),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    new appsync.Resolver(this, "leaveFeedbackResolver", {
      api: acmsGraphqlApi,
      typeName: "Mutation",
      fieldName: "leaveFeedback",
      code: appsync.Code.fromAsset(
        join(__dirname, "./js_resolvers/_before_and_after_mapping_template.js")
      ),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [leaveFeedback],
    });

    const getApartmentFeedback = new appsync.AppsyncFunction(
      this,
      "ApartmentFeedback",
      {
        name: "getApartmentFeedback",
        api: acmsGraphqlApi,
        dataSource: acmsGraphqlApi.addDynamoDbDataSource(
          "FeedbackDataSource",
          acmsDatabase
        ),
        code: bundleAppSyncResolver(
          "src/resolvers/ratingsAndFeedback/getApartmentFeedback.ts"
        ),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    new appsync.Resolver(this, "getApartmentFeedbackResolver", {
      api: acmsGraphqlApi,
      typeName: "Query",
      fieldName: "getApartmentFeedback",
      code: appsync.Code.fromAsset(
        join(__dirname, "./js_resolvers/_before_and_after_mapping_template.js")
      ),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [getApartmentFeedback],
    });
  }
}
