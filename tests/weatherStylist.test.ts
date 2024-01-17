import { findState, getStateMachine, testState } from "./util";
import { describe, it, expect } from "vitest";
import { Config } from "sst/node/config";

describe("[weatherStylist]", async () => {
  const STATE_MACHINE_ARN = Config.STATE_MACHINE_ARN;

  const stateMachine = await getStateMachine(STATE_MACHINE_ARN);

  describe("[PollSMHI]", async () => {
    it("returns weather data", async () => {
      const res = await testState({
        stateMachineArn: stateMachine.stateMachineArn,
        taskName: "lambdaInvokerSMHI",
      });

      expect(res).keys(["airTemp", "timeStamp"]);
      expect(res).toBeTypeOf("object");
      expect(typeof res.airTemp).toBe("number");
      expect(typeof res.timeStamp).toBe("string");
    });
  });

  describe("[PollYR]", async () => {
    it("returns weather data", async () => {
      const res = await testState({
        stateMachineArn: stateMachine.stateMachineArn,
        taskName: "lambdaInvokerYR",
      });

      expect(res).keys(["airTemp", "timeStamp"]);
      expect(res).toBeTypeOf("object");
      expect(typeof res.airTemp).toBe("number");
      expect(typeof res.timeStamp).toBe("string");
    });
  });

  describe("[AggregateData]", async () => {
    it("returns an average airTemp and a timestamp", async () => {
      const res = await testState({
        stateMachineArn: stateMachine.stateMachineArn,
        taskName: "lambdaInvokerAggr",
        input: JSON.stringify([
          { airTemp: 2, timeStamp: "2024-01-17T12:30:45.678Z" },
          { airTemp: 2, timeStamp: "2024-01-17T12:30:45.678Z" },
        ]),
      });

      expect(res).keys(["avgTemp", "timeStamp"]);
      expect(res).toBeTypeOf("object");
      expect(typeof res.avgTemp).toBe("string");
      expect(typeof res.timeStamp).toBe("string");
    });
  });

  describe("[PostToSlack]", async () => {
    it("returns statuscode OK", async () => {
      const res = await testState({
        stateMachineArn: stateMachine.stateMachineArn,
        taskName: "lambdaInvokePostToSlack",
        input: JSON.stringify("test"),
      });

      console.log(res);

      expect(res.StatusCode).toBe(200);
    });
  });

  describe("[GetRecommendation]", async () => {
    it("returns a OpenAI recommendation", async () => {
      const res = await testState({
        stateMachineArn: stateMachine.stateMachineArn,
        taskName: "lambdaInvokerRecommendation",
        input: JSON.stringify({
          avgTemp: "2",
          timeStamp: "2024-01-17T12:30:45.678Z",
        }),
      });

      expect(res.Payload).toBeTypeOf({ message: "string" });
    });
  });
});
