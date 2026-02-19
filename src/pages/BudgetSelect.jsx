export default function BudgetSelect({ selections, onNext, onBack, onHome }) {
  const budgets = [
    { id: 'low', label: '가성비', emoji: '💰', desc: '1-3만원대' },
    { id: 'medium', label: '적당히', emoji: '💳', desc: '3-5만원대' },
    { id: 'high', label: '특별한 날', emoji: '💎', desc: '5만원 이상' },
    { id: 'any', label: '상관없어요', emoji: '✨', desc: '모든 가격대' },
  ]

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ paddingTop: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{
              flex: 1, height: '4px', borderRadius: '2px',
              background: i <= 4 ? '#FF6B35' : '#f0f0f0'
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
          Step 4 / 5
        </p>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a' }}>
          예산은 어느 정도? 💰
        </h1>
        <p style={{ color: '#888', marginTop: '8px' }}>
          1인당 예상 가격대를 선택해주세요
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
      }}>
        {budgets.map(budget => (
          <button
            key={budget.id}
            onClick={() => onNext(budget.label)}
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
              transition: 'border-color 0.2s',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ fontSize: '36px' }}>{budget.emoji}</span>
            <div style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a1a' }}>
              {budget.label}
            </div>
            <div style={{ color: '#888', fontSize: '12px' }}>
              {budget.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
