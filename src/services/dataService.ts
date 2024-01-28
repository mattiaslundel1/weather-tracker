import { Config } from 'sst/node/config';
import { OpenAI } from 'openai';
import Assistant from '../models/assistant';

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
  airTemperature: string,
  windSpeed: string,
  precipitation: string,
): Promise<string> => {
  const openAI = new OpenAI({ apiKey: OPEN_AI_KEY });

  const assistant = await Assistant.generateAssistant(
    city,
    timeStamp,
    airTemperature,
    windSpeed,
    precipitation,
  );

  if (!assistant) {
    return 'All assistants were unfortunately unavailable. Try looking out the window for guidance on what to wear...';
  }
  /**
   * A conversation thread is initiated and started
   */
  const executeRun = await openAI.beta.threads.createAndRun({
    assistant_id: assistant.id,
  });

  /**
   * The response takes ~10-15s to generate
   */
  let run = await openAI.beta.threads.runs.retrieve(
    executeRun.thread_id,
    executeRun.id,
  );
  let runStatus = run.status;

  /**
   * In order to fetch the response, a while loop is initiated. The loop will run as long as the status is queued or in_progress. For each loop, we wait 1 second before trying again.
   */
  while (runStatus === 'queued' || runStatus === 'in_progress') {
    if (runStatus === 'queued' || runStatus === 'in_progress') {
      // Sleep for a short duration (e.g., 1 second) before checking again
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    run = await openAI.beta.threads.runs.retrieve(
      executeRun.thread_id,
      executeRun.id,
    );
    runStatus = run.status;
  }

  /**
   * The response is finally fetched and filtered out from the response. The assistant is then deleted to save on storage at OpenAI, there is no point in keeping it alive as it only work 1 time a day.
   */
  const messages = await openAI.beta.threads.messages.list(run.thread_id);
  const answer = messages.data[0]
    .content[0] as OpenAI.Beta.Threads.MessageContentText;

  await openAI.beta.assistants.del(assistant.id);

  return answer.text.value;
};

export default {
  generateRecommendation,
};
