import z from "zod";
import { cities } from "../data/cities";
import { Config } from "sst/node/config";

const SMHI_ENDPOINT = Config.SMHI_ENDPOINT

/**
 * Triggered by a Cron Job once a day. Fetches weather data from SMHI.se and filters out the latest reading of the air temperature.
 * @returns {string, string} - A tuple containing the air temperature and timestamp.
 */
export const handler = async (): Promise< {airTemp: number, windSpeed: number, precipitation: number, timeStamp: string } | null> => {
  console.log("POLLING SMHI!")

  const response = await (
    await fetch(`${SMHI_ENDPOINT}/lon/${cities[0].longitude}/lat/${cities[0].latitude}/data.json`)
    ).json();
    
  const result = responseSchema.safeParse(response);

  if (!result.success) {
    console.log(result.error.message);
    return null;
  }

  const airTemp = result.data.timeSeries[0].parameters[10].values[0];
  const windSpeed = result.data.timeSeries[0].parameters[14].values[0];
  const precipitation = result.data.timeSeries[0].parameters[3].values[0];
  const timeStamp = result.data.timeSeries[0].validTime;

  return {airTemp: airTemp, windSpeed: windSpeed, precipitation: precipitation, timeStamp: timeStamp}

};

const responseSchema = z.object({
  referenceTime: z.string(),
  timeSeries: z.array(
    z.object({
      validTime: z.string(),
      parameters: z.array(
        z.object({
          name: z.string(),
          values: z.array(
            z.number())
        })
      )
    })
  )
})

export default {
  handler
}
