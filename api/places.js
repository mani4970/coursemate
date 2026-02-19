export const config = {
  runtime: 'edge',
}

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

const CUISINE_TEXT = {
  korean: '한식 레스토랑',
  japanese: '일식 레스토랑',
  chinese: '중식 레스토랑',
  western: '양식 레스토랑',
  meat: '고기 레스토랑',
  seafood: '해산물 레스토랑',
}

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const lat = parseFloat(searchParams.get('lat'))
    const lng = parseFloat(searchParams.get('lng'))
    const radius = parseInt(searchParams.get('radius')) || 1000
    const query = searchParams.get('query')
    const cuisine = searchParams.get('cuisine')

    // 직접 검색
    if (query) {
      const searchQuery = query + ' 서울'
      
      const googleRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.primaryType,places.priceLevel'
        },
        body: JSON.stringify({
          textQuery: searchQuery,
          languageCode: 'ko',
          regionCode: 'KR',
          maxResultCount: 20,
        })
      })

      const data = await googleRes.json()
      const places = (data.places || []).map(p => ({
        placeId: p.id,
        name: p.displayName?.text || '',
        address: p.formattedAddress || '',
        lat: p.location?.latitude,
        lng: p.location?.longitude,
        rating: p.rating,
        userRatingsTotal: p.userRatingCount,
        photoUrl: p.photos?.[0] 
          ? `https://places.googleapis.com/v1/${p.photos[0].name}/media?key=${GOOGLE_API_KEY}&maxHeightPx=400`
          : null,
        primaryType: p.primaryType,
        priceLevel: p.priceLevel,
        kakaoMapUrl: `https://map.kakao.com/link/map/${encodeURIComponent(p.displayName?.text || '')},${p.location?.latitude},${p.location?.longitude}`
      }))

      return new Response(JSON.stringify({ places }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 음식 카테고리가 있으면 searchText 사용
    if (type === 'restaurant' && cuisine && cuisine !== 'all' && CUISINE_TEXT[cuisine]) {
      const textQuery = CUISINE_TEXT[cuisine]
      
      const googleRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.primaryType,places.priceLevel'
        },
        body: JSON.stringify({
          textQuery: textQuery,
          languageCode: 'ko',
          regionCode: 'KR',
          maxResultCount: 20,
          locationBias: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius: radius
            }
          }
        })
      })

      const data = await googleRes.json()
      let places = (data.places || []).map(p => ({
        placeId: p.id,
        name: p.displayName?.text || '',
        address: p.formattedAddress || '',
        lat: p.location?.latitude,
        lng: p.location?.longitude,
        rating: p.rating,
        userRatingsTotal: p.userRatingCount,
        photoUrl: p.photos?.[0] 
          ? `https://places.googleapis.com/v1/${p.photos[0].name}/media?key=${GOOGLE_API_KEY}&maxHeightPx=400`
          : null,
        primaryType: p.primaryType,
        priceLevel: p.priceLevel,
        distanceMeters: haversineDistance(lat, lng, p.location?.latitude, p.location?.longitude),
        kakaoMapUrl: `https://map.kakao.com/link/map/${encodeURIComponent(p.displayName?.text || '')},${p.location?.latitude},${p.location?.longitude}`
      }))

      // 반경 내만 필터
      places = places.filter(p => p.distanceMeters && p.distanceMeters <= radius)

      const sorted = places.sort((a, b) => {
        const aScore = (a.rating || 0) * Math.log10((a.userRatingsTotal || 0) + 10)
        const bScore = (b.rating || 0) * Math.log10((b.userRatingsTotal || 0) + 10)
        return bScore - aScore
      })

      return new Response(JSON.stringify({ places: sorted }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 카페/바 또는 전체 레스토랑 - searchNearby 사용
    // Google Places types: bars are often categorized as pub/night_club in Korea.
    // We broaden the includedTypes and then filter by primaryType to reduce "bar but restaurant" mismatches.
    const includedTypes =
      type === 'restaurant' ? ['restaurant'] :
      type === 'cafe' ? ['cafe', 'coffee_shop'] :
      ['bar', 'pub', 'night_club']

    const googleRes = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.primaryType,places.priceLevel'
      },
      body: JSON.stringify({
        includedTypes,
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: radius
          }
        },
        maxResultCount: 20,
        rankPreference: 'POPULARITY',
        languageCode: 'ko',
        regionCode: 'KR'
      })
    })

    const data = await googleRes.json()

    const allowedPrimaryTypes = new Set(
      type === 'restaurant' ? ['restaurant'] :
      type === 'cafe' ? ['cafe', 'coffee_shop'] :
      ['bar', 'pub', 'night_club']
    )
    
    let places = (data.places || []).map(p => ({
      placeId: p.id,
      name: p.displayName?.text || '',
      address: p.formattedAddress || '',
      lat: p.location?.latitude,
      lng: p.location?.longitude,
      rating: p.rating,
      userRatingsTotal: p.userRatingCount,
      photoUrl: p.photos?.[0] 
        ? `https://places.googleapis.com/v1/${p.photos[0].name}/media?key=${GOOGLE_API_KEY}&maxHeightPx=400`
        : null,
      primaryType: p.primaryType,
      priceLevel: p.priceLevel,
      distanceMeters: haversineDistance(lat, lng, p.location?.latitude, p.location?.longitude),
      kakaoMapUrl: `https://map.kakao.com/link/map/${encodeURIComponent(p.displayName?.text || '')},${p.location?.latitude},${p.location?.longitude}`
    }))

    // Filter out obvious mismatches (e.g., bar list that mostly returns restaurants)
    if (type !== 'restaurant') {
      places = places.filter(p => !p.primaryType || allowedPrimaryTypes.has(p.primaryType))
    }

    const sorted = places.sort((a, b) => {
      const aScore = (a.rating || 0) * Math.log10((a.userRatingsTotal || 0) + 10)
      const bScore = (b.rating || 0) * Math.log10((b.userRatingsTotal || 0) + 10)
      return bScore - aScore
    })

    return new Response(JSON.stringify({ places: sorted }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Search error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null
  const toRad = x => (x * Math.PI) / 180
  const R = 6371000
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2
  return Math.round(2 * R * Math.asin(Math.sqrt(a)))
}
