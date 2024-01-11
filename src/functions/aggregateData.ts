import { z } from "zod";

export const handler = async (
  event: any
): Promise<{avgTemp: string, timeStamp: string} | null> => {
  console.log("Aggregating data!");

  const result = validDataSchema.safeParse(event);
  if (!result.success) {
    console.log(result.error);
    return null;
  }

  const data = result.data;
  const avgTemp = (data[0].airTemp+data[1].airTemp)/2

  return {avgTemp: avgTemp.toString(), timeStamp: data[0].timeStamp};
};


const validDataSchema = z.array(
  z.object({
    airTemp: z.number(),
    timeStamp: z.string()
  })
);

