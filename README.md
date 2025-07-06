# MoneyMap - Personal Finance Tracker

A full-stack personal finance tracking application built with the MERN stack.

## Features

- **Transaction Management**: Add, edit, and delete financial transactions
- **Category System**: Organize expenses into predefined categories (Food, Transport, Rent, Health, Shopping, Others)
- **Budget Planning**: Set monthly budgets for each category
- **Visual Analytics**: Interactive charts showing spending patterns and budget comparisons
- **Dashboard**: Comprehensive overview of financial health with insights
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

### Frontend
- React.js (without TypeScript)
- Tailwind CSS
- shadcn/ui components
- Recharts for data visualization
- React Toastify for notifications
- Lucide React for icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- RESTful API design

## Project Structure

```
moneymap-fullstack/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context for state management
│   │   ├── services/       # API service functions
│   │   └── lib/            # Utility functions
│   └── package.json
├── server/                 # Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd moneymap-fullstack
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   **Backend (.env in server folder):**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/moneymap
   NODE_ENV=development
   ```
   
   **Frontend (.env in client folder):**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the frontend (http://localhost:3000) and backend (http://localhost:5000) concurrently.

### Individual Setup

**Backend only:**
```bash
cd server
npm install
npm run dev
```

**Frontend only:**
```bash
cd client
npm install
npm run dev
```

## API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Categories
- `GET /api/categories` - Get all categories

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create/update budget
- `DELETE /api/budgets/:id` - Delete budget

### Summary
- `GET /api/summary` - Get dashboard summary
- `GET /api/summary/monthly` - Get monthly summary data

## Features Overview

### Dashboard
- Total expenses and budget overview
- Monthly spending trends
- Category-wise breakdown
- Budget insights and recommendations
- Recent transactions list

### Transactions
- Add new transactions with amount, description, category, and date
- Edit existing transactions
- Delete transactions
- View all transactions in a clean list format

### Budget Management
- Set monthly budgets for each category
- Visual comparison of budget vs actual spending
- Progress indicators for each category
- Budget insights and overspending alerts

## Deployment

### Frontend (Netlify)
1. Build the client: `cd client && npm run build`
2. Deploy the `dist` folder to Netlify
3. Update environment variables in Netlify dashboard

### Backend (Render/Railway)
1. Deploy the server folder to your preferred platform
2. Set environment variables
3. Ensure MongoDB connection is properly configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.