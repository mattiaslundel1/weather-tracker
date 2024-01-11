import z from "zod";
import { cities } from "../data/cities";

const YR_ENDPOINT = "https://api.met.no/weatherapi/locationforecast/2.0/compact.json?"

export const handler = async (): Promise< {airTemp: number, timeStamp: string} | null > => {
  console.log("Hello from pollYR!")

  /* const tasks = cities.map(async (city) => {

    const response = await (
      await fetch(`${YR_ENDPOINT}lat=${city.latitude}&lon=${city.longitude}`)
      ).json();
      
    const result = responseSchema.safeParse(response);

    if (!result.success) {
      console.log(result.error.message);
      return;
    }

    const {
      air_pressure_at_sea_level,
      air_temperature,
      cloud_area_fraction,
      relative_humidity,
      wind_from_direction,
      wind_speed,
    } = result.data.properties.timeseries[0].data.instant.details;

    const timeStamp = result.data.properties.timeseries[0].time

  })
  await Promise.allSettled(tasks) */



  const response = await (
    await fetch(`${YR_ENDPOINT}lat=${cities[0].latitude}&lon=${cities[0].longitude}`)
    ).json();

    const result = responseSchema.safeParse(response);

    if (!result.success) {
      console.log(result.error.message);
      return null;
    }

    const {
      air_pressure_at_sea_level,
      air_temperature,
      cloud_area_fraction,
      relative_humidity,
      wind_from_direction,
      wind_speed,
    } = result.data.properties.timeseries[0].data.instant.details;

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
              air_pressure_at_sea_level: z.number(),
              air_temperature: z.number(),
              cloud_area_fraction: z.number(),
              relative_humidity: z.number(),
              wind_from_direction: z.number(),
              wind_speed: z.number(),
            }),
          }),
        }),
      })
    ),
  }),
});
