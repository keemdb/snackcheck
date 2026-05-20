function distribute(count, floors) {
  const total = floors.reduce((s, f) => s + f.count, 0)
  let remaining = count
  return floors.map((floor, idx) => {
    if (idx === floors.length - 1) return { ...floor, qty: remaining }
    const share = Math.round((count * floor.count) / total)
    remaining -= share
    return { ...floor, qty: share }
  })
}

export default function DistributionModal({ entry, floors, onClose }) {
  const totalPeople = floors.reduce((s, f) => s + f.count, 0)

  return (
    <div className="dist-modal-overlay" onClick={onClose}>
      <div className="dist-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dist-modal-header">
          <div>
            <h3 className="dist-modal-title">간식 분배</h3>
            <p className="dist-modal-date">{entry.savedAt} · 총 {totalPeople}명</p>
          </div>
          <button className="dist-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="floor-badges" style={{ marginBottom: '14px' }}>
          {floors.map((f) => (
            <div key={f.name} className={`floor-badge floor${f.name.replace('층', '')}`}>
              <span>{f.name}</span>
              <span>{f.count}명</span>
            </div>
          ))}
        </div>

        <div className="dist-table-header">
          <span>물건</span>
          {floors.map((f) => <span key={f.name}>{f.name}</span>)}
        </div>

        <div className="dist-list">
          {entry.items.map((item) => {
            const totalQty = item.count * item.unit
            const dist = distribute(totalQty, floors)
            const isShort = totalQty < floors.length
            return (
              <div key={item.id} className="dist-item">
                <div>
                  <div className="dist-item-name">{item.name}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>총 {totalQty}개</div>
                </div>
                {dist.map((d, idx) => (
                  <div
                    key={d.name}
                    className={`dist-qty-cell ${idx === 0 ? 'floor7' : 'floor8'} ${isShort ? 'short' : ''}`}
                  >
                    {d.qty}
                    <span className="dist-item-unit">개</span>
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        <button className="dist-modal-confirm-btn" onClick={onClose}>확인</button>
      </div>
    </div>
  )
}
