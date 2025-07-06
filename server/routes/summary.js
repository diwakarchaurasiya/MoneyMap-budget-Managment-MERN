import express from 'express'
import Transaction from '../models/Transaction.js'
import Budget from '../models/Budget.js'

const router = express.Router()

// Get dashboard summary
router.get('/', async (req, res) => {
  try {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Get current month transactions
    const startOfMonth = new Date(currentYear, currentMonth, 1)
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0)

    const currentMonthTransactions = await Transaction.find({
      date: { $gte: startOfMonth, $lte: endOfMonth }
    })

    // Get current month budgets
    const currentMonthBudgets = await Budget.find({
      month: currentMonth,
      year: currentYear
    })

    // Calculate totals
    const totalExpenses = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0)
    const totalBudget = currentMonthBudgets.reduce((sum, b) => sum + b.amount, 0)

    // Calculate category totals
    const categoryTotals = {}
    currentMonthTransactions.forEach(transaction => {
      if (!categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] = 0
      }
      categoryTotals[transaction.category] += transaction.amount
    })

    // Get recent transactions (last 5)
    const recentTransactions = await Transaction.find()
      .sort({ date: -1 })
      .limit(5)

    // Calculate budget vs actual
    const budgetVsActual = currentMonthBudgets.map(budget => {
      const actual = categoryTotals[budget.categoryName] || 0
      return {
        category: budget.categoryName,
        budget: budget.amount,
        actual,
        remaining: budget.amount - actual
      }
    })

    res.json({
      totalExpenses,
      totalBudget,
      remaining: totalBudget - totalExpenses,
      transactionCount: currentMonthTransactions.length,
      categoryTotals,
      recentTransactions,
      budgetVsActual,
      month: currentMonth,
      year: currentYear
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get monthly summary for past 6 months
router.get('/monthly', async (req, res) => {
  try {
    const currentDate = new Date()
    const monthlyData = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const monthTransactions = await Transaction.find({
        date: { $gte: startOfMonth, $lte: endOfMonth }
      })

      const monthTotal = monthTransactions.reduce((sum, t) => sum + t.amount, 0)
      
      monthlyData.push({
        month: date.toLocaleString('default', { month: 'long' }),
        year: date.getFullYear(),
        total: monthTotal,
        transactionCount: monthTransactions.length
      })
    }

    res.json(monthlyData)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router