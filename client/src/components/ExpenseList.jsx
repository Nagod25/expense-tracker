import '../styles/ExpenseList.css'

function ExpenseList({ expenses, onDeleteExpense, filter, onFilterChange, loading }) {
  const monthName = new Date(filter.year, filter.month - 1).toLocaleString('default', { month: 'long' })
  const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
  const average = expenses.length > 0 ? (total / expenses.length).toFixed(2) : 0

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
            <div key={exp.id} className="expense-card">
              <div className="expense-card-header">
                <div className="expense-card-left">
                  <p className="expense-card-date">{new Date(exp.date).toLocaleDateString()}</p>
                  <span className="category-pill">{exp.category.charAt(0).toUpperCase() + exp.category.slice(1)}</span>
                </div>
                <div className="expense-card-right">
                  <span className="expense-card-amount">₦{parseFloat(exp.amount).toFixed(2)}</span>
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
          ))}
        </div>
      )}
    </div>
  )
}

export default ExpenseList
