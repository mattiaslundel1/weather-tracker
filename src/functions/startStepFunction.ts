import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";

const SFN_CLIENT = new SFNClient({})

export const handler = async (): Promise<void> => {
  console.log("Hello from startStepFunction!")


  const response = await SFN_CLIENT.send(new StartExecutionCommand({
    stateMachineArn: "arn:aws:states:eu-north-1:245082714028:stateMachine:StateMachine2E01A3A5-ayGemWMwFmOC"
  }))
}



