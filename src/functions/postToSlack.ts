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

  console.log("EVENT IN SLACK: ", event);
  if (!event) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "400 - Bad request" }),
    };
  }

  let payload;
  if (typeof event === "string") {
    payload = {
      text: event,
    };
  } else {
    payload = event;
  }

  const response = await fetch(SLACK_WEBHOOK, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  console.log("RESPONSE IN SLACK:", response);

  return {
    statusCode: 200,
    body: JSON.stringify({ 200: "Ok" }),
  };
};

export default {
  handler,
};
