import { ImageFormats, ImageSize } from '../types/cdn.ts'

/** Function to get Image URL from a resource on Discord CDN */
export const ImageURL = (
  url: string,
  format: ImageFormats | undefined = 'webp',
  size: ImageSize | undefined = 128
): string => {
  size = size === undefined ? 128 : size
  if (url.includes('a_')) {
    return `${url}.${format === undefined ? 'gif' : format}?size=${size}`
  } else return `${url}.${format === 'gif' ? 'webp' : format}?size=${size}`
}