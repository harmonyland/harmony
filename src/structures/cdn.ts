import type { ImageFormats, ImageSize } from '../types/cdn.ts'

/** Function to get Image URL from a resource on Discord CDN */
export const ImageURL = (
  url: string,
  format: ImageFormats = 'png',
  size: ImageSize = 128
): string => {
  if (url.includes('a_')) {
    return `${url}.${format === 'dynamic' ? 'gif' : format}?size=${size}`
  } else
    return `${url}.${
      format === 'gif' || format === 'dynamic' ? 'png' : format
    }?size=${size}`
}
