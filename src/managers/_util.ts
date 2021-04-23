import {
  MessageComponentData,
  MessageComponentPayload
} from '../types/messageComponents.ts'

export function transformComponent(
  d: MessageComponentData[]
): MessageComponentPayload[] {
  return d.map((e: any) => {
    if (e.customID !== undefined) {
      e.custom_id = e.customID
      delete e.customID
    }
    if (e.components !== undefined) {
      e.components = transformComponent(e.components)
    }
    return e
  })
}
