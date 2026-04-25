import '../styles/ExpenseList.css'

function ExpenseList({ expenses, onDeleteExpense, filter, onFilterChange, loading }) {
  const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
  const average = expenses.length > 0 ? (total / expenses.length).toFixed(2) : 0

  return (
    <div className="expense-list">
      <h2>Expense History</h2>

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
        <p className="no-expenses">No expenses found for this period</p>
      ) : (
        <>
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id}>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td>{exp.category.charAt(0).toUpperCase() + exp.category.slice(1)}</td>
                  <td>₦{parseFloat(exp.amount).toFixed(2)}</td>
                  <td>{exp.description || '-'}</td>
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => onDeleteExpense(exp.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="summary">
            <p><strong>Total:</strong> ₦{total.toFixed(2)}</p>
            <p><strong>Average:</strong> ₦{average}</p>
            <p><strong>Count:</strong> {expenses.length}</p>
          </div>
        </>
      )}
    </div>
  )
}

export default ExpenseList
