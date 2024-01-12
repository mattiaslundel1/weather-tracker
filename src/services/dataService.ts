import {DynamoDBClient, GetItemCommand} from "@aws-sdk/client-dynamodb"

const DB_CLIENT = new DynamoDBClient({})


const getTemperature = async (city: string): Promise<[airTemp: string | null, timeStamp: string | null]> => {

const response = await DB_CLIENT.send(new GetItemCommand({
  TableName: process.env.WEATHER_DB,
  Key: {
    "city": {
      "S": city
    }
  }
}))

if(!response.Item) {
  console.log("Error: Failed to fetch data.")
  return [null, null]
}

return [response.Item.airTemperature.S!, response.Item.timeStamp.S!]

}

export default {
  getTemperature
}