import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { cities } from "../data/cities";

const DB_CLIENT = new DynamoDBClient({});
const DB_NAME = "dev-stock-tracker-dynamoDB"



function createPutCommand() {
  let test = {};

  const params = {
    RequestItems: {
      YourTableName: [
        {
          PutRequest: {
            Item: {
              // Define your item attributes here
              key1: "value1",
              key2: "value2",
            },
          },
        },
        {
          PutRequest: {
            Item: {
              // Define your second item attributes here
              key1: "value3",
              key2: "value4",
            },
          },
        },
        // Add more PutRequest objects as needed
      ],
    },
  };

  const command = new BatchWriteCommand(params);
  const tests = new BatchWriteCommand({
    RequestItems: {

    } 
  })
}

async function addToDB(): Promise<void> {

  /* const addEntry = await DB_CLIENT.send(new PutCommand({
    TableName: "dev-stock-tracker-dynamoDB",
    Item: {
      city: city.name,
      timestamp: timeStamp,
      airPressure: air_pressure_at_sea_level,
      airTemperature: air_temperature,
      cloudArea: cloud_area_fraction,
      humidity: relative_humidity,
      windDirection: wind_from_direction,
      windSpeed: wind_speed,
    },
  })) */


}