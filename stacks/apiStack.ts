import { StackContext, Api, EventBus, use } from "sst/constructs";
import { userStack } from "./userStack";

export function API({ stack }: StackContext) {
  const userPoolStack = use(userStack);

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
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
      "GET /test": "src/functions/getData.handler",
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
