# Weather Tracker

## Installation

1. Create an account at AWS
2. Download and set up Leapp and connect it to your AWS account
3. clone project
4. cd to project root folder
5. `pnpm install`
6. Create an account and generate an API Key from OpenAI
  - `npx sst secrets set --stage dev OPEN_AI_KEY <YOUR API KEY>`
  - `npx sst secrets set --stage prod OPEN_AI_KEY <YOUR API KEY>`
7. Create an account and generate a WebHook from Slack to get a URL to send post requests to 
  - `npx sst secrets set --stage dev SLACK_WEBHOOK <YOUR WEBHOOK URL>`
  - `npx sst secrets set --stage prod SLACK_WEBHOOK <YOUR WEBHOOK URL>`
8. To run the Weather Tracker
  - `pnpm run dev` - for development mode
  - `pnpm run deploy` - for production mode
9. `pnpm run remove` - to remove all deployed resources associated with the project from your AWS account

## Usage

Once deployed successfully, the weather stylist (an OpenAI assistant) will post a recommendation on what to wear at 06.00 each day to a slack channel. 

A Cron Job will trigger the execution of the step-function. The first step is to poll weather data from SMHI and YR in parallel. The weather data is then aggregated in the next step and an average is calculated. The average weather data is then passed to the OpenAI assistant and a recommendation based on the data is returned as a string. Once the recommendation is generated and passed on, the assistant is deleted to save storage at OpenAI as it only work once a day. The last step is a post request to the slack webhook url.

## Testing

Testing is done by testing each step of the stepfunction, similar to unit tests. There are external rate limits enforced by both Slack and OpenAI which might result in test failures depending on how many requests have been sent. 

### Test execution

1. Open two terminals and cd to the root folder of the project
2. Run `pnpm run dev` from one terminal to start the project in development mode
3. Run `pnpm run test` from the other terminal to execute the test

