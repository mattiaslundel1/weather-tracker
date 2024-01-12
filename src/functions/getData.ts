import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import { z } from "zod";
import DataService from "../services/dataService"

// uses authentication from user pool
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResultV2> => {

  const result = inputSchema.safeParse(event.pathParameters)
  if(!result.success) {
    console.log(result.error)
    return {
      statusCode: 404,
      body: JSON.stringify({error: "400 - Bad request"})
    }
  }
  const { city }  = result.data

  const [airTemp, timeStamp] = await DataService.getTemperature(city)

  return {
    statusCode: 200,
    body: JSON.stringify(`The latest reading for ${city} was registered to be ${airTemp} °C. This reading is an average of the temperatures reported by YR.no and SMHI.se at ${timeStamp}. Have a great day and remember to dress accordingly!`),
  };
};


const inputSchema = z.object({
  city: z.string()
})