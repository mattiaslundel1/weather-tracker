import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { Config } from 'sst/node/config';
import { z } from 'zod';

const SLACK_WEBHOOK = Config.SLACK_WEBHOOK;

/**
 *
 * @param event - The payload from the state before (Generate a recommendation from OpenAI). It includes the recommendation that is going to be posted to slack
 * @returns {void}
 */
export const handler = async (event: unknown) => {
  const { text } = z.object({ text: z.string() }).parse(event);

  const response = await fetch(SLACK_WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      text,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send slack msg');
  }

  return text;
};

export default {
  handler,
};
