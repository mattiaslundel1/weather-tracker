import { z } from "zod";

/**
 * Takes the average air temperature based on the readings from SMHI and YR. 
 * @param event - Contains the payload from the previous step (Poll weather data), i.e. the latest readings of air temperature and time stamps.
 * @returns {string, string} - Returns a tuple containing the average air temperature and timestamp.
 */
export const handler = async (
  event: any
): Promise<{avgTemp: string, timeStamp: string} | null> => {
  console.log("AGGREGATING DATA!");

  const result = validDataSchema.safeParse(event);
  if (!result.success) {
    console.log(result.error);
    return null;
  }

  const data = result.data;
  const avgTemp = (data[0].airTemp+data[1].airTemp)/2

  return {avgTemp: avgTemp.toString(), timeStamp: data[0].timeStamp};
};

const validDataSchema = z.array(
  z.object({
    airTemp: z.number(),
    timeStamp: z.string()
  })
);

