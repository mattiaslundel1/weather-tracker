import { APIGatewayProxyResultV2 } from "aws-lambda";
import { Config } from "sst/node/config";

const SLACK_WEBHOOK = Config.SLACK_WEBHOOK


export const handler = async (event: any): Promise<void> => {
  console.log("POSTING MESSAGE TO SLACK!")
  if(!event.Payload) {
    return;
  }

  const payload = {
    text: event.Payload
  }

  const response = await fetch(SLACK_WEBHOOK, {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(payload)
  })

  return;

}