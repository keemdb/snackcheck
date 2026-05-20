import { useState, useEffect } from 'react'
import CartTab from './components/CartTab'
import OrderHistoryTab from './components/OrderHistoryTab'
import Receipt from './components/Receipt'

const COMPANY_ADDRESS = '서울시 서초구 서초동 1327-15 7층 7호'
const FLOORS = [
  { name: '7층', count: 10 },
  { name: '8층', count: 6 },
]
const STORAGE_KEY = 'snackcheck_saved'
const MAX_SAVED = 20

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function formatDate() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  return `${y}.${m}.${d} ${h}:${min}`
}

function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

export default function App() {
  const [tab, setTab] = useState('cart')
  const [items, setItems] = useState([])
  const [showReceipt, setShowReceipt] = useState(false)
  const [savedLists, setSavedLists] = useState(loadFromStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLists))
  }, [savedLists])

  const addItem = (item) => setItems((prev) => [item, ...prev])
  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id))

  const handlePurchase = () => {
    const entry = { id: generateId(), savedAt: formatDate(), items }
    setSavedLists((prev) => [entry, ...prev].slice(0, MAX_SAVED))
    setShowReceipt(true)
  }

  const handleConfirm = () => {
    setShowReceipt(false)
    setTab('history')
  }

  const handleCloseReceipt = () => setShowReceipt(false)

  const handleLoad = (saved) => {
    setItems(saved.items)
  }

  const handleDeleteSaved = (id) => {
    setSavedLists((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Snackcheck!</h1>
        <p>팀 간식 구매 체크리스트</p>
      </div>

      <div className="tab-bar">
        <button
          className={`tab-btn ${tab === 'cart' ? 'active' : ''}`}
          onClick={() => setTab('cart')}
        >
          장바구니
        </button>
        <button
          className={`tab-btn ${tab === 'history' ? 'active' : ''}`}
          onClick={() => setTab('history')}
        >
          주문내역
        </button>
      </div>

      <div className="tab-content">
        {tab === 'cart' && (
          <CartTab
            items={items}
            onAdd={addItem}
            onRemove={removeItem}
            savedLists={savedLists}
            onLoad={handleLoad}
          />
        )}
        {tab === 'history' && (
          <OrderHistoryTab savedLists={savedLists} floors={FLOORS} onDelete={handleDeleteSaved} />
        )}
      </div>

      <div className="total-bar">
        <div className="total-row">
          <span className="total-label">합계</span>
          <span className="total-amount">
            {items.reduce((s, i) => s + i.count * i.price, 0).toLocaleString()}원
          </span>
        </div>
        {tab === 'cart' && (
          <button
            className="purchase-btn"
            onClick={handlePurchase}
            disabled={items.length === 0}
          >
            구입 완료
          </button>
        )}
      </div>

      {showReceipt && (
        <Receipt
          items={items}
          address={COMPANY_ADDRESS}
          onConfirm={handleConfirm}
          onClose={handleCloseReceipt}
        />
      )}
    </div>
  )
}
