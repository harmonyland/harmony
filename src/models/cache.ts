let caches: any = {}

const get = (cacheName: string, key: string) => {
  const gotCache: Map<string, any> = caches[cacheName]
  if (gotCache === undefined || !(gotCache instanceof Map)) {
    return undefined
  }

  const gotMap = gotCache.get(key)
  return gotMap
}

const set = (cacheName: string, key: string, value: any) => {
  let gotCache: Map<string, any> = caches[cacheName]
  if (gotCache === undefined || !(gotCache instanceof Map)) {
    gotCache = caches[cacheName] = new Map<string, any>()
  }

  gotCache.set(key, value)

  return value
}

const del = (cacheName: string, key: string) => {
  const gotCache: Map<string, any> = caches[cacheName]
  if (gotCache === undefined || !(gotCache instanceof Map)) {
    return
  }

  return gotCache.delete(key)
}

const deleteCache = (cacheName: string) => {
  const gotCache = caches[cacheName]
  if (gotCache === undefined) {
    return
  }

  delete caches[cacheName]
}

const resetCaches = () => {
  caches = {}
}

export { get, set, del, deleteCache, resetCaches }
