export const awaitSync = async (val: any | Promise<any>): Promise<any> => {
  return val instanceof Promise ? await val : val
}
