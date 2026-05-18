const COMPANY_NAME = 'Snackcheck!'

function formatDate() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  return `${y}.${m}.${d} ${h}:${min}`
}

export default function Receipt({ items, address, onConfirm, onClose }) {
  const total = items.reduce((s, i) => s + i.count * i.price, 0)

  return (
    <div className="receipt-overlay" onClick={onClose}>
      <div className="receipt-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="receipt">
          <div className="receipt-header">
            <div className="receipt-logo">{COMPANY_NAME}</div>
            <div className="receipt-subtitle">팀 간식 구매 영수증</div>
            <div className="receipt-date">{formatDate()}</div>
          </div>

          <hr className="dashed-line" />

          <div className="receipt-items">
            {items.map((item) => (
              <div key={item.id} className="receipt-item">
                <div className="receipt-item-left">
                  <div className="receipt-item-name">{item.name}</div>
                  <div className="receipt-item-qty">{item.count}×{item.unit} = {item.count * item.unit}개</div>
                </div>
                <div className="receipt-item-price">
                  {(item.count * item.price).toLocaleString()}원
                </div>
              </div>
            ))}
          </div>

          <hr className="dashed-line" />

          <div className="receipt-total-row">
            <span className="receipt-total-label">합계</span>
            <span className="receipt-total-amount">{total.toLocaleString()}원</span>
          </div>

          <hr className="dashed-line" />

          <div className="receipt-address">
            {address}
          </div>
        </div>

        <div className="receipt-bottom-edge" />

        <div className="receipt-confirm-area">
          <button className="confirm-btn" onClick={onConfirm}>
            확인 — 간식 분배 보기
          </button>
        </div>
      </div>
    </div>
  )
}
