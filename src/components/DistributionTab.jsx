function distribute(count, floors) {
  const total = floors.reduce((s, f) => s + f.count, 0)
  let remaining = count
  const result = floors.map((floor, idx) => {
    if (idx === floors.length - 1) {
      return { ...floor, qty: remaining }
    }
    const share = Math.round((count * floor.count) / total)
    remaining -= share
    return { ...floor, qty: share }
  })
  return result
}

export default function DistributionTab({ items, floors, onReset }) {
  const totalPeople = floors.reduce((s, f) => s + f.count, 0)

  if (items.length === 0) {
    return (
      <div className="empty-dist">
        <div className="empty-icon">📦</div>
        <p>장바구니에 물건을 담고 구입 완료 후<br />분배 결과가 표시돼요</p>
      </div>
    )
  }

  return (
    <>
      <div className="distribution-header">
        <h2>간식 분배 결과</h2>
        <p>총 {totalPeople}명 기준으로 층별 분배했어요</p>
        <div className="floor-badges">
          {floors.map((f) => (
            <div key={f.name} className={`floor-badge floor${f.name.replace('층', '')}`}>
              <span>{f.name}</span>
              <span>{f.count}명</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dist-table-header">
        <span>물건</span>
        {floors.map((f) => (
          <span key={f.name}>{f.name}</span>
        ))}
      </div>

      <div className="dist-list">
        {items.map((item) => {
          const totalQty = item.count * item.unit
          const dist = distribute(totalQty, floors)
          const isShort = totalQty < floors.length

          return (
            <div key={item.id} className="dist-item">
              <div>
                <div className="dist-item-name">{item.name}</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>
                  총 {totalQty}개
                </div>
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

      <button className="reset-btn" onClick={onReset}>
        다시 구매하기
      </button>
    </>
  )
}
