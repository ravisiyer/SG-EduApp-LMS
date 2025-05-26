const STRAPI_URL = process.env.EXPO_PUBLIC_STRAPI_API_URL ?? 'http://localhost:1337';

export const getStrapiMedia = (url?: string) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
};
