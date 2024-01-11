import z from "zod";
import { cities } from "../data/cities";

const YR_ENDPOINT = "https://api.met.no/weatherapi/locationforecast/2.0/compact.json"

export const handler = async (): Promise< {airTemp: number, timeStamp: string} | null > => {
  console.log("Polling weather data from YR.no!")

  const response = await (
    await fetch(`${YR_ENDPOINT}?lat=${cities[0].latitude}&lon=${cities[0].longitude}`)
    ).json();

    const result = responseSchema.safeParse(response);

    if (!result.success) {
      console.log(result.error.message);
      return null;
    }

    const air_temperature = result.data.properties.timeseries[0].data.instant.details.air_temperature;

    const timeStamp = result.data.properties.timeseries[0].time

    return { airTemp: air_temperature, timeStamp: timeStamp }
};

const responseSchema = z.object({
  properties: z.object({
    timeseries: z.array(
      z.object({
        time: z.string(),
        data: z.object({
          instant: z.object({
            details: z.object({
              air_temperature: z.number(),
            }),
          }),
        }),
      })
    ),
  }),
});
