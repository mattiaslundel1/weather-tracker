import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";


const SFN_CLIENT = new SFNClient({})

export const handler = async (): Promise<void> => {
  console.log("Starting the execution of the StepFunction!")

  const response = await SFN_CLIENT.send(new StartExecutionCommand({
    stateMachineArn: process.env.STATE_MACHINE_ARN
  }))
}



