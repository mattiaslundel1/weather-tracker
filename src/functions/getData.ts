import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from "aws-lambda";

// uses authentication from user pool
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResultV2> => {

  

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "hello" }),
  };
};
