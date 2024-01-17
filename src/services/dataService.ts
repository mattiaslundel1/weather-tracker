import { Config } from "sst/node/config";
import { OpenAI } from "openai";

const OPEN_AI_KEY = Config.OPEN_AI_KEY;
/**
 * 
 * @param {string} city - What city the assistant should make a recommendation for
 * @param {string} timeStamp - What timestamp (UTC-format) the assistan should take into consideration
 * @param {string} airTemperature - The average air temperature the assistant should base its recommendation on
 * @returns {string} - A recommendation on what to wear in string form.
 */
const generateRecommendation = async (
  city: string,
  timeStamp: string,
  airTemperature: string
): Promise<string> => {
  const openAI = new OpenAI({ apiKey: OPEN_AI_KEY });

  /**
   * Instructions on what behaviour the OpenAI assistant should have. The AI base model is also specified.
   */
  const weatherStylist = await openAI.beta.assistants.create({
    name: "Weather Stylist",
    instructions:
      `You are a sassy personal stylist, an alpha Chad. You should recommend how to dress to stay hip, cool and comfortable based on the time and date (${timeStamp}), location ${city} and temperature (${airTemperature}). Start your message with a cool greeting to Elva Gothenburg! You are addressing a group of both males and females. Be witty and make jokes, but keep it very, very brief. You should always include the temperature. 250 characters at the most. Add extra emojis that suits the weather.`,
    model: "gpt-3.5-turbo",
  });

  /**
   * A conversation thread is initiated and started
   */
  const executeRun = await openAI.beta.threads.createAndRun({
    assistant_id: weatherStylist.id,
  });

  /**
   * The response takes ~10-15s to generate
   */
  let run = await openAI.beta.threads.runs.retrieve(
    executeRun.thread_id, executeRun.id
  )
  let runStatus = run.status

  /**
   * In order to fetch the response, a while loop is initiated. The loop will run as long as the status is queued or in_progress. For each loop, we wait 1 second before trying again.
   */
  while(runStatus === "queued" || runStatus === 'in_progress') {
    console.log("runStatus IN LOOP: ", runStatus)
    
    if (runStatus === 'queued' || runStatus === 'in_progress') {
      // Sleep for a short duration (e.g., 1 second) before checking again
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    run = await openAI.beta.threads.runs.retrieve(
      executeRun.thread_id, executeRun.id
    )
    runStatus = run.status
  }

  /**
   * The response is finally fetched and filtered out from the response. The assistant is then deleted to save on storage at OpenAI, there is no point in keeping it alive as it only work 1 time a day.
   */
  const messages = await openAI.beta.threads.messages.list(run.thread_id)
  const answer = messages.data[0].content[0] as OpenAI.Beta.Threads.MessageContentText
  
  await openAI.beta.assistants.del(weatherStylist.id);

  return answer.text.value;
};

export default {
  generateRecommendation,
};
