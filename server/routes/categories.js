import express from 'express'

const router = express.Router()

// Predefined categories
const categories = [
  { id: 1, name: 'Food', icon: '🍕', color: '#FF6B6B' },
  { id: 2, name: 'Transport', icon: '🚗', color: '#4ECDC4' },
  { id: 3, name: 'Rent', icon: '🏠', color: '#45B7D1' },
  { id: 4, name: 'Health', icon: '💊', color: '#96CEB4' },
  { id: 5, name: 'Shopping', icon: '🛍️', color: '#FFEAA7' },
  { id: 6, name: 'Others', icon: '📦', color: '#DDA0DD' },
]

// Get all categories
router.get('/', (req, res) => {
  res.json(categories)
})

export default router