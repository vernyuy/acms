import { Stack, StackProps } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import * as appsync from "aws-cdk-lib/aws-appsync";
import { bundleAppSyncResolver } from "./helpers";
import { join } from "path";

interface ApartmentLambdaStackProps extends StackProps {
  acmsGraphqlApi: appsync.GraphqlApi;
  acmsDatabase: Table;
}

export class ApartmentLamdaStacks extends Stack {
  constructor(scope: Construct, id: string, props: ApartmentLambdaStackProps) {
    super(scope, id, props);

    const { acmsDatabase, acmsGraphqlApi } = props;

    const apartmentFunction = new appsync.AppsyncFunction(
      this,
      "createApartment",
      {
        name: "createApartment",
        api: acmsGraphqlApi,
        dataSource: acmsGraphqlApi.addDynamoDbDataSource(
          "createApartment",
          acmsDatabase,
        ),
        code: bundleAppSyncResolver(
          "src/resolvers/apartment/createApartment.ts",
        ),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      },
    );

    new appsync.Resolver(this, "createApartmentResolver", {
      api: acmsGraphqlApi,
      typeName: "Mutation",
      fieldName: "createApartment",
      code: appsync.Code.fromAsset(
        join(__dirname, "./js_resolvers/_before_and_after_mapping_template.js"),
      ),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [apartmentFunction],
    });

    const getAllApartmentsPerBuilding = new appsync.AppsyncFunction(
      this,
      "getAllApartmentsPerBuilding",
      {
        name: "getAllApartmentsPerBuilding",
        api: acmsGraphqlApi,
        dataSource: acmsGraphqlApi.addDynamoDbDataSource(
          "getAllApartmentsPerBuilding",
          acmsDatabase,
        ),
        code: bundleAppSyncResolver(
          "src/resolvers/apartment/getAllApartmentsPerBuilding.ts",
        ),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      },
    );

    new appsync.Resolver(this, "getAllApartmentsPerBuildingResolver", {
      api: acmsGraphqlApi,
      typeName: "Query",
      fieldName: "getAllApartmentsPerBuilding",
      code: appsync.Code.fromAsset(
        join(__dirname, "./js_resolvers/_before_and_after_mapping_template.js"),
      ),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [getAllApartmentsPerBuilding],
    });
  }
}
