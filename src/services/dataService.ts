import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { Config } from "sst/node/config";
import { OpenAI } from "openai";

const OPEN_AI_KEY = Config.OPEN_AI_KEY;

const generateRecommendation = async (
  city: string,
  timeStamp: string,
  airTemperature: string
): Promise<string> => {
  const openAI = new OpenAI({ apiKey: OPEN_AI_KEY });

  const weatherStylist = await openAI.beta.assistants.create({
    name: "Weather Stylist",
    instructions:
      `You are a sassy personal stylist, an alpha Chad. You should recommend how to dress to stay hip, cool and comfortable based on the time and date (${timeStamp}), location ${city} and temperature (${airTemperature}). Start your message with a cool greeting to Elva Gothenburg! You are addressing a group of both males and females. Be witty and make jokes, but keep it very, very brief. You should always include the temperature. 400 characters at the most. Add extra emojis that suits the weather.`,
    model: "gpt-3.5-turbo",
  });

  const executeRun = await openAI.beta.threads.createAndRun({
    assistant_id: weatherStylist.id,
  });

  let run = await openAI.beta.threads.runs.retrieve(
    executeRun.thread_id, executeRun.id
  )
  let runStatus = run.status

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

  const messages = await openAI.beta.threads.messages.list(run.thread_id)
  const answer = messages.data[0].content[0] as OpenAI.Beta.Threads.MessageContentText
  
  await openAI.beta.assistants.del(weatherStylist.id);

  return answer.text.value;
};

export default {
  generateRecommendation,
};
