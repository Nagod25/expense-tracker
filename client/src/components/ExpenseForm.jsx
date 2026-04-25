import { useState } from 'react'
import '../styles/ExpenseForm.css'

function ExpenseForm({ onAddExpense }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'car',
    description: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const categories = ['bus', 'train', 'taxi', 'car', 'bike', 'other']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        setError('Please enter a valid amount')
        setLoading(false)
        return
      }

      await onAddExpense(formData)
      
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: 'car',
        description: ''
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add expense')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="expense-form">
      <h2>Log Expense</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Amount (₦)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional notes"
            rows="3"
          ></textarea>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  )
}

export default ExpenseForm
