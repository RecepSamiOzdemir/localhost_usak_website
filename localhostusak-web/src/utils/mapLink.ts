// "Haritada Gör" butonu için güvenli bir href üretir.
// mapUrl alanına tam bir Google Maps linki yerine düz adres yazılmış olabilir;
// bu durumda tarayıcı href'i site içi göreli yol sanıp 404 döndürür.
// Bu fonksiyon girdiyi sınıflandırır ve daima geçerli bir href ya da null döndürür.
export function getMapHref(mapUrl?: string | null, location?: string | null): string | null {
  const raw = (mapUrl ?? '').trim();

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  const schemeLessPrefixes = [
    'www.',
    'maps.google.',
    'google.com/maps',
    'www.google.com/maps',
    'maps.app.goo.gl/',
    'goo.gl/maps',
  ];
  if (schemeLessPrefixes.some((prefix) => raw.toLowerCase().startsWith(prefix))) {
    return `https://${raw}`;
  }

  const query = raw || (location ?? '').trim();
  if (!query) {
    return null;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
