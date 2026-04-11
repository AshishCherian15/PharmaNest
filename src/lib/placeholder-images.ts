import data from './placeholder-images.json';
import { getProductImageTheme } from './product-image-theme';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;

const PLACEHOLDER_IMAGE_MAP = new Map(PlaceHolderImages.map((image) => [image.id, image]));

export function getPlaceholderImageById(imageId?: string) {
  if (!imageId) return undefined;
  return PLACEHOLDER_IMAGE_MAP.get(imageId);
}

export function getPlaceholderBlurDataURL(category?: string) {
  const theme = getProductImageTheme(category);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${theme.blurBase}" /><stop offset="100%" stop-color="${theme.blurAccent}" /></linearGradient></defs><rect width="24" height="24" fill="url(#g)" /></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
