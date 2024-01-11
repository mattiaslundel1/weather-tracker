import { Function, StackContext, Cron, use } from "sst/constructs";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { dbStack } from "./dbStack"
import { cities } from "../src/data/cities"

export function weatherPollMachine({ stack }: StackContext) {
  // FETCHING DATABASE RESOURCE
  const dynamoDB = use(dbStack)
  const myDynamoDBTable = dynamodb.Table.fromTableName(stack, 'MyDynamoDBTable', dynamoDB.db.tableName);

  // STATE DEFINITIONS
  const sParallel = new sfn.Parallel(stack, "parallelDataPoller ", {})

  const sPollYR = new tasks.LambdaInvoke(stack, "lambdaInvokerYR", {
    lambdaFunction: new Function(stack, "dataPollerYr", {
      handler: "src/functions/pollYR.handler"
    }),
    outputPath: '$.Payload',
  })

  const sPollSMHI = new tasks.LambdaInvoke(stack, "lambdaInvokerSMHI", {
    lambdaFunction: new Function(stack, "dataPollerSMHI", {
      handler: "src/functions/pollSMHI.handler"
    }),
    outputPath: '$.Payload'
  })

  const sAggregateData = new tasks.LambdaInvoke(stack, "lambdaInvokerAggr", {
    lambdaFunction: new Function(stack, "dataAggregator", {
      handler: "src/functions/aggregateData.handler"
    }),
    inputPath:'$',
    outputPath: '$.Payload',
  })

  const sPutToDB = new tasks.DynamoPutItem(stack, "dynamoPutCommand", {
    table: myDynamoDBTable,
    item: {
      city: tasks.DynamoAttributeValue.fromString(cities[0].name),
      timeStamp: tasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.timeStamp')),
      airTemperature: tasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.avgTemp')),
     }
  })

  // STEP CHAIN
  const stepsDefinition = 
    sParallel
      .branch(sPollYR)
      .branch(sPollSMHI)
    .next(sAggregateData)
    .next(sPutToDB)

   // STATE MACHINE 
  const stateMachine = new sfn.StateMachine(stack, "StateMachine", {
    definitionBody: sfn.DefinitionBody.fromChainable(stepsDefinition),

  })

  const startExecution = new Function(stack, 'stepFunctionStarter', {
    handler: 'src/functions/startStepFunction.handler',
    environment: {
      STATE_MACHINE_ARN: stateMachine.stateMachineArn
    }
  });
  stateMachine.grantStartExecution(startExecution)

  // START EXECUTION OF STATEMACHINE
  const cron = new Cron(stack, "initializeStateMachine", {
    schedule: "rate(1 hour)",
    job: startExecution,
  });

  stack.addOutputs({
    StateMachineName: stateMachine.stateMachineName,
    StateMachineARN: stateMachine.stateMachineArn,
  });

  return {
    cron, stateMachine,
  };

}