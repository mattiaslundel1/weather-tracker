import z from "zod";
import { cities } from "../data/cities";

const SMHI_ENDPOINT = "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/11.59/lat/57.43/data.json"

export const handler = async (): Promise< {airTemp: number, timeStamp: string } | null> => {
  console.log("Polling weather data from SMHI!")

  const response = await (
    await fetch(`https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${cities[0].longitude}/lat/${cities[0].latitude}/data.json`)
    ).json();
    
  const result = responseSchema.safeParse(response);

  if (!result.success) {
    console.log(result.error.message);
    return null;
  }

  const {
    name,
    values,
  } = result.data.timeSeries[0].parameters[10];
  const timeStamp = result.data.timeSeries[0].validTime;

  return {airTemp: values[0], timeStamp: timeStamp}

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
