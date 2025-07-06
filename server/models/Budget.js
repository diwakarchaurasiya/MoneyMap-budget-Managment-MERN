import mongoose from 'mongoose'

const budgetSchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    enum: ['Food', 'Transport', 'Rent', 'Health', 'Shopping', 'Others']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: Number,
    required: true,
    min: 0,
    max: 11
  },
  year: {
    type: Number,
    required: true,
    min: 2020
  }
}, {
  timestamps: true
})

// Compound index to prevent duplicate budgets for same category/month/year
budgetSchema.index({ categoryName: 1, month: 1, year: 1 }, { unique: true })

export default mongoose.model('Budget', budgetSchema)