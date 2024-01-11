import { Function, StackContext, Cron, use } from "sst/constructs";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import {dbStack} from "./dbStack"

export function weatherPollMachine({ stack }: StackContext) {
  const dynamoDB = use(dbStack)
  const myDynamoDBTable = dynamodb.Table.fromTableName(stack, 'MyDynamoDBTable', dynamoDB.db.tableName);

  // START EXECUTION OF STATEMACHINE
  const cron = new Cron(stack, "initializeStateMachine", {
    schedule: "rate(5 minutes)",
    job: "src/functions/startStepFunction.handler",
  });
  
  cron.jobFunction.attachPermissions(["states:StartExecution"])

  // STATE DEFINITIONS
  const sParallel = new sfn.Parallel(stack, "parallelDataPoller ", {})

  const sPollYR = new tasks.LambdaInvoke(stack, "lambdaInvokerYR", {
    lambdaFunction: new Function(stack, "dataPollerYr", {
      handler: "src/functions/pollYR.handler"
    }),
    resultPath: '$.dataYR'

  })

  const sPollSMHI = new tasks.LambdaInvoke(stack, "lambdaInvokerSMHI", {
    lambdaFunction: new Function(stack, "dataPollerSMHI", {
      handler: "src/functions/pollSMHI.handler"
    }),
    resultPath: '$.dataSMHI'
  })

  const sAggregateData = new tasks.LambdaInvoke(stack, "lambdaInvokerAggr", {
    lambdaFunction: new Function(stack, "dataAggregator", {
      handler: "src/functions/aggregateData.handler"
    }),
    inputPath:'$',
    resultPath: '$.aggregatedData'
  })

  const sPutToDB = new tasks.DynamoPutItem(stack, "dynamoPutCommand", {
     table: myDynamoDBTable,
     item: {
      city: tasks.DynamoAttributeValue.fromString("gothenburg"),
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
  });
  stateMachine.grantStartExecution(startExecution)
 

  stack.addOutputs({
    StateMachineName: stateMachine.stateMachineName,
    StateMachineARN: stateMachine.stateMachineArn,
  });

  return {
    cron, stateMachine,
  };

}