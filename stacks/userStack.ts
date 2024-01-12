import {
  AccountRecovery,
  UserPool,
  UserPoolClient,
} from "aws-cdk-lib/aws-cognito";
import { Duration, RemovalPolicy } from "aws-cdk-lib/core";
import { StackContext } from "sst/constructs";

export function userStack({ stack }: StackContext) {
  const userPool = new UserPool(stack, "userPool", {
    selfSignUpEnabled: true,
    standardAttributes: {
      email: {
        required: true,
        mutable: true
      }
    },
    autoVerify: {
      email: true
    },
    passwordPolicy: {
      minLength: 12,
      requireDigits: true,
      requireLowercase: true,
      requireSymbols: true,
      requireUppercase: true,
      tempPasswordValidity: Duration.days(3)
    },
    accountRecovery: AccountRecovery.EMAIL_ONLY,
    removalPolicy: RemovalPolicy.DESTROY,
  });

  const userPoolClient = new UserPoolClient(stack, "userPoolClient", {
    userPool,
    oAuth: {
      flows: {
        implicitCodeGrant: true
      }
    }
    
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
