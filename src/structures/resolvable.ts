export interface IResolvable<T> {
  id: string
  get: () => Promise<T | undefined>
  fetch: () => Promise<T>
  resolve: () => Promise<T | undefined>
}
