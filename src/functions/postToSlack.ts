import { Config } from "sst/node/config";

const SLACK_WEBHOOK = Config.SLACK_WEBHOOK

/**
 * 
 * @param event - The payload from the state before (Generate a recommendation from OpenAI). It includes the recommendation that is going to be posted to slack
 * @returns {void}
 */
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