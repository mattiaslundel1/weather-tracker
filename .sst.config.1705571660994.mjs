import { createRequire as topLevelCreateRequire } from 'module';const require = topLevelCreateRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// stacks/weatherPollMachine.ts
import { Function, Cron, Config } from "sst/constructs";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
function weatherPollMachine({ stack }) {
  const SLACK_WEBHOOK = new Config.Secret(stack, "SLACK_WEBHOOK");
  const OPEN_AI_KEY = new Config.Secret(stack, "OPEN_AI_KEY");
  const SMHI_ENDPOINT = new Config.Secret(stack, "SMHI_ENDPOINT");
  const YR_ENDPOINT = new Config.Secret(stack, "YR_ENDPOINT");
  const STATE_MACHINE_ARN = new Config.Secret(stack, "STATE_MACHINE_ARN");
  const sParallel = new sfn.Parallel(stack, "parallelDataPoller ", {});
  const sPollYR = new tasks.LambdaInvoke(stack, "lambdaInvokerYR", {
    lambdaFunction: new Function(stack, "dataPollerYr", {
      bind: [YR_ENDPOINT],
      handler: "src/functions/pollYR.handler"
    }),
    outputPath: "$.Payload"
  });
  const sPollSMHI = new tasks.LambdaInvoke(stack, "lambdaInvokerSMHI", {
    lambdaFunction: new Function(stack, "dataPollerSMHI", {
      bind: [SMHI_ENDPOINT],
      handler: "src/functions/pollSMHI.handler"
    }),
    outputPath: "$.Payload"
  });
  const sAggregateData = new tasks.LambdaInvoke(stack, "lambdaInvokerAggr", {
    lambdaFunction: new Function(stack, "dataAggregator", {
      handler: "src/functions/aggregateData.handler"
    }),
    inputPath: "$",
    outputPath: "$.Payload"
  });
  const sGenerateRecommendation = new tasks.LambdaInvoke(
    stack,
    "lambdaInvokerRecommendation",
    {
      lambdaFunction: new Function(stack, "fashionRecommender", {
        timeout: "60 seconds",
        bind: [OPEN_AI_KEY],
        handler: "src/functions/getRecommendation.handler"
      })
    }
  );
  const sPostToSlack = new tasks.LambdaInvoke(stack, "lambdaInvokePostToSlack", {
    lambdaFunction: new Function(stack, "postToSlack", {
      handler: "src/functions/postToSlack.handler",
      bind: [SLACK_WEBHOOK]
    })
  });
  const stepsDefinition = sParallel.branch(sPollYR).branch(sPollSMHI).next(sAggregateData).next(sGenerateRecommendation).next(sPostToSlack);
  const stateMachine = new sfn.StateMachine(stack, "StateMachine", {
    definitionBody: sfn.DefinitionBody.fromChainable(stepsDefinition)
  });
  const startExecution = new Function(stack, "stepFunctionStarter", {
    handler: "src/functions/startStepFunction.handler",
    environment: {
      STATE_MACHINE_ARN: stateMachine.stateMachineArn
    }
  });
  stateMachine.grantStartExecution(startExecution);
  const cron = new Cron(stack, "initializeStateMachine", {
    schedule: "cron(00 05 * * ? *)",
    job: startExecution
  });
  stack.addOutputs({
    StateMachineName: stateMachine.stateMachineName,
    StateMachineARN: stateMachine.stateMachineArn
  });
  return {
    cron,
    stateMachine
  };
}
__name(weatherPollMachine, "weatherPollMachine");

// sst.config.ts
var sst_config_default = {
  config(_input) {
    return {
      name: "weather-tracker",
      region: "eu-north-1"
    };
  },
  stacks(app) {
    app.stack(weatherPollMachine);
  }
};
export {
  sst_config_default as default
};
