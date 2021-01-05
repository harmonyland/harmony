/** Delay by `ms` milliseconds */
export const delay = async (ms: number): Promise<true> =>
  await new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), ms)
  })
