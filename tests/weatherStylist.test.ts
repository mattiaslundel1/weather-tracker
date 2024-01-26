import { getStateMachine, testState } from "./util";
import { describe, it, expect } from "vitest";
import { Config } from "sst/node/config";

describe("[weatherStylist]", async () => {
  const STATE_MACHINE_ARN = Config.STATE_MACHINE_ARN;
  const TIME_STAMP = "2024-01-17T12:30:45.678Z";
  const TEMPERATURE = 2;
  const AVG_TEMPERATURE = "2";
  const WIND_SPEED = 10;
  const AVG_WIND_SPEED = "10";
  const PRECIPITATION = 20;
  const AVG_PRECIPITATION = "20";
  const RECOMMENDATION =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec suscipit hendrerit ullamcorper. In eu aliquam tellus, placerat molestie diam. Phasellus elit sem, aliquam in ex ac, commodo pulvinar nulla. Aenean sollicitudin tortor finibus elit tincidunt viverra. Praesent vehicula ante quis diam accumsan sollicitudin. Sed pellentesque ex a sem vehicula congue.";

  const stateMachine = await getStateMachine(STATE_MACHINE_ARN);

  describe("[PollSMHI]", async () => {
    it("returns weather data", async () => {
      const res = await testState({
        stateMachineArn: stateMachine.stateMachineArn as string,
        taskName: "lambdaInvokerSMHI",
      });

      expect(res).keys(["airTemp", "windSpeed", "precipitation", "timeStamp"]);
      expect(res).toBeTypeOf("object");
      expect(typeof res.airTemp).toBe("number");
      expect(typeof res.windSpeed).toBe("number");
      expect(typeof res.precipitation).toBe("number");
      expect(typeof res.timeStamp).toBe("string");
    });
  });

  describe("[PollYR]", async () => {
    it("returns weather data", async () => {
      const res = await testState({
        stateMachineArn: stateMachine.stateMachineArn as string,
        taskName: "lambdaInvokerYR",
      });

      expect(res).keys(["airTemp", "windSpeed", "precipitation", "timeStamp"]);
      expect(res).toBeTypeOf("object");
      expect(typeof res.airTemp).toBe("number");
      expect(typeof res.windSpeed).toBe("number");
      expect(typeof res.precipitation).toBe("number");
      expect(typeof res.timeStamp).toBe("string");
    });
  });

  describe("[AggregateData]", async () => {
    it("returns averages of weather data", async () => {
      const res = await testState({
        stateMachineArn: stateMachine.stateMachineArn as string,
        taskName: "lambdaInvokerAggr",
        input: JSON.stringify([
          {
            airTemp: TEMPERATURE,
            windSpeed: WIND_SPEED,
            precipitation: PRECIPITATION,
            timeStamp: TIME_STAMP,
          },
          {
            airTemp: TEMPERATURE,
            windSpeed: WIND_SPEED,
            precipitation: PRECIPITATION,
            timeStamp: TIME_STAMP,
          },
        ]),
      });

      expect(res).keys([
        "avgTemp",
        "avgWindSpeed",
        "avgPrecipitation",
        "timeStamp",
      ]);
      expect(res).toBeTypeOf("object");
      expect(typeof res.avgTemp).toBe("string");
      expect(res.avgTemp).toEqual(AVG_TEMPERATURE);
      expect(typeof res.avgWindSpeed).toBe("string");
      expect(res.avgWindSpeed).toEqual(AVG_WIND_SPEED);
      expect(typeof res.avgPrecipitation).toBe("string");
      expect(res.avgPrecipitation).toEqual(AVG_PRECIPITATION);
      expect(typeof res.timeStamp).toBe("string");
      expect(res.timeStamp).toEqual(TIME_STAMP);
    });
  });

  describe("[GetRecommendation]", async () => {
    it("returns a OpenAI recommendation", async () => {
      const res = await testState({
        stateMachineArn: stateMachine.stateMachineArn as string,
        taskName: "lambdaInvokerRecommendation",
        input: JSON.stringify({
          avgTemp: AVG_TEMPERATURE,
          avgWindSpeed: AVG_WIND_SPEED,
          avgPrecipitation: AVG_PRECIPITATION,
          timeStamp: TIME_STAMP,
        }),
      });

      expect(res).toBeTypeOf("object");
    });
  });
});
