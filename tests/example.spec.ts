import { test, expect } from '@playwright/test';
import pollSMHI from "../src/functions/pollSMHI"
import pollYR from "../src/functions/pollYR"
import aggregateData from "../src/functions/aggregateData"
import getRecommendation from "../src/functions/getRecommendation"
import startStepFunction from "../src/functions/startStepFunction"
import postToSlack from "../src/functions/postToSlack"

const TEMPERATURE = 2;
const AVERAGE_TEMPERATURE = "2";
const TIMESTAMP = "2024-01-17T12:30:45.678Z";
const RECOMMENDATION = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc malesuada, urna eu ultrices vestibulum, nunc dui vulputate turpis, vitae aliquam felis neque a ante. Curabitur efficitur finibus dui vel vestibulum. Aenean aliquet convallis semper. In lectus urna, tempor vel urna sed, semper ornare orci."

test("to return weather data from SMHI as strings", async () => {
  const result =  await pollSMHI.handler()

  expect(result).toMatchObject({
    prop1: expect.any(String),
    prop2: expect.any(String),
  });
})

test("to return weather data from YR as strings", async () => {
  const result =  await pollYR.handler()

  expect(result).toMatchObject({
    prop1: expect.any(String),
    prop2: expect.any(String),
  });
})

test("to return the average temperature from two readings", async () => {
  const result = await aggregateData.handler(
    [
      { airTemp: TEMPERATURE, timeStamp: TIMESTAMP },
      { airTemp: TEMPERATURE,  timeStamp: TIMESTAMP }
    ])

    expect(result).toMatchObject({
      prop1: expect.any(String),
      prop2: expect.any(String),
    });
    expect(result?.avgTemp).toEqual(AVERAGE_TEMPERATURE);
    expect(result?.timeStamp).toEqual(TIMESTAMP)
})

test("to generate a recommendation on what to wear from OpenAI", async () => {
  const result = await getRecommendation.handler({
    avgTemp: AVERAGE_TEMPERATURE,
    timeStamp: TIMESTAMP
  })

  expect(result).toBeInstanceOf(String);
  expect(result?.length).toBeGreaterThan(100);
})

test("to post a recommendation to Slack", async () => {
  const result = await postToSlack.handler(RECOMMENDATION)

  expect(result).toBe(200)
})

test("to start the execution of the step function", async () => {
  const result = await startStepFunction.handler()

  expect(result).toBe(200)
})

