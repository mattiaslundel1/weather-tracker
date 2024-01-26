import { z } from 'zod';
import DataService from '../services/dataService';
import { cities } from '../data/cities';

/**
 * Responsible of passing the weather data to an OpenAI assistant in order to generate a recommendation on what to wear.
 * @param event - Containts the Payload of the previous step (Aggregate data), i.e. the average air temperature and time stamp.
 * @returns {string} - returns a recommendation on what to wear from a OpenAI assistant.
 */
export const handler = async (event: any): Promise<{ text: string } | null> => {

  const result = inputSchema.safeParse(event);
  if (!result.success) {
    console.log(result.error);
    return null;
  }

  const { avgTemp, avgWindSpeed, avgPrecipitation, timeStamp } = result.data;
  const recommendation = await DataService.generateRecommendation(
    cities[0].name,
    timeStamp,
    avgTemp,
    avgWindSpeed,
    avgPrecipitation,
  );

  return {
    text: recommendation,
  };
};

const inputSchema = z.object({
  avgTemp: z.string(),
  avgWindSpeed: z.string(),
  avgPrecipitation: z.string(),
  timeStamp: z.string(),
});

export default {
  handler,
};
