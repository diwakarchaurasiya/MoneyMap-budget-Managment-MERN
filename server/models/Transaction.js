import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transport', 'Rent', 'Health', 'Shopping', 'Others']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
})

// Index for better query performance
transactionSchema.index({ date: -1 })
transactionSchema.index({ category: 1 })

export default mongoose.model('Transaction', transactionSchema)