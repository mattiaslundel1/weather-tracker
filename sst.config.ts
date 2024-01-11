import { SSTConfig } from "sst";
import { API } from "./stacks/apiStack";
import { dbStack } from "./stacks/dbStack";
import { userStack } from "./stacks/userStack";
import { weatherPollMachine } from "./stacks/weatherPollMachine";

export default {
  config(_input) {
    return {
      name: "weather-tracker",
      region: "eu-north-1",
    };
  },
  stacks(app) {
    app.stack(userStack);
    app.stack(API);
    app.stack(dbStack);
    app.stack(weatherPollMachine);
  }
} satisfies SSTConfig;
