import { useState, useRef } from 'react'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export default function CartTab({ items, onAdd, onRemove, savedLists, onLoad }) {
  const [form, setForm] = useState({ name: '', count: '', unit: '', price: '' })
  const [errors, setErrors] = useState({})
  const [showHistory, setShowHistory] = useState(false)
  const nameRef = useRef(null)

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: false }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = true
    if (!form.count || Number(form.count) <= 0) e.count = true
    if (!form.unit || Number(form.unit) <= 0) e.unit = true
    if (!form.price || Number(form.price) <= 0) e.price = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleAdd = () => {
    if (!validate()) return
    onAdd({
      id: generateId(),
      name: form.name.trim(),
      count: Number(form.count),
      unit: Number(form.unit),
      price: Number(form.price),
    })
    setForm({ name: '', count: '', unit: '', price: '' })
    nameRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd()
  }

  const handleLoadSaved = (saved) => {
    onLoad(saved)
    setShowHistory(false)
  }

  return (
    <>
      <div className="add-form">
        <h2>물건 추가</h2>
        <div className="form-row">
          <div className="input-group">
            <label>물건명</label>
            <input
              ref={nameRef}
              type="text"
              placeholder="예: 포카칩"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              onKeyDown={handleKeyDown}
              className={errors.name ? 'error' : ''}
            />
          </div>
          <div className="input-group">
            <label>개수</label>
            <input
              type="number"
              placeholder="0"
              min="1"
              value={form.count}
              onChange={(e) => set('count', e.target.value)}
              onKeyDown={handleKeyDown}
              className={errors.count ? 'error' : ''}
            />
          </div>
          <div className="input-group">
            <label>수량</label>
            <input
              type="number"
              placeholder="0"
              min="1"
              value={form.unit}
              onChange={(e) => set('unit', e.target.value)}
              onKeyDown={handleKeyDown}
              className={errors.unit ? 'error' : ''}
            />
          </div>
        </div>
        <div className="form-row-price">
          <div className="input-group">
            <label>가격 (원)</label>
            <input
              type="number"
              placeholder="0"
              min="0"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              onKeyDown={handleKeyDown}
              className={errors.price ? 'error' : ''}
            />
          </div>
          <div className="input-group">
            <label>&nbsp;</label>
            <button className="add-btn" onClick={handleAdd}>
              + 추가
            </button>
          </div>
        </div>
      </div>

      <div className="cart-section">
        <div className="cart-section-header">
          <h2>장바구니 ({items.length})</h2>
          <button
            className={`history-toggle-btn ${showHistory ? 'active' : ''}`}
            onClick={() => setShowHistory((v) => !v)}
          >
            저장 목록 {savedLists.length > 0 && `(${savedLists.length})`}
          </button>
        </div>

        {showHistory && (
          <div className="history-panel">
            {savedLists.length === 0 ? (
              <p className="history-empty">저장된 목록이 없어요</p>
            ) : (
              savedLists.map((saved) => {
                const total = saved.items.reduce((s, i) => s + i.count * i.price, 0)
                return (
                  <button
                    key={saved.id}
                    className="history-item"
                    onClick={() => handleLoadSaved(saved)}
                  >
                    <div className="history-item-date">{saved.savedAt}</div>
                    <div className="history-item-meta">
                      <span>{saved.items.length}개 품목</span>
                      <span>{total.toLocaleString()}원</span>
                    </div>
                    <div className="history-item-names">
                      {saved.items.slice(0, 3).map((i) => i.name).join(', ')}
                      {saved.items.length > 3 && ` 외 ${saved.items.length - 3}개`}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        )}

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <p>아직 추가된 물건이 없어요</p>
          </div>
        ) : (
          <div className="cart-list">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-detail">
                    {item.count}×{item.unit} = {item.count * item.unit}개
                  </div>
                </div>
                <div className="cart-item-price">
                  {(item.count * item.price).toLocaleString()}원
                </div>
                <button className="delete-btn" onClick={() => onRemove(item.id)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
