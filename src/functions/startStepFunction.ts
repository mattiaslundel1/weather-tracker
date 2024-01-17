import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import { APIGatewayProxyResultV2 } from "aws-lambda";

const SFN_CLIENT = new SFNClient({})

/**
 * Function that starts the execution of the step function.
 */
export const handler = async (): Promise<APIGatewayProxyResultV2> => {
  console.log("STARTING STATEMACHINE!")

  const response = await SFN_CLIENT.send(new StartExecutionCommand({
    stateMachineArn: process.env.STATE_MACHINE_ARN
  }))
  
  return {
    statusCode: response.$metadata.httpStatusCode
  }
}

export default {
  handler
}

