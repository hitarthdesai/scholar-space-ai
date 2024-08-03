"use server";

import { createStreamableValue, type StreamableValue } from "ai/rsc";

// eslint-disable-next-line @typescript-eslint/require-await
export const sendMessage = async (input: string): Promise<StreamableValue> => {
  const stream = createStreamableValue("");

  // This temporarily just streams the input back to the user, with some ms delay
  // TODO: Remove this when we start querying the actual model
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  (async () => {
    for await (const char of input) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      stream.update(char);
    }

    stream.done();
  })();

  return stream.value;
};
