import { useEffect, useRef, useState } from 'react'
import { getTypeLabel } from '../placeTypes'

export default function FinalCourse({ selections, onRestart, onBack }) {
  const mapRef = useRef(null)
  const [walkingTimes, setWalkingTimes] = useState([])

  const haversineMeters = (a, b) => {
    if (!a || !b) return null
    const R = 6371000
    const toRad = (d) => (d * Math.PI) / 180
    const dLat = toRad(b.lat - a.lat)
    const dLng = toRad(b.lng - a.lng)
    const lat1 = toRad(a.lat)
    const lat2 = toRad(b.lat)
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
    return Math.round(R * c)
  }

  useEffect(() => {
    function initMap() {
      const places = (selections.routePlaces && selections.routePlaces.length)
        ? selections.routePlaces
        : [selections.restaurant, selections.restaurant2, selections.cafe, selections.cafe2].filter(Boolean)
      if (places.length === 0 || !mapRef.current) return

      const center = new window.kakao.maps.LatLng(places[0].lat, places[0].lng)
      const map = new window.kakao.maps.Map(mapRef.current, { center, level: 4 })

      const icons = ['🍽️', '☕', '🍺']
      places.forEach((place, idx) => {
        new window.kakao.maps.InfoWindow({
          content: '<div style="padding:6px 10px;font-size:13px;font-weight:700;color:#f0f0f0">' + icons[idx] + ' ' + place.name + '</div>'
        }).open(map, new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(place.lat, place.lng),
          map,
        }))
      })

      const times = []
      for (let i = 0; i < places.length - 1; i++) {
        const dist = places[i + 1].distanceMeters || haversineMeters(places[i], places[i + 1])
        if (!dist) { times.push(null); continue }
        times.push({
          minutes: Math.max(1, Math.ceil(dist / 67)),
          distance: dist < 1000 ? dist + 'm' : (dist / 1000).toFixed(1) + 'km'
        })
      }
      setWalkingTimes(times)

      const bounds = new window.kakao.maps.LatLngBounds()
      places.forEach(p => bounds.extend(new window.kakao.maps.LatLng(p.lat, p.lng)))
      map.setBounds(bounds)
    }

    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(initMap)
    }
  }, [])

  const { restaurant, cafe, cafe2, hotspot, occasion, courseOrder = [] } = selections
  const { restaurant2 } = selections
  
  // Prefer a concrete ordered list if provided
  const orderedPlaces = []
  const orderedIcons = []

  if (selections.routePlaces && selections.routePlaces.length) {
    selections.routePlaces.forEach((p, idx) => {
      orderedPlaces.push(p)
      orderedIcons.push(['🍽️','☕','🍺','🍽️'][idx] || '📍')
    })
  } else {
    const usedSecondRestaurant = { value: false }
    courseOrder.forEach(type => {
      if (type === 'restaurant') {
        if (!usedSecondRestaurant.value && restaurant) {
          orderedPlaces.push(restaurant)
          orderedIcons.push('🍽️')
          usedSecondRestaurant.value = true
        } else if (restaurant2) {
          orderedPlaces.push(restaurant2)
          orderedIcons.push('🍽️')
        }
      } else if (type === 'cafe' && cafe) {
        orderedPlaces.push(cafe)
        orderedIcons.push('☕')
      } else if (type === 'bar' && (cafe2 || cafe)) {
        orderedPlaces.push(cafe2 || cafe)
        orderedIcons.push('🍺')
      }
    })
  }

  if (orderedPlaces.length === 0) {
    if (restaurant) {
      orderedPlaces.push(restaurant)
      orderedIcons.push('🍽️')
    }
    if (restaurant2) {
      orderedPlaces.push(restaurant2)
      orderedIcons.push('🍽️')
    }
    if (cafe) {
      orderedPlaces.push(cafe)
      orderedIcons.push('☕')
    }
    if (cafe2) {
      orderedPlaces.push(cafe2)
      orderedIcons.push('🍺')
    }
  }

  function handleKakaoShare() {
    if (!window.Kakao) return
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init('2785551c281261a2c8d7d214eaad05e8')
    }

    // 최소 데이터만 (이름만, 좌표도 소수점 4자리만)
    const shareData = {
      h: hotspot?.name || '',
      r: restaurant ? {
        n: restaurant.name,
        x: Number(restaurant.lat.toFixed(4)),
        y: Number(restaurant.lng.toFixed(4))
      } : null,
      c: cafe ? {
        n: cafe.name,
        x: Number(cafe.lat.toFixed(4)),
        y: Number(cafe.lng.toFixed(4))
      } : null,
    }

    const shareUrl = 'https://coursemate-xi.vercel.app?s=' + btoa(JSON.stringify(shareData))

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: (hotspot?.name || '서울') + ' 코스 🗺️',
        description: orderedPlaces.map((p, i) => orderedIcons[i] + ' ' + p.name).join('  →  '),
        imageUrl: 'https://coursemate-xi.vercel.app/og-image.png',
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '코스 보기 🗺️',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    })
  }

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ padding: '24px 24px 16px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[1,2,3,4,5,6,7].map(i => (
            <div key={i} style={{
              flex: 1, height: '4px', borderRadius: '2px', background: '#f0f0f0'
            }} />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          {onBack && (
            <button onClick={onBack} style={{
              background: 'none', border: 'none', color: '#888',
              fontSize: '14px', cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', gap: '4px'
            }}>
              ← 이전으로
            </button>
          )}
          
          <button onClick={onRestart} style={{
            background: '#f5f5f5', border: 'none',
            borderRadius: '8px', padding: '6px 12px',
            fontSize: '14px', fontWeight: '700', color: '#666',
            cursor: 'pointer'
          }}>
            🏠 처음으로
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎉</div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a1a' }}>
            코스 완성!
          </h1>
          <p style={{ color: '#888', fontSize: '14px', marginTop: '6px' }}>
            📍 {hotspot?.name} · {occasion}
          </p>
        </div>
      </div>

      <div style={{ padding: '0 24px', marginBottom: '20px' }}>
        <div ref={mapRef} style={{
          width: '100%', height: '280px',
          borderRadius: '16px', border: '2px solid #f0f0f0',
          background: '#f5f5f5',
        }} />
      </div>

      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <div style={{
          background: 'white', borderRadius: '16px',
          padding: '20px', border: '1px solid #FFE0D0'
        }}>
          {orderedPlaces.map((place, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: '#f0f0f0', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: '900', flexShrink: 0
                }}>
                  {idx + 1}
                </div>

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
                    <span style={{ fontSize: '32px' }}>{orderedIcons[idx]}</span>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '700', color: '#1a1a1a', fontSize: '15px' }}>
                    {place?.name}
                  </p>
                  {getTypeLabel(place?.primaryType) && (
                    <span style={{
                      display: 'inline-block', background: '#f5f5f5',
                      borderRadius: '6px', padding: '2px 8px',
                      fontSize: '12px', color: '#666', marginTop: '2px'
                    }}>
                      {getTypeLabel(place?.primaryType)}
                    </span>
                  )}
                  <p style={{ color: '#aaa', fontSize: '13px', marginTop: '4px' }}>
                    {place?.address?.split(' ').slice(0, 3).join(' ')}
                  </p>
                  {place?.rating && (
                    <p style={{ color: '#666', fontSize: '13px', marginTop: '2px' }}>
                      ⭐ {place.rating.toFixed(1)}
                      {place.userRatingsTotal && (
                        <span style={{ color: '#aaa' }}> ({place.userRatingsTotal.toLocaleString()}개)</span>
                      )}
                    </p>
                  )}
                </div>

                {place?.kakaoMapUrl && (
                  <a href={place.kakaoMapUrl} target="_blank" rel="noopener noreferrer"
                    style={{background:'#FEE500',borderRadius:'8px',padding:'6px 10px',fontSize:'12px',fontWeight:'700',color:'#1a1a1a',textDecoration:'none',flexShrink:0}}>
                    지도
                  </a>
                )}
              </div>

              {idx < orderedPlaces.length - 1 && walkingTimes[idx] && (
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                  <span style={{ color: '#666', fontSize: '16px', fontWeight: '700' }}>
                    ↓ 🚶 도보
                  </span>
                  <span style={{
                    background: 'white', border: '1px solid #FFE0D0',
                    borderRadius: '20px', padding: '4px 12px',
                    fontSize: '13px', color: '#666',
                    fontWeight: '600', marginLeft: '8px'
                  }}>
                    약 {walkingTimes[idx].minutes}분
                    <span style={{ color: '#aaa', marginLeft: '4px' }}>({walkingTimes[idx].distance})</span>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 24px', marginBottom: '12px' }}>
        <button onClick={handleKakaoShare} style={{
          background: '#FEE500', color: '#1a1a1a', border: 'none',
          padding: '16px', borderRadius: '12px',
          fontSize: '16px', fontWeight: '700', cursor: 'pointer',
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px',
          WebkitTapHighlightColor: 'transparent',
        }}>
          💬 카카오톡으로 공유하기
        </button>
      </div>

      <div style={{ padding: '0 24px' }}>
        <button onClick={onRestart} style={{
          background: '#f0f0f0', color: 'white', border: 'none',
          padding: '16px', borderRadius: '12px',
          fontSize: '16px', fontWeight: '700', cursor: 'pointer',
          width: '100%',
          WebkitTapHighlightColor: 'transparent',
        }}>
          새 코스 만들기 🗺️
        </button>
      </div>
    </div>
  )
}
