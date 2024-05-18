/**
 * Wait for a given amount of time. This is here because Deno test can't properly handle events.
 * @param ms The amount of time to wait in milliseconds.
 * @returns A promise that resolves after the given amount of time.
 */
export const wait = async (ms: number = 1000): Promise<void> => {
  let id: number = 0;
  await new Promise((resolve) => id = setTimeout(resolve, ms));
  clearTimeout(id);
  return;
};
