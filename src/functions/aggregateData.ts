import { z } from "zod";

export const handler = async (event: any): Promise<void> => {
  console.log("Hello from aggregateData!");

  const { dataYR, dataSMHI } = event;

  console.log(dataYR, dataSMHI)






};

const inputSchema = z.object({


});
