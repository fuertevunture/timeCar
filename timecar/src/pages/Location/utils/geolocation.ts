export type GeoResult = {
  lat: number
  lng: number
  city: string
  district: string
  province: string
}

function getBrowserPosition(timeout = 10_000): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("UNSUPPORTED"))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout,
      maximumAge: 300_000,
    })
  })
}

async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<{ city: string; district: string; province: string }> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=zh-CN&zoom=12`
  const res = await fetch(url, {
    headers: { "User-Agent": "timecar-app/1.0" },
  })
  if (!res.ok) throw new Error("GEOCODE_FAIL")
  const data = await res.json()
  const addr = data.address ?? {}
  return {
    city: addr.city || addr.town || addr.county || "",
    district: addr.suburb || addr.district || addr.neighbourhood || "",
    province: addr.state || addr.province || "",
  }
}

/**
 * 获取当前位置并逆地理编码。
 * 返回 GeoResult，失败时抛出带 code 的 Error。
 */
export async function fetchCurrentLocation(): Promise<GeoResult> {
  const pos = await getBrowserPosition()
  const { latitude: lat, longitude: lng } = pos.coords
  const geo = await reverseGeocode(lat, lng)
  return { lat, lng, ...geo }
}
