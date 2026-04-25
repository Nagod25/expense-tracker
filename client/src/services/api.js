import { supabase } from './supabase.js'

// Authentication functions
export const authAPI = {
  // Sign up new user
  register: async (email, password, name, relationship = 'user') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          relationship
        }
      }
    })

    if (error) throw error
    return { data: { user: data.user, session: data.session } }
  },

  // Sign in existing user
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return { data: { user: data.user, session: data.session } }
  },

  // Sign out
  logout: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }
}

// Expenses functions
export const expensesAPI = {
  // Get all expenses for current user
  getAll: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (error) throw error
    return { data }
  },

  // Get expenses by month and year
  getByMonth: async (year, month) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month, 1).toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lt('date', endDate)
      .order('date', { ascending: false })

    if (error) throw error
    return { data }
  },

  // Get expense statistics
  getStats: async (year, month) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month, 1).toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('expenses')
      .select('amount')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lt('date', endDate)

    if (error) throw error

    const total = data.reduce((sum, exp) => sum + exp.amount, 0)
    const average = data.length > 0 ? total / data.length : 0

    return {
      data: {
        total,
        average: parseFloat(average.toFixed(2)),
        count: data.length
      }
    }
  },

  // Create new expense
  create: async (expenseData) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        date: expenseData.date,
        amount: parseFloat(expenseData.amount),
        category: expenseData.category || 'car',
        description: expenseData.description || null
      })
      .select()
      .single()

    if (error) throw error
    return { data }
  },

  // Update expense
  update: async (id, expenseData) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('expenses')
      .update({
        date: expenseData.date,
        amount: parseFloat(expenseData.amount),
        category: expenseData.category,
        description: expenseData.description
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return { data }
  },

  // Delete expense
  delete: async (id) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  }
}

export default supabase
