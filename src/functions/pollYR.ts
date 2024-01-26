import z from 'zod';
import { cities } from '../data/cities';
import { Config } from 'sst/node/config';

const YR_ENDPOINT = Config.YR_ENDPOINT;

/**
 * Triggered by a Cron Job. Fetches weather data from YR.no and filters out the latest reading of the air temperature.
 * @returns {string:, string} - A tuple containing the air temperature and the timestamp
 */
export const handler = async (): Promise<{
  airTemp: number;
  windSpeed: number;
  precipitation: number;
  timeStamp: string;
} | null> => {
  const response = await fetch(
    `${YR_ENDPOINT}?lat=${cities[0].latitude}&lon=${cities[0].longitude}`,
  );

  const json = JSON.parse(await response.text());

  const result = ZodProperties.safeParse(json);

  if (!result.success) {
    console.log(result.error.message);

    return null;
  }

  const timeSeries = result.data.properties.timeseries[0];

  const { air_temperature, wind_speed } = timeSeries.data.instant.details;
  const { precipitation_amount } = timeSeries.data.next_1_hours!.details;

  return {
    airTemp: air_temperature,
    windSpeed: wind_speed,
    precipitation: precipitation_amount,
    timeStamp: timeSeries.time,
  };
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

const ZodNext1Hours = z
  .object({
    details: ZodNext1HoursDetails,
  })
  .optional();

const ZodTimeseries = z.array(
  z.object({
    time: z.string(),
    data: z.object({
      instant: ZodInstant,
      next_1_hours: ZodNext1Hours,
    }),
  }),
);

const ZodProperties = z.object({
  properties: z.object({
    timeseries: ZodTimeseries.min(1),
  }),
});

export default {
  handler,
};
