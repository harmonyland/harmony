/** Delay by `ms` milliseconds */
export const delay = async (ms: number): Promise<true> =>
  await new Promise((resolve) => {
    setTimeout(() => resolve(true), ms)
  })
