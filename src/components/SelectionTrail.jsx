import React from 'react'

function Chip({ children }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 10px',
      borderRadius: '999px',
      border: '1px solid #eaeaea',
      background: '#fafafa',
      fontSize: '12px',
      fontWeight: 700,
      color: '#555',
      whiteSpace: 'nowrap'
    }}>
      {children}
    </span>
  )
}

export default function SelectionTrail({ selections, flowType, step }) {
  if (!selections) return null
  if (step === 0 || step === 100) return null

  const chips = []
  if (selections.hotspot?.name) chips.push(<Chip key="hotspot">📍 {selections.hotspot.name}</Chip>)
  if (selections.occasion) chips.push(<Chip key="occasion">👥 {selections.occasion}</Chip>)
  if (selections.budget) chips.push(<Chip key="budget">💰 {selections.budget}</Chip>)

  const order = (selections.courseOrder && selections.courseOrder.length) ? selections.courseOrder : null
  if (flowType === 'direct') {
    if (selections.restaurant?.name) chips.push(<Chip key="r">🍽️ {selections.restaurant.name}</Chip>)
    if (selections.restaurant2?.name) chips.push(<Chip key="r2">🍽️ {selections.restaurant2.name}</Chip>)
    if (selections.cafe?.name) chips.push(<Chip key="c">☕ {selections.cafe.name}</Chip>)
    if (selections.cafe2?.name) chips.push(<Chip key="b">🍺 {selections.cafe2.name}</Chip>)
  } else {
    if (order) {
      const label = order.map(t => (t === 'restaurant' ? '🍽️' : t === 'cafe' ? '☕' : '🍺')).join('→')
      chips.push(<Chip key="order">🧭 {label}</Chip>)
    }
  }

  if (chips.length === 0) return null

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: 'white',
      padding: '8px 16px 0',
      marginBottom: '6px'
    }}>
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: '8px'
      }}>
        {chips}
      </div>
    </div>
  )
}
