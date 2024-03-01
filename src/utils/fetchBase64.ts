import { encodeBase64 } from '../../deps.ts'

export const fetchRemote = async (
  url: URL,
  onlyData = false
): Promise<string> => {
  const resp = await fetch(url)
  if (resp.status !== 200)
    throw new Error(`Request Failed. Server responsed with code ${resp.status}`)
  const contentType =
    resp.headers.get('content-type') ?? 'application/octet-stream'
  const buff = await resp.arrayBuffer()
  const data = encodeBase64(buff)
  return onlyData ? data : `data:${contentType};base64,${data}`
}

export const fetchLocal = async (
  url: string | URL,
  onlyData = false
): Promise<string> => {
  const file = await Deno.readFile(url)
  const data = encodeBase64(file)
  const href = typeof url === 'string' ? url : url.href
  const contentType = `image/${href.split('.').reverse()[0]}`
  return onlyData ? data : `data:${contentType};base64,${data}`
}

export const fetchAuto = async (
  path: string,
  onlyData = false
): Promise<string> => {
  try {
    const url = new URL(path)
    if (url.protocol.startsWith('http')) return await fetchRemote(url, onlyData)
    else return await fetchLocal(url, onlyData)
  } catch (e) {
    return await fetchLocal(path, onlyData)
  }
}
