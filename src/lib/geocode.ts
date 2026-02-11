import { db } from "@/lib/db";

function normalizeAddress(
  street: string,
  city: string,
  state: string,
  zip: string
): string {
  return `${street.trim().toLowerCase()}, ${city.trim().toLowerCase()}, ${state.trim().toLowerCase()} ${zip.trim()}`;
}

export async function geocodeAddress(
  street: string,
  city: string,
  state: string,
  zip: string
): Promise<{ latitude: number; longitude: number } | null> {
  const normalizedAddress = normalizeAddress(street, city, state, zip);

  // Check cache first
  const cached = await db.geocodedAddress.findUnique({
    where: { normalizedAddress },
  });
  if (cached) {
    return { latitude: cached.latitude, longitude: cached.longitude };
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  const address = encodeURIComponent(`${street}, ${city}, ${state} ${zip}`);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === "OK" && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      const coords = { latitude: lat, longitude: lng };

      // Save to cache
      await db.geocodedAddress.upsert({
        where: { normalizedAddress },
        create: { normalizedAddress, ...coords },
        update: coords,
      });

      return coords;
    }

    return null;
  } catch {
    return null;
  }
}
