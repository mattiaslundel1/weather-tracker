import z from "zod";
import { cities } from "../data/cities";
import { Config } from "sst/node/config";

const SMHI_ENDPOINT = Config.SMHI_ENDPOINT;

// NOTE: Iv've formatted this file & made some minor stuff to improve readability
// compare the diff in github / git diff and note the changes

/**
 * Triggered by a Cron Job once a day. Fetches weather data from SMHI.se and filters out the latest reading of the air temperature.
 * @returns {string, string} - A tuple containing the air temperature and timestamp.
 */
export const handler = async (): Promise<{
  airTemp: number;
  windSpeed: number;
  precipitation: number;
  timeStamp: string;
} | null> => {
  const res = await fetch(
    `${SMHI_ENDPOINT}/lon/${cities[0].longitude}/lat/${cities[0].latitude}/data.json`,
  );
  const json = await res.json();
  const result = responseSchema.safeParse(json);

  if (!result.success) {
    console.log(result.error.message);

    return null;
  }

  const { timeSeries } = result.data;
  const firstSeries = timeSeries.at(0);

  return {
    airTemp: firstSeries?.parameters[AIR_TMP].values.at(0) ?? NaN,
    windSpeed: firstSeries?.parameters[WIND_SPEED].values.at(0) ?? NaN,
    precipitation: firstSeries?.parameters[PRECIPITATION].values.at(0) ?? NaN,
    timeStamp: firstSeries?.validTime ?? "n/a",
  };
};

const responseSchema = z.object({
  referenceTime: z.string(),
  timeSeries: z.array(
    z.object({
      validTime: z.string(),
      parameters: z.array(
        z.object({
          name: z.string(),
          values: z.array(z.number()),
        }),
      ),
    }),
  ),
});

const AIR_TMP = 0;
const WIND_SPEED = 14;
const PRECIPITATION = 10;

export default {
  handler,
};
