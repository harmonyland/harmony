const encoder = new TextEncoder()
const decoder = new TextDecoder('utf-8')

export function encodeText(str: string): Uint8Array {
  return encoder.encode(str)
}

export function decodeText(bytes: Uint8Array): string {
  return decoder.decode(bytes)
}

export async function decompress(data: Uint8Array): Promise<Uint8Array> {
  const ds = new DecompressionStream('deflate')

  const blob = new Blob([data as BufferSource])
  const stream = blob.stream().pipeThrough(ds)

  const response = new Response(stream)
  const buffer = await response.arrayBuffer()

  return new Uint8Array(buffer)
}
