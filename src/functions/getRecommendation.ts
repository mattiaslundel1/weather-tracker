import { z } from "zod";
import DataService from "../services/dataService"
import { cities } from "../data/cities";

export const handler = async (
  event: any
): Promise< string |  null> => {
  console.log("GENERATING RECOMMENDATION!")

  const result = inputSchema.safeParse(event)
  if(!result.success) {
    console.log(result.error)
    return null
  }

  const {avgTemp, timeStamp} = result.data
  const recommendation = await DataService.generateRecommendation(cities[0].name, timeStamp, avgTemp)

  return recommendation;
};

const inputSchema = z.object({
  avgTemp: z.string(),
  timeStamp: z.string()
})