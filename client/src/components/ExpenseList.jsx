import { useState } from 'react'
import '../styles/ExpenseList.css'

function ExpenseList({ expenses, onDeleteExpense, onEditExpense, filter, onFilterChange, loading }) {
  const [editingId, setEditingId] = useState(null)
  const [editFormData, setEditFormData] = useState({
    date: '',
    amount: '',
    category: 'car',
    description: ''
  })

  const categories = ['bus', 'keke', 'taxi', 'car', 'bike', 'other']
  const monthName = new Date(filter.year, filter.month - 1).toLocaleString('default', { month: 'long' })
  const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
  const average = expenses.length > 0 ? (total / expenses.length).toFixed(2) : 0

  const handleEditClick = (expense) => {
    setEditingId(expense.id)
    setEditFormData({
      date: expense.date,
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description || ''
    })
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditSave = async (expenseId) => {
    if (!editFormData.amount || parseFloat(editFormData.amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }
    await onEditExpense(expenseId, editFormData)
    setEditingId(null)
  }

  const handleEditCancel = () => {
    setEditingId(null)
  }

  return (
    <div className="expense-list">
      <div className="expense-list-header">
        <div>
          <div className="expense-list-title">
            <h2>Expense History</h2>
            <p className="expense-period">{monthName} {filter.year}</p>
          </div>
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <span>Total</span>
            <strong>₦{total.toFixed(2)}</strong>
          </div>
          <div className="summary-card">
            <span>Average</span>
            <strong>₦{average}</strong>
          </div>
          <div className="summary-card">
            <span>Entries</span>
            <strong>{expenses.length}</strong>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <select 
          value={filter.month}
          onChange={(e) => onFilterChange({...filter, month: parseInt(e.target.value)})}
        >
          {Array.from({length: 12}, (_, i) => (
            <option key={i+1} value={i+1}>{new Date(2024, i).toLocaleString('default', {month: 'long'})}</option>
          ))}
        </select>
        <select 
          value={filter.year}
          onChange={(e) => onFilterChange({...filter, year: parseInt(e.target.value)})}
        >
          {Array.from({length: 5}, (_, i) => (
            <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="loading">Loading expenses...</p>
      ) : expenses.length === 0 ? (
        <div className="no-expenses-card">
          <p>No expenses found for this period.</p>
          <small>Try changing the month or adding a new expense.</small>
        </div>
      ) : (
        <div className="expenses-grid">
          {expenses.map((exp) => (
            editingId === exp.id ? (
              <div key={exp.id} className="expense-card editing">
                <div className="expense-edit-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        name="date"
                        value={editFormData.date}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Amount (₦)</label>
                      <input
                        type="number"
                        name="amount"
                        value={editFormData.amount}
                        onChange={handleEditChange}
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        name="category"
                        value={editFormData.category}
                        onChange={handleEditChange}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                      placeholder="Optional notes"
                      rows="2"
                    ></textarea>
                  </div>
                  <div className="edit-actions">
                    <button className="save-btn" onClick={() => handleEditSave(exp.id)}>Save</button>
                    <button className="cancel-btn" onClick={handleEditCancel}>Cancel</button>
                  </div>
                </div>
              </div>
            ) : (
              <div key={exp.id} className="expense-card">
                <div className="expense-card-header">
                  <div className="expense-card-left">
                    <p className="expense-card-date">{new Date(exp.date).toLocaleDateString()}</p>
                    <span className="category-pill">{exp.category.charAt(0).toUpperCase() + exp.category.slice(1)}</span>
                  </div>
                  <div className="expense-card-right">
                    <span className="expense-card-amount">₦{parseFloat(exp.amount).toFixed(2)}</span>
                    <button
                      className="edit-btn-card"
                      onClick={() => handleEditClick(exp)}
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      className="delete-btn-card"
                      onClick={() => onDeleteExpense(exp.id)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                {exp.description && <p className="expense-card-description">{exp.description}</p>}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  )
}

export default ExpenseList
