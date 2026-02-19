import { useState } from 'react'

export default function DirectInput({ onNext, onBack }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState(null)

  function handleSearch() {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setLoading(true)
    fetch(`/api/places/search?lat=37.5665&lng=126.9780&radius=15000&query=${encodeURIComponent(searchQuery)}`)
      .then(r => r.json())
      .then(data => {
        setSearchResults(data.places || [])
      })
      .catch(err => {
        console.error(err)
        setSearchResults([])
      })
      .finally(() => setLoading(false))
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  function handleSelectPlace(place) {
    setSelectedPlace(place)
    setSearchResults([])
    setSearchQuery('')
  }

  function handleNextStepSelect(type) {
    const placeWithHotspot = {
      ...selectedPlace,
      hotspot: { 
        name: selectedPlace.address?.split(' ')[1] || '서울',
        lat: selectedPlace.lat,
        lng: selectedPlace.lng
      }
    }

    if (type === 'restaurant') {
      onNext({ cafe: placeWithHotspot, nextType: 'restaurant' })
    } else if (type === 'cafe') {
      onNext({ restaurant: placeWithHotspot, nextType: 'cafe' })
    } else if (type === 'bar') {
      onNext({ restaurant: placeWithHotspot, nextType: 'bar' })
    } else if (type === 'both') {
      onNext({ restaurant: placeWithHotspot, nextType: 'both' })
    }
  }

  if (selectedPlace) {
    return (
      <div style={{ padding: '24px', paddingBottom: '40px' }}>
        <button onClick={() => setSelectedPlace(null)} style={{
          background: 'none', border: 'none', color: '#888',
          fontSize: '15px', cursor: 'pointer', padding: '0 0 12px 0',
          display: 'flex', alignItems: 'center', gap: '4px',
          WebkitTapHighlightColor: 'transparent',
        }}>
          ← 다시 검색하기
        </button>

        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', marginBottom: '8px' }}>
          선택 완료! 👍
        </h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
          주변에서 무엇을 더 찾을까요?
        </p>

        <div style={{
          background: '#fff8f5', borderRadius: '16px',
          padding: '16px', marginBottom: '24px',
          border: '1px solid #FFE0D0'
        }}>
          <p style={{ color: '#888', fontSize: '12px', marginBottom: '6px' }}>
            📍 선택한 장소
          </p>
          <p style={{ fontWeight: '800', fontSize: '16px', color: '#FF6B35', marginBottom: '4px' }}>
            {selectedPlace.name}
          </p>
          <p style={{ color: '#aaa', fontSize: '13px' }}>
            {selectedPlace.address?.split(' ').slice(0, 4).join(' ')}
          </p>
          {selectedPlace.rating && (
            <p style={{ color: '#FF6B35', fontSize: '13px', marginTop: '6px' }}>
              ⭐ {selectedPlace.rating.toFixed(1)}
              {selectedPlace.userRatingsTotal && (
                <span style={{ color: '#aaa' }}> ({selectedPlace.userRatingsTotal.toLocaleString()}개)</span>
              )}
            </p>
          )}
        </div>

        <div>
          <p style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a1a', marginBottom: '12px' }}>
            이 주변에서 무엇을 찾을까요?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { type: 'restaurant', emoji: '🍽️', label: '레스토랑', desc: '주변 맛집 찾기' },
              { type: 'cafe', emoji: '☕', label: '카페', desc: '주변 카페 찾기' },
              { type: 'bar', emoji: '🍺', label: '바/술집', desc: '주변 바 찾기' },
              { type: 'both', emoji: '✨', label: '카페 + 바 둘 다', desc: '카페와 바 모두 추천받기' },
            ].map(opt => (
              <button
                key={opt.type}
                onClick={() => handleNextStepSelect(opt.type)}
                style={{
                  padding: '16px', borderRadius: '14px',
                  border: '2px solid #f0f0f0',
                  background: opt.highlight ? '#fff8f5' : 'white',
                  cursor: 'pointer', textAlign: 'left',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '32px' }}>{opt.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      fontWeight: '700', fontSize: '16px', 
                      color: '#1a1a1a' 
                    }}>
                      {opt.label}
                    </p>
                    <p style={{ color: '#888', fontSize: '13px' }}>{opt.desc}</p>
                  </div>
                  <span style={{ color: opt.highlight ? '#FF6B35' : '#ccc', fontSize: '20px' }}>›</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: '#888',
          fontSize: '15px', cursor: 'pointer', padding: '0 0 12px 0',
          display: 'flex', alignItems: 'center', gap: '4px',
          WebkitTapHighlightColor: 'transparent',
        }}>
          ← 처음으로
        </button>

        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', marginBottom: '8px' }}>
          가려는 곳을 검색하세요 🔍
        </h1>
        <p style={{ color: '#888', fontSize: '14px' }}>
          레스토랑, 카페, 바 이름을 입력하고 Enter를 누르세요
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        {/* 검색창 + 버튼 */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="예: 스시 오마카세, 성수 카페, 강남 와인바"
            style={{
              width: '100%',
              padding: '16px',
              paddingRight: '80px', // 버튼 공간 확보
              borderRadius: '12px',
              border: '2px solid #f0f0f0',
              fontSize: '15px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={handleSearch}
            disabled={!searchQuery.trim()}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: searchQuery.trim() ? '#FF6B35' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: searchQuery.trim() ? 'pointer' : 'not-allowed',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            검색
          </button>
        </div>
        
        <p style={{ color: '#aaa', fontSize: '12px', marginTop: '8px' }}>
          💡 입력 후 Enter 키를 누르세요
        </p>
      </div>

      <div>
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔍</div>
            <p style={{ fontSize: '14px' }}>검색 중...</p>
          </div>
        )}

        {!loading && searchQuery && searchResults.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🤔</div>
            <p>검색 결과가 없어요</p>
            <p style={{ fontSize: '13px', marginTop: '8px', color: '#bbb' }}>
              다른 키워드로 검색해보세요
            </p>
          </div>
        )}

        {!loading && searchResults.length > 0 && (
          <>
            <p style={{ color: '#888', fontSize: '13px', marginBottom: '12px' }}>
              검색 결과 {searchResults.length}개
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {searchResults.map((place) => (
                <button
                  key={place.placeId}
                  onClick={() => handleSelectPlace(place)}
                  style={{
                    textAlign: 'left', padding: '16px', borderRadius: '16px',
                    border: '2px solid #f0f0f0', background: 'white',
                    cursor: 'pointer', width: '100%',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    {place.photoUrl && (
                      <div style={{
                        width: '60px', height: '60px', borderRadius: '10px',
                        overflow: 'hidden', flexShrink: 0,
                        background: '#f5f5f5',
                      }}>
                        <img
                          src={place.photoUrl}
                          alt={place.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => { e.target.style.display = 'none' }}
                        />
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a1a', marginBottom: '4px' }}>
                        {place.name}
                      </p>
                      <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '4px' }}>
                        {place.address?.split(' ').slice(0, 4).join(' ')}
                      </p>
                      {place.rating && (
                        <p style={{ color: '#FF6B35', fontSize: '13px' }}>
                          ⭐ {place.rating.toFixed(1)}
                          {place.userRatingsTotal && (
                            <span style={{ color: '#aaa' }}> ({place.userRatingsTotal.toLocaleString()}개)</span>
                          )}
                        </p>
                      )}
                    </div>
                    <span style={{ color: '#ccc', fontSize: '18px', flexShrink: 0 }}>›</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
