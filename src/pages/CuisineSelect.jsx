import { useState } from 'react'

export default function CuisineSelect({ selections, onNext, onBack, onHome }) {
  const [tempSelections, setTempSelections] = useState({
    restaurantCuisine: selections.restaurantCuisine || 'all',
    cafeCuisine: selections.cafeCuisine || 'all',
    barCuisine: selections.barCuisine || 'all',
  })

  const courseOrder = selections.courseOrder || []

  const restaurantOptions = [
    { id: 'all', label: '전체', emoji: '🍽️', desc: '모든 레스토랑' },
    { id: 'korean', label: '한식', emoji: '🍚', desc: '한식당, 고깃집' },
    { id: 'japanese', label: '일식', emoji: '🍱', desc: '스시, 라멘, 이자카야' },
    { id: 'chinese', label: '중식', emoji: '🥢', desc: '중화요리' },
    { id: 'western', label: '양식', emoji: '🍝', desc: '이탈리안, 프렌치' },
    { id: 'meat', label: '고기/스테이크', emoji: '🥩', desc: '바베큐, 스테이크' },
    { id: 'seafood', label: '해산물', emoji: '🦞', desc: '횟집, 해산물' },
  ]

  const cafeOptions = [
    { id: 'all', label: '전체', emoji: '☕', desc: '모든 카페' },
    { id: 'cafe', label: '카페/커피', emoji: '☕', desc: '커피 전문점' },
    { id: 'dessert', label: '디저트', emoji: '🍰', desc: '케이크, 아이스크림' },
    { id: 'bakery', label: '베이커리', emoji: '🥐', desc: '빵집, 브런치' },
  ]

  const barOptions = [
    { id: 'all', label: '전체', emoji: '🍻', desc: '모든 술집' },
    { id: 'bar', label: '바', emoji: '🍸', desc: '일반 바' },
    { id: 'wine_bar', label: '와인바', emoji: '🍷', desc: '와인 전문' },
    { id: 'cocktail_bar', label: '칵테일바', emoji: '🍹', desc: '칵테일 전문' },
    { id: 'pub', label: '펍', emoji: '🍺', desc: '맥주 펍' },
  ]

  function handleSelect(key, value) {
    setTempSelections(prev => ({ ...prev, [key]: value }))
  }

  function handleContinue() {
    onNext({
      ...selections,
      ...tempSelections,
    })
  }

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{
              flex: 1, height: '4px', borderRadius: '2px',
              background: i <= 5 ? '#FF6B35' : '#f0f0f0'
            }} />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <button onClick={onBack} style={{
            background: 'none', border: 'none', color: '#888',
            fontSize: '15px', cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', gap: '4px'
          }}>
            ← 이전으로
          </button>

          {onHome && (
            <button onClick={onHome} style={{
              background: '#f5f5f5', border: 'none',
              borderRadius: '8px', padding: '6px 12px',
              fontSize: '14px', fontWeight: '700', color: '#666',
              cursor: 'pointer'
            }}>
              🏠
            </button>
          )}
        </div>

        <p style={{ color: '#FF6B35', fontWeight: '600', marginBottom: '8px' }}>
          Step 5 / 5
        </p>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a1a' }}>
          어떤 종류 원하세요? 🤔
        </h1>
        <p style={{ color: '#888', marginTop: '8px', fontSize: '14px' }}>
          더 정확한 추천을 위해 선택해주세요
        </p>
      </div>

      {courseOrder.map((type, orderIdx) => (
        <div key={type} style={{ padding: '20px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: '#FF6B35', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: '900'
            }}>
              {orderIdx + 1}
            </div>
            <p style={{ fontWeight: '700', color: '#1a1a1a', fontSize: '16px' }}>
              {type === 'restaurant' ? '🍽️ 레스토랑 종류' : 
               type === 'cafe' ? '☕ 카페 종류' : 
               '🍺 바/술집 종류'}
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
          }}>
            {type === 'restaurant' && restaurantOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleSelect('restaurantCuisine', opt.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '16px 8px',
                  borderRadius: '16px',
                  border: tempSelections.restaurantCuisine === opt.id
                    ? '2px solid #FF6B35'
                    : '2px solid #f0f0f0',
                  background: tempSelections.restaurantCuisine === opt.id
                    ? '#fff8f5'
                    : 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '28px' }}>{opt.emoji}</span>
                <span style={{
                  fontWeight: '700', fontSize: '14px',
                  color: tempSelections.restaurantCuisine === opt.id ? '#FF6B35' : '#1a1a1a'
                }}>
                  {opt.label}
                </span>
                <span style={{ fontSize: '11px', color: '#aaa' }}>
                  {opt.desc}
                </span>
              </button>
            ))}
            
            {type === 'cafe' && cafeOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleSelect('cafeCuisine', opt.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '16px 8px',
                  borderRadius: '16px',
                  border: tempSelections.cafeCuisine === opt.id
                    ? '2px solid #FF6B35'
                    : '2px solid #f0f0f0',
                  background: tempSelections.cafeCuisine === opt.id
                    ? '#fff8f5'
                    : 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '28px' }}>{opt.emoji}</span>
                <span style={{
                  fontWeight: '700', fontSize: '14px',
                  color: tempSelections.cafeCuisine === opt.id ? '#FF6B35' : '#1a1a1a'
                }}>
                  {opt.label}
                </span>
                <span style={{ fontSize: '11px', color: '#aaa' }}>
                  {opt.desc}
                </span>
              </button>
            ))}
            
            {type === 'bar' && barOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleSelect('barCuisine', opt.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '16px 8px',
                  borderRadius: '16px',
                  border: tempSelections.barCuisine === opt.id
                    ? '2px solid #FF6B35'
                    : '2px solid #f0f0f0',
                  background: tempSelections.barCuisine === opt.id
                    ? '#fff8f5'
                    : 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '28px' }}>{opt.emoji}</span>
                <span style={{
                  fontWeight: '700', fontSize: '14px',
                  color: tempSelections.barCuisine === opt.id ? '#FF6B35' : '#1a1a1a'
                }}>
                  {opt.label}
                </span>
                <span style={{ fontSize: '11px', color: '#aaa' }}>
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div style={{ padding: '24px', position: 'sticky', bottom: 0, background: 'white' }}>
        <button
          onClick={handleContinue}
          style={{
            background: '#FF6B35',
            color: 'white', border: 'none',
            padding: '16px', borderRadius: '12px',
            fontSize: '16px', fontWeight: '700',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          다음 단계로 →
        </button>
      </div>
    </div>
  )
}
