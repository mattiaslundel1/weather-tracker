import z from "zod";
import { cities } from "../data/cities";
import { Config } from "sst/node/config";

const YR_ENDPOINT = Config.YR_ENDPOINT


// TODO: install prettier (and define a formatting config), some lines are very long
// Usually project have alimit of 80-120 char len per line.
// Look in Pollsmhi and note how I changed stuff.

/**
 * Triggered by a Cron Job. Fetches weather data from YR.no and filters out the latest reading of the air temperature.
 * @returns {string:, string} - A tuple containing the air temperature and the timestamp
 */
export const handler = async (): Promise< {airTemp: number, windSpeed: number, precipitation: number, timeStamp: string} | null > => {
  console.log("POLLING YR.no!")

  // TODO: I'd split split ut these two calls to improve the readability of the program/call sequence.
  // The indentaiton is off here as well, should be fixed once you make use of a formatter.
  const response = await (
    await fetch(`${YR_ENDPOINT}?lat=${cities[0].latitude}&lon=${cities[0].longitude}`)
    ).json();

    // TODO: Typ err -> response is unkown, hence propeties is any
    const result = ZodProperties.safeParse(response.properties);

    if (!result.success) {
      console.log(result.error.message);
      return null;
    }


    // TODO: excessive line length and return stement, pretty hard to read
    const air_temperature = result.data.timeseries![0].data.instant.details.air_temperature
    const wind_speed = result.data.timeseries![0].data.instant.details.wind_speed;
    const precipitation_amount = result.data.timeseries![0].data.next_1_hours!.details.precipitation_amount;
    const timeStamp = result.data.timeseries![0].time

    return { airTemp: air_temperature, windSpeed: wind_speed, precipitation: precipitation_amount, timeStamp: timeStamp }
};

const ZodDetails = z.object({
  air_temperature: z.number(),
  wind_speed: z.number(),
});

const ZodInstant = z.object({
  details: ZodDetails,
});

const ZodNext1HoursDetails = z.object({
  precipitation_amount: z.number(),
});

const ZodNext1Hours = z.object({
  details: ZodNext1HoursDetails,
}).optional();

const ZodTimeseries = z.array(
  z.object({
    time: z.string(),
    data: z.object({
      instant: ZodInstant,
      next_1_hours: ZodNext1Hours,
    }),
  })
);

const ZodProperties = z.object({
  timeseries: ZodTimeseries.optional(),
});

export default {
  handler
}
