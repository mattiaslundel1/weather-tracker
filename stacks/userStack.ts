import {
  UserPool,
  UserPoolClient,
} from "aws-cdk-lib/aws-cognito";
import { StackContext } from "sst/constructs";

export function userStack({ stack }: StackContext) {
  const userPool = new UserPool(stack, "userPool", {
    selfSignUpEnabled: true,

    passwordPolicy: {
      minLength: 6,
      requireDigits: false,
      requireLowercase: false,
      requireSymbols: false,
      requireUppercase: false,
    },
  });

  const userPoolClient = new UserPoolClient(stack, "userPoolClient", {
    userPool,
    
  });

  stack.addOutputs({
    UserPool: userPool.userPoolId,
    UserPoolClient: userPoolClient.userPoolClientId,
  });

  return {
    userPool,
    userPoolClient,
  };
}
