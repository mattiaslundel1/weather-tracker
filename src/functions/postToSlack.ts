import { APIGatewayProxyResultV2 } from "aws-lambda";
import { Config } from "sst/node/config";

const SLACK_WEBHOOK = Config.SLACK_WEBHOOK;

/**
 *
 * @param event - The payload from the state before (Generate a recommendation from OpenAI). It includes the recommendation that is going to be posted to slack
 * @returns {void}
 */
export const handler = async (event: any): Promise<APIGatewayProxyResultV2> => {
  console.log("POSTING MESSAGE TO SLACK!");

  if (!event) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "400 - Bad request" }),
    };
  }

  // TODO: the formatting here is a bit funkey
  // use zod to determine the event structure, don't use two different if cases, looks like a hack

  let payload
  if(event.Payload) {
  payload = {
    text: event.Payload
  }
} else {
  payload = {
    text: event
  }
}

  const response = await fetch(SLACK_WEBHOOK, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });


  return {
    statusCode: response.status,
  };
};

export default {
  handler,
};
