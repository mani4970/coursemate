import { useState } from 'react'

export default function CourseSelect({ selections, onNext, onBack, onHome }) {
  const [selectedOrder, setSelectedOrder] = useState([])

  const options = [
    { id: 'restaurant', label: '레스토랑', emoji: '🍽️', desc: '맛집 식사' },
    { id: 'cafe', label: '카페', emoji: '☕', desc: '카페 & 디저트' },
    { id: 'bar', label: '바/술집', emoji: '🍺', desc: '술 한잔' },
  ]

  function handleToggle(id) {
    if (selectedOrder.includes(id)) {
      setSelectedOrder(prev => prev.filter(item => item !== id))
    } else {
      setSelectedOrder(prev => [...prev, id])
    }
  }

  function handleContinue() {
    if (selectedOrder.length === 0) return
    onNext({ courseOrder: selectedOrder })
  }

  function getOrderNumber(id) {
    const index = selectedOrder.indexOf(id)
    return index >= 0 ? index + 1 : null
  }

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{
              flex: 1, height: '4px', borderRadius: '2px',
              background: i <= 3 ? '#FF6B35' : '#f0f0f0'
            }} />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <button onClick={onBack} style={{
            background: 'none', border: 'none', color: '#888',
            fontSize: '15px', cursor: 'pointer', padding: 0
          }}>← 이전으로</button>

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
          Step 3 / 5
        </p>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a1a' }}>
          어디를 갈까요? 🗺️
        </h1>
        <p style={{ color: '#888', marginTop: '8px', fontSize: '14px' }}>
          가고 싶은 곳을 순서대로 선택해주세요
        </p>

        {selectedOrder.length > 0 && (
          <div style={{
            background: '#fff8f5', borderRadius: '12px',
            padding: '12px 16px', marginTop: '16px',
            border: '1px solid #FFE0D0'
          }}>
            <p style={{ color: '#888', fontSize: '12px', marginBottom: '6px' }}>
              선택한 순서
            </p>
            <p style={{ color: '#FF6B35', fontWeight: '700', fontSize: '14px' }}>
              {selectedOrder.map((id, idx) => {
                const opt = options.find(o => o.id === id)
                return (
                  <span key={id}>
                    {idx > 0 && ' → '}
                    {opt?.emoji} {opt?.label}
                  </span>
                )
              })}
            </p>
          </div>
        )}
      </div>

      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {options.map(opt => {
            const orderNum = getOrderNumber(opt.id)
            const isSelected = orderNum !== null

            return (
              <button
                key={opt.id}
                onClick={() => handleToggle(opt.id)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '18px',
                  borderRadius: '16px',
                  border: isSelected ? '2px solid #FF6B35' : '2px solid #f0f0f0',
                  background: isSelected ? '#fff8f5' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#FF6B35',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '900',
                  }}>
                    {orderNum}
                  </div>
                )}

                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: isSelected ? '#FF6B35' : '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  flexShrink: 0,
                  marginLeft: isSelected ? '28px' : '0',
                }}>
                  {opt.emoji}
                </div>

                <div style={{ flex: 1, textAlign: 'left' }}>
                  <p style={{
                    fontWeight: '800',
                    fontSize: '17px',
                    color: isSelected ? '#FF6B35' : '#1a1a1a',
                    marginBottom: '2px'
                  }}>
                    {opt.label}
                  </p>
                  <p style={{ color: '#888', fontSize: '13px' }}>
                    {opt.desc}
                  </p>
                </div>

                {isSelected && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#FF6B35',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '900',
                  }}>
                    ✓
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <p style={{
          color: '#aaa',
          fontSize: '12px',
          textAlign: 'center',
          marginTop: '16px'
        }}>
          💡 선택한 순서대로 코스를 추천해드려요
        </p>
      </div>

      <div style={{ padding: '24px', position: 'sticky', bottom: 0, background: 'white' }}>
        <button
          onClick={handleContinue}
          disabled={selectedOrder.length === 0}
          style={{
            background: selectedOrder.length > 0 ? '#FF6B35' : '#ccc',
            color: 'white',
            border: 'none',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: selectedOrder.length > 0 ? 'pointer' : 'not-allowed',
            width: '100%',
          }}
        >
          {selectedOrder.length > 0
            ? `${selectedOrder.length}곳 코스 만들기 →`
            : '하나 이상 선택하세요'}
        </button>
      </div>
    </div>
  )
}
