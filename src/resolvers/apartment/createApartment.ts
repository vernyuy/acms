import { Context, DynamoDBPutItemRequest, util } from "@aws-appsync/utils";
import { createItem } from "../../lib/helpers";
import { MutationCreateApartmentArgs, Apartment } from "../../types/appsync";

export function request(
  ctx: Context<MutationCreateApartmentArgs>,
): DynamoDBPutItemRequest {
  // add timestamps
  const item = createItem(ctx.args.input!);
  const id = util.autoId()

  return {
    operation: "PutItem",
    key: util.dynamodb.toMapValues({
      PK: `BUILDING#${item.buildingId}`,
      SK: `APARTMENT#${id}`,
    }),
    attributeValues: util.dynamodb.toMapValues({
      createdOn: util.time.nowISO8601(),
      id: id,
      ENTITY: "APARTMENT",
      ...item,
    }),
  };
}

export function response(
  ctx: Context<MutationCreateApartmentArgs, object, object, object, Apartment>,
) {
  return ctx.result;
}
