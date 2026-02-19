import { useState, useEffect } from 'react'
import { getTypeLabel } from '../placeTypes'

function StarRating({ rating }) {
  if (!rating) return <span style={{ color: '#ccc', fontSize: '13px' }}>평점 없음</span>
  const stars = Math.round(rating)
  return (
    <span style={{ fontSize: '13px' }}>
      {'⭐'.repeat(stars)}{'☆'.repeat(5 - stars)}
      <span style={{ color: '#FF6B35', fontWeight: '700', marginLeft: '4px' }}>{rating.toFixed(1)}</span>
    </span>
  )
}

function PriceLevel({ level }) {
  if (!level) return null
  const won = '₩'.repeat(level)
  const gray = '₩'.repeat(4 - level)
  return (
    <span style={{ fontSize: '13px' }}>
      <span style={{ color: '#FF6B35', fontWeight: '700' }}>{won}</span>
      <span style={{ color: '#ddd' }}>{gray}</span>
    </span>
  )
}

function haversineMeters(lat1, lon1, lat2, lon2) {
  const toRad = x => (x * Math.PI) / 180
  const R = 6371000
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2
  return 2 * R * Math.asin(Math.sqrt(a))
}

export default function RestaurantList({ selections, onNext, onBack, referencePoint }) {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('rating')

  const basePoint = referencePoint || selections.hotspot

  useEffect(() => {
    console.log('RestaurantList mounted')
    console.log('basePoint:', basePoint)
    console.log('selections:', selections)
    
    if (!basePoint || !basePoint.lat || !basePoint.lng) {
      console.error('No valid basePoint!')
      setError('위치 정보가 없습니다')
      setLoading(false)
      return
    }
    
    setLoading(true)
    setError(null)

    const cuisineParam = selections.restaurantCuisine && selections.restaurantCuisine !== 'all' 
      ? '&cuisine=' + selections.restaurantCuisine 
      : ''

    const url = '/api/places/search?type=restaurant&lat=' + basePoint.lat + '&lng=' + basePoint.lng + '&radius=1000' + cuisineParam
    console.log('Fetching URL:', url)

    fetch(url)
      .then(r => {
        console.log('Response status:', r.status)
        return r.json()
      })
      .then(data => {
        console.log('API response:', data)
        if (data.error) throw new Error(data.error)
        const placesWithDist = (data.places || []).map(p => ({
          ...p,
          distanceMeters: (p.lat && p.lng)
            ? Math.round(haversineMeters(basePoint.lat, basePoint.lng, p.lat, p.lng))
            : p.distanceMeters
        }))
        console.log('Processed places:', placesWithDist.length)
        setPlaces(placesWithDist)
      })
      .catch(err => {
        console.error('Fetch error:', err)
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [basePoint])

  const sortedPlaces = [...places].sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0)
    } else if (sortBy === 'reviews') {
      return (b.userRatingsTotal || 0) - (a.userRatingsTotal || 0)
    } else if (sortBy === 'distance') {
      return (a.distanceMeters || 9999) - (b.distanceMeters || 9999)
    }
    return 0
  })

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{
              flex: 1, height: '4px', borderRadius: '2px',
              background: i <= 6 ? '#FF6B35' : '#f0f0f0'
            }} />
          ))}
        </div>

        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: '#888',
          fontSize: '15px', cursor: 'pointer', padding: '0 0 12px 0',
          display: 'flex', alignItems: 'center', gap: '4px',
          WebkitTapHighlightColor: 'transparent',
        }}>← 이전으로</button>

        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a1a' }}>
          🍽️ 레스토랑 선택
        </h1>

        <div style={{
          background: '#fff8f5', borderRadius: '12px',
          padding: '12px 16px', marginTop: '12px',
          border: '1px solid #FFE0D0'
        }}>
          {referencePoint ? (
            <>
              <p style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>선택한 장소</p>
              <p style={{ color: '#FF6B35', fontWeight: '700', fontSize: '15px' }}>
                {referencePoint.name}
              </p>
              <p style={{ color: '#aaa', fontSize: '12px', marginTop: '4px' }}>
                📍 근처 1km 이내 레스토랑 추천
              </p>
            </>
          ) : (
            <>
              <p style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>선택한 지역</p>
              <p style={{ color: '#FF6B35', fontWeight: '700', fontSize: '15px' }}>
                {basePoint?.name || '알 수 없음'}
              </p>
              <p style={{ color: '#aaa', fontSize: '12px', marginTop: '4px' }}>
                📍 주변 1km 이내 레스토랑 추천
              </p>
            </>
          )}
        </div>

        {!loading && places.length > 0 && (
          <div style={{
            display: 'flex', gap: '8px', marginTop: '16px',
            borderBottom: '1px solid #f0f0f0', paddingBottom: '12px'
          }}>
            <button
              onClick={() => setSortBy('rating')}
              style={{
                background: sortBy === 'rating' ? '#fff8f5' : 'transparent',
                color: sortBy === 'rating' ? '#FF6B35' : '#888',
                border: sortBy === 'rating' ? '1px solid #FFE0D0' : '1px solid transparent',
                borderRadius: '8px', padding: '6px 12px',
                fontSize: '13px', fontWeight: '700',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              별점순
            </button>
            <button
              onClick={() => setSortBy('reviews')}
              style={{
                background: sortBy === 'reviews' ? '#fff8f5' : 'transparent',
                color: sortBy === 'reviews' ? '#FF6B35' : '#888',
                border: sortBy === 'reviews' ? '1px solid #FFE0D0' : '1px solid transparent',
                borderRadius: '8px', padding: '6px 12px',
                fontSize: '13px', fontWeight: '700',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              리뷰순
            </button>
            <button
              onClick={() => setSortBy('distance')}
              style={{
                background: sortBy === 'distance' ? '#fff8f5' : 'transparent',
                color: sortBy === 'distance' ? '#FF6B35' : '#888',
                border: sortBy === 'distance' ? '1px solid #FFE0D0' : '1px solid transparent',
                borderRadius: '8px', padding: '6px 12px',
                fontSize: '13px', fontWeight: '700',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              거리순
            </button>
          </div>
        )}
      </div>

      <div style={{ padding: '16px 24px 0' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🍽️</div>
            <p>근처 레스토랑 찾는 중...</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>😢</div>
            <p>장소를 불러오지 못했어요</p>
            <p style={{ fontSize: '12px', marginTop: '8px', color: '#ff6b35' }}>{error}</p>
          </div>
        )}

        {!loading && !error && places.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🤔</div>
            <p>근처에 레스토랑이 없어요</p>
            <p style={{ fontSize: '12px', marginTop: '8px', color: '#aaa' }}>
              다른 지역을 선택해보세요
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sortedPlaces.map((place, idx) => (
            <button
              key={place.placeId}
              onClick={() => onNext(place)}
              style={{
                textAlign: 'left', padding: '16px', borderRadius: '16px',
                border: '2px solid #f0f0f0', background: 'white',
                cursor: 'pointer', width: '100%',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '12px',
                  overflow: 'hidden', flexShrink: 0,
                  background: '#f5f5f5', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  {place.photoUrl ? (
                    <img
                      src={place.photoUrl}
                      alt={place.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  ) : (
                    <span style={{ fontSize: '28px' }}>🍽️</span>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{
                      background: idx < 3 ? '#FF6B35' : '#f0f0f0',
                      color: idx < 3 ? 'white' : '#888',
                      borderRadius: '6px', padding: '1px 6px',
                      fontSize: '11px', fontWeight: '700', flexShrink: 0
                    }}>
                      {idx + 1}위
                    </span>
                    <span style={{
                      fontWeight: '700', fontSize: '15px', color: '#1a1a1a',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {place.name}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <StarRating rating={place.rating} />
                    {place.userRatingsTotal && (
                      <span style={{ color: '#aaa', fontSize: '12px' }}>
                        ({place.userRatingsTotal.toLocaleString()})
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {getTypeLabel(place.primaryType) && (
                      <span style={{
                        background: '#f5f5f5', borderRadius: '6px',
                        padding: '2px 6px', fontSize: '11px', color: '#666'
                      }}>
                        {getTypeLabel(place.primaryType)}
                      </span>
                    )}
                    <PriceLevel level={place.priceLevel} />
                    {place.distanceMeters && (
                      <span style={{
                        background: '#f5f5f5', borderRadius: '6px',
                        padding: '2px 6px', fontSize: '11px', color: '#666'
                      }}>
                        🚶 {place.distanceMeters < 1000
                          ? place.distanceMeters + 'm'
                          : (place.distanceMeters/1000).toFixed(1) + 'km'}
                      </span>
                    )}
                  </div>
                </div>
                <span style={{ color: '#ccc', fontSize: '18px', flexShrink: 0 }}>›</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
