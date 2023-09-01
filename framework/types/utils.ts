export type SelectivePartial<T, K extends keyof T> = Partial<T> & Omit<T, K>;
