import express from 'express'
import Budget from '../models/Budget.js'

const router = express.Router()

// Get all budgets
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    let filter = {}

    if (startDate || endDate) {
      // Convert dates to year/month for budget filtering
      const start = startDate ? new Date(startDate) : null
      const end = endDate ? new Date(endDate) : null

      if (start && end) {
        const startYear = start.getFullYear()
        const startMonth = start.getMonth() + 1
        const endYear = end.getFullYear()
        const endMonth = end.getMonth() + 1

        filter.$or = []

        // Generate all year/month combinations between start and end
        for (let year = startYear; year <= endYear; year++) {
          const monthStart = year === startYear ? startMonth : 1
          const monthEnd = year === endYear ? endMonth : 12

          for (let month = monthStart; month <= monthEnd; month++) {
            filter.$or.push({ year, month })
          }
        }
      }
    }

    const budgets = await Budget.find(filter)
    res.json(budgets)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get budgets for specific month/year
router.get('/month/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params
    const budgets = await Budget.find({
      year: parseInt(year),
      month: parseInt(month)
    })
    res.json(budgets)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create or update budget
router.post('/', async (req, res) => {
  try {
    const { categoryName, amount, month, year } = req.body

    if (!categoryName || amount === undefined || month === undefined || year === undefined) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const budget = await Budget.findOneAndUpdate(
      { categoryName, month, year },
      { amount },
      { new: true, upsert: true, runValidators: true }
    )

    res.json(budget)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete budget
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id)

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' })
    }

    res.json({ message: 'Budget deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router