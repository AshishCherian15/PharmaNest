type ProductCategory = string | undefined;

type ProductImageTheme = {
  glyph: string;
  fallbackGradientClass: string;
  placeholderBgHex: string;
  placeholderTextHex: string;
  blurBase: string;
  blurAccent: string;
};

const DEFAULT_THEME: ProductImageTheme = {
  glyph: '💊',
  fallbackGradientClass: 'from-stitch-primary-fixed/20 via-white to-stitch-secondary-fixed/20',
  placeholderBgHex: 'EAF8F2',
  placeholderTextHex: '0C6B4A',
  blurBase: '#EAF8F2',
  blurAccent: '#CDEEE0',
};

const CATEGORY_THEME: Record<string, ProductImageTheme> = {
  'Medical Devices': {
    glyph: '🩺',
    fallbackGradientClass: 'from-blue-100 via-white to-blue-50',
    placeholderBgHex: 'EEF6FF',
    placeholderTextHex: '1D4ED8',
    blurBase: '#EEF6FF',
    blurAccent: '#D6E7FF',
  },
  'Personal Care': {
    glyph: '🧴',
    fallbackGradientClass: 'from-teal-100 via-white to-cyan-50',
    placeholderBgHex: 'F5FFFD',
    placeholderTextHex: '0F766E',
    blurBase: '#F5FFFD',
    blurAccent: '#CCFBF1',
  },
  'Baby Care': {
    glyph: '🍼',
    fallbackGradientClass: 'from-pink-100 via-white to-rose-50',
    placeholderBgHex: 'FFF4FB',
    placeholderTextHex: '9D174D',
    blurBase: '#FFF4FB',
    blurAccent: '#FBCFE8',
  },
  Vitamins: {
    glyph: '💪',
    fallbackGradientClass: 'from-amber-100 via-white to-yellow-50',
    placeholderBgHex: 'FFFCEB',
    placeholderTextHex: 'A16207',
    blurBase: '#FFFCEB',
    blurAccent: '#FDE68A',
  },
  'Pain Relief': {
    glyph: '💊',
    fallbackGradientClass: 'from-red-100 via-white to-orange-50',
    placeholderBgHex: 'FFF5F5',
    placeholderTextHex: 'B91C1C',
    blurBase: '#FFF5F5',
    blurAccent: '#FECACA',
  },
  Painkiller: {
    glyph: '💊',
    fallbackGradientClass: 'from-red-100 via-white to-orange-50',
    placeholderBgHex: 'FFF5F5',
    placeholderTextHex: 'B91C1C',
    blurBase: '#FFF5F5',
    blurAccent: '#FECACA',
  },
};

export function getProductImageTheme(category?: ProductCategory): ProductImageTheme {
  if (!category) return DEFAULT_THEME;
  return CATEGORY_THEME[category] ?? DEFAULT_THEME;
}
