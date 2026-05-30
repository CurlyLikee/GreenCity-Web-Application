/** GreenCity hash-route base (assignment requirement). */
export const GREEN_CITY_BASE = 'https://www.greencity.cx.ua/#/greenCity';

export function greenCityUrl(path = ''): string {
  if (!path || path === '/') {
    return GREEN_CITY_BASE;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${GREEN_CITY_BASE}${normalized}`;
}
