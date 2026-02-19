export default function OccasionSelect({ location, onNext, onBack }) {
  const occasions = [
    { id: 'date', label: '데이트', emoji: '💑' },
    { id: 'friend', label: '친구', emoji: '👥' },
    { id: 'family', label: '가족', emoji: '👨‍👩‍👧‍👦' },
    { id: 'business', label: '비즈니스', emoji: '💼' },
  ]

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ paddingTop: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{
              flex: 1, height: '4px', borderRadius: '2px',
              background: i <= 2 ? '#f0f0f0' : '#f0f0f0'
            }} />
          ))}
        </div>

        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: '#888',
          fontSize: '15px', cursor: 'pointer', padding: '0 0 12px 0'
        }}>← 이전으로</button>

        <p style={{ color: '#666', fontWeight: '600', marginBottom: '8px' }}>
          Step 2 / 5
        </p>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a' }}>
          누구랑 가나요? 👥
        </h1>
        <p style={{ color: '#888', marginTop: '8px' }}>
          {location}에서의 모임
        </p>
      </div>

      {/* 2열 그리드 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
      }}>
        {occasions.map(occ => (
          <button
            key={occ.id}
            onClick={() => onNext(occ.label)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '20px 8px',
              borderRadius: '16px',
              border: '2px solid #f0f0f0',
              background: 'white',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: '36px' }}>{occ.emoji}</span>
            <div style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a1a' }}>
              {occ.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
