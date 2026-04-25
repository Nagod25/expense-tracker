import { useState, useEffect } from 'react'
import { expensesAPI } from '../services/api'
import '../styles/Dashboard.css'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'

function Dashboard({ user, onLogout }) {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  })

  // Load expenses on mount and when filter changes
  useEffect(() => {
    fetchExpenses()
  }, [filter])

  const fetchExpenses = async () => {
    setLoading(true)
    try {
      const response = await expensesAPI.getByMonth(filter.year, filter.month)
      setExpenses(response.data)
    } catch (error) {
      console.error('Failed to fetch expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddExpense = async (expense) => {
    try {
      await expensesAPI.create(expense)
      fetchExpenses()
    } catch (error) {
      console.error('Failed to add expense:', error)
      alert('Failed to add expense. Please try again.')
    }
  }

  const handleDeleteExpense = async (id) => {
    if (!confirm('Are you sure you want to delete this expense?')) return

    try {
      await expensesAPI.delete(id)
      fetchExpenses()
    } catch (error) {
      console.error('Failed to delete expense:', error)
      alert('Failed to delete expense. Please try again.')
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Daily Transport Expense Tracker</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <ExpenseForm onAddExpense={handleAddExpense} />
        <ExpenseList
          expenses={expenses}
          onDeleteExpense={handleDeleteExpense}
          filter={filter}
          onFilterChange={setFilter}
          loading={loading}
        />
      </main>
    </div>
  )
}

export default Dashboard
