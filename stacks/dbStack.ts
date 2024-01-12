import { RemovalPolicy } from "aws-cdk-lib/core";
import { StackContext, Table, } from "sst/constructs";

export function dbStack({ stack }: StackContext) {
  const db = new Table(stack, "weatherDB", {
    fields: {
      city: "string",
      timeStamp: "string",
      airTemperature: "number",
    },

    primaryIndex: { partitionKey: "city"},
    
    cdk: {
      table: {
        removalPolicy: RemovalPolicy.DESTROY
      }
    }
  });

  stack.addOutputs({
    DynamoDB: db.tableName,
  });

  return {
    db,
  };
}
