let caches: any = {}

const get = (cacheName: string, key: string): any => {
  const gotCache: Map<string, any> = caches[cacheName]
  if (gotCache === undefined || !(gotCache instanceof Map)) {
    return undefined
  }

  const gotMap = gotCache.get(key)
  return gotMap
}

const set = (cacheName: string, key: string, value: any): any => {
  let gotCache: Map<string, any> = caches[cacheName]
  if (gotCache === undefined || !(gotCache instanceof Map)) {
    gotCache = caches[cacheName] = new Map<string, any>()
  }

  gotCache.set(key, value)

  return value
}

const del = (cacheName: string, key: string): boolean | undefined => {
  const gotCache: Map<string, any> = caches[cacheName]
  if (gotCache === undefined || !(gotCache instanceof Map)) {
    return
  }

  return gotCache.delete(key)
}

const deleteCache = (cacheName: string): void => {
  const gotCache = caches[cacheName]
  if (gotCache === undefined) {
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete caches[cacheName]
}

const resetCaches = (): void => {
  caches = {}
}

export { get, set, del, deleteCache, resetCaches }
