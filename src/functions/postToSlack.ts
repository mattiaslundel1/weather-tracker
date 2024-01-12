import { APIGatewayProxyResultV2 } from "aws-lambda";
import { Config } from "sst/node/config";

const SLACK_WEBHOOK = Config.SLACK_WEBHOOK

export const handler = async (event: any): Promise<APIGatewayProxyResultV2> => {
  if(!event.Payload) {
    return {
      statusCode: 400,
    }
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

  console.log("RESPONSE: ", response)

  return {
    statusCode: 200
  }

}