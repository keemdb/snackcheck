import { useState } from 'react'
import DistributionModal from './DistributionModal'

export default function OrderHistoryTab({ savedLists, floors, onDelete }) {
  const [activeEntry, setActiveEntry] = useState(null)

  if (savedLists.length === 0) {
    return (
      <div className="empty-dist">
        <div className="empty-icon">📋</div>
        <p>아직 저장된 주문 내역이 없어요<br />구입 완료 시 자동으로 저장돼요</p>
      </div>
    )
  }

  return (
    <>
      <div className="order-list">
        {savedLists.map((entry) => {
          const total = entry.items.reduce((s, i) => s + i.count * i.price, 0)
          return (
            <div key={entry.id} className="order-item">
              <div className="order-item-head">
                <span className="order-item-date">{entry.savedAt}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="order-item-total">{total.toLocaleString()}원</span>
                  <button className="order-delete-btn" onClick={() => onDelete(entry.id)}>×</button>
                </div>
              </div>
              <div className="order-item-rows">
                {entry.items.map((item) => (
                  <div key={item.id} className="order-item-row">
                    <span className="order-item-name">{item.name}</span>
                    <span className="order-item-qty">{item.count * item.unit}개</span>
                    <span className="order-item-price">{(item.count * item.price).toLocaleString()}원</span>
                  </div>
                ))}
              </div>
              <button
                className="dist-trigger-btn"
                onClick={() => setActiveEntry(entry)}
              >
                간식 분배
              </button>
            </div>
          )
        })}
      </div>

      {activeEntry && (
        <DistributionModal
          entry={activeEntry}
          floors={floors}
          onClose={() => setActiveEntry(null)}
        />
      )}
    </>
  )
}
