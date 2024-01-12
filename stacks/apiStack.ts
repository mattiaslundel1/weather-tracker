import { StackContext, Api, use } from "sst/constructs";
import { userStack } from "./userStack";
import { dbStack } from "./dbStack";

export function API({ stack }: StackContext) {
  const userPoolStack = use(userStack);
  const weatherData = use(dbStack)

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [weatherData.db],
        environment: {
          WEATHER_DB: weatherData.db.tableName,
          USER_POOL_ID: userPoolStack.userPool.userPoolId,
          USER_CLIENT_ID: userPoolStack.userPoolClient.userPoolClientId,
        },
      },
      authorizer: "Autorizer",
    },
    authorizers: {
      Autorizer: {
        type: "user_pool",
        userPool: {
          id: userPoolStack.userPool.userPoolId,
          clientIds: [userPoolStack.userPoolClient.userPoolClientId],
        },
      },
    },
    routes: {
      "GET /weather/{city}": "src/functions/getData.handler",
    },
  });

  /*   const bus = new EventBus(stack, "bus", {
      defaults: {
        retries: 10,
        function: {},
      },
    }); */
  /* bus.subscribe("todo.created", {
    handler: "packages/functions/src/events/todo-created.handler",
  }); */

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
