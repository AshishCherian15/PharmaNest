const PRODUCT_IMAGE_GALLERIES: Record<string, string[]> = {
  LPROD001: ['lprod-image-1', 'lprod-image-5', 'lprod-image-10'],
  LPROD002: ['lprod-image-2', 'lprod-image-8', 'cat-image-1'],
  LPROD003: ['lprod-image-3', 'lprod-image-9', 'cat-image-3'],
  LPROD004: ['lprod-image-4', 'lprod-image-12', 'cat-image-4'],
  LPROD005: ['lprod-image-5', 'lprod-image-1', 'med-image-10'],
  LPROD006: ['lprod-image-6', 'lprod-image-11', 'cat-image-5'],
  LPROD007: ['lprod-image-7', 'cat-image-6', 'lprod-image-1'],
  LPROD008: ['lprod-image-8', 'lprod-image-2', 'cat-image-1'],
  LPROD009: ['lprod-image-9', 'lprod-image-3', 'cat-image-3'],
  LPROD010: ['lprod-image-10', 'lprod-image-1', 'med-image-10'],
  LPROD011: ['lprod-image-11', 'lprod-image-6', 'cat-image-5'],
  LPROD012: ['lprod-image-12', 'lprod-image-4', 'cat-image-4'],
  LPROD013: ['med-image-2', 'med-image-7', 'cat-image-4'],
  MED001: ['med-image-1', 'med-image-3', 'cat-image-5'],
  MED002: ['med-image-2', 'med-image-7', 'cat-image-4'],
  MED003: ['med-image-3', 'med-image-1', 'cat-image-5'],
  MED004: ['med-image-4', 'med-image-9', 'cat-image-2'],
  MED005: ['med-image-5', 'med-image-1', 'cat-image-5'],
  MED006: ['med-image-6', 'med-image-3', 'cat-image-2'],
  MED007: ['med-image-7', 'med-image-10', 'cat-image-2'],
  MED008: ['med-image-8', 'med-image-2', 'cat-image-4'],
  MED009: ['med-image-9', 'med-image-4', 'cat-image-2'],
  MED010: ['med-image-10', 'med-image-7', 'cat-image-2'],
};

export function getProductGalleryImageIds(
  productId: string,
  fallbackImageId: string,
  relatedImageIds: string[]
) {
  const mapped = PRODUCT_IMAGE_GALLERIES[productId] ?? [];

  return [...mapped, ...relatedImageIds]
    .filter((id) => id && id !== fallbackImageId)
    .filter((id, idx, arr) => arr.indexOf(id) === idx)
    .slice(0, 3);
}
