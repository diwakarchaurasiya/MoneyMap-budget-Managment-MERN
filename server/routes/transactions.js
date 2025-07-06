import express from 'express'
import Transaction from '../models/Transaction.js'

const router = express.Router()

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    let filter = {}

    if (startDate || endDate) {
      filter.date = {}
      if (startDate) filter.date.$gte = new Date(startDate)
      if (endDate) filter.date.$lte = new Date(endDate)
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 })
    res.json(transactions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get transactions with filters
router.get('/filter', async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query
    let filter = {}

    if (category) {
      filter.category = category
    }

    if (startDate || endDate) {
      filter.date = {}
      if (startDate) filter.date.$gte = new Date(startDate)
      if (endDate) filter.date.$lte = new Date(endDate)
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 })
    res.json(transactions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create new transaction
router.post('/', async (req, res) => {
  try {
    const { amount, description, category, date } = req.body

    if (!amount || !description || !category) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const transaction = new Transaction({
      amount,
      description,
      category,
      date: date || new Date()
    })

    await transaction.save()
    res.status(201).json(transaction)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Update transaction
router.put('/:id', async (req, res) => {
  try {
    const { amount, description, category, date } = req.body

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        amount,
        description,
        category,
        date
      },
      { new: true, runValidators: true }
    )

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' })
    }

    res.json(transaction)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id)

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' })
    }

    res.json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Export transactions as CSV
router.get('/export/csv', async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    let filter = {}

    if (startDate || endDate) {
      filter.date = {}
      if (startDate) filter.date.$gte = new Date(startDate)
      if (endDate) filter.date.$lte = new Date(endDate)
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 })

    // Generate CSV content
    const csvHeader = 'Date,Description,Category,Amount\n'
    const csvRows = transactions.map(t => {
      const date = new Date(t.date).toISOString().split('T')[0]
      const description = `"${t.description.replace(/"/g, '""')}"` // Escape quotes
      const category = `"${t.category}"`
      const amount = t.amount
      return `${date},${description},${category},${amount}`
    }).join('\n')

    const csvContent = csvHeader + csvRows

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"')

    res.send(csvContent)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router