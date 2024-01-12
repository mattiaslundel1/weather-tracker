import { SSTConfig } from "sst";
import { weatherPollMachine } from "./stacks/weatherPollMachine";

export default {
  config(_input) {
    return {
      name: "weather-tracker",
      region: "eu-north-1",
    };
  },
  stacks(app) {
    app.stack(weatherPollMachine);
  }
} satisfies SSTConfig;
