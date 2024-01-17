import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";

const SFN_CLIENT = new SFNClient({})

/**
 * Function that starts the execution of the step function.
 */
export const handler = async (): Promise<void> => {
  console.log("STARTING STATEMACHINE!")

  const response = await SFN_CLIENT.send(new StartExecutionCommand({
    stateMachineArn: process.env.STATE_MACHINE_ARN
  }))
}



