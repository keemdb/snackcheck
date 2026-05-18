import { useState } from 'react'
import CartTab from './components/CartTab'
import DistributionTab from './components/DistributionTab'
import Receipt from './components/Receipt'

const COMPANY_ADDRESS = '서울시 서초구 서초동 1327-15 7층 7호'
const FLOORS = [
  { name: '7층', count: 10 },
  { name: '8층', count: 6 },
]

export default function App() {
  const [tab, setTab] = useState('cart')
  const [items, setItems] = useState([])
  const [showReceipt, setShowReceipt] = useState(false)

  const addItem = (item) => setItems((prev) => [item, ...prev])
  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id))

  const handlePurchase = () => setShowReceipt(true)

  const handleConfirm = () => {
    setShowReceipt(false)
    setTab('distribution')
  }

  const handleCloseReceipt = () => setShowReceipt(false)

  const handleReset = () => {
    setItems([])
    setTab('cart')
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
          className={`tab-btn ${tab === 'distribution' ? 'active' : ''}`}
          onClick={() => setTab('distribution')}
        >
          간식 분배
        </button>
      </div>

      <div className="tab-content">
        {tab === 'cart' && (
          <CartTab items={items} onAdd={addItem} onRemove={removeItem} />
        )}
        {tab === 'distribution' && (
          <DistributionTab items={items} floors={FLOORS} onReset={handleReset} />
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
