import { StackContext, Table, use } from "sst/constructs";

export function dbStack({ stack }: StackContext) {
  const db = new Table(stack, "weatherDB", {
    fields: {
      city: "string",
      timestamp: "string",
      airPressure: "number",
      airTemperature: "number",
      cloudArea: "number",
      humidity: "number",
      windDirection: "number",
      windSpeed: "number",
    },

    primaryIndex: { partitionKey: "city", sortKey: "timestamp" },
    defaults: {
      function: {
        bind: [],
      },
    },
  });

  stack.addOutputs({
    DynamoDB: db.tableName,
  });

  return {
    db,
  };
}
