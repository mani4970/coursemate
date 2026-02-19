export default function LocationSelect({ hotspots, onNext, onBack }) {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ paddingTop: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{
              flex: 1, height: '4px', borderRadius: '2px',
              background: i === 1 ? '#f0f0f0' : '#f0f0f0'
            }} />
          ))}
        </div>

        {onBack && (
          <button onClick={onBack} style={{
            background: 'none', border: 'none', color: '#888',
            fontSize: '15px', cursor: 'pointer', padding: '0 0 12px 0',
            display: 'flex', alignItems: 'center', gap: '4px'
          }}>
            ← 처음으로
          </button>
        )}

        <p style={{ color: '#666', fontWeight: '600', marginBottom: '8px' }}>
          Step 1 / 5
        </p>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a' }}>
          어디서 만날까요? 📍
        </h1>
        <p style={{ color: '#888', marginTop: '8px' }}>
          모임 장소를 선택해주세요
        </p>
      </div>

      {/* 2열 그리드 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
      }}>
        {hotspots.map(loc => (
          <button
            key={loc.id}
            onClick={() => onNext(loc)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '16px 8px',
              borderRadius: '16px',
              border: '2px solid #f0f0f0',
              background: 'white',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s',
              width: '100%',
            }}
          >
            <span style={{ fontSize: '28px' }}>{loc.emoji}</span>
            <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a1a' }}>
              {loc.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
