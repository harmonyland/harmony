const encoder = new TextEncoder()
const decoder = new TextDecoder('utf-8')

export function encodeText(str: string): Uint8Array {
  return encoder.encode(str)
}

export function decodeText(bytes: Uint8Array): string {
  return decoder.decode(bytes)
}
