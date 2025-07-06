import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
} from "recharts";
import { useTransaction } from "../context/TransactionContext";
import { formatCurrency, getMonthName } from "../lib/utils";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

const Dashboard = () => {
  const { transactions, categories, budgets } = useTransaction();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Calculate current month data
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const currentMonthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  const totalExpenses = currentMonthTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);

  // Calculate category breakdown
  const categoryBreakdown = categories
    .map((category) => {
      const categoryTransactions = currentMonthTransactions.filter(
        (t) => t.category === category.name
      );
      const amount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
      return {
        name: category.name,
        amount,
        color: category.color,
        icon: category.icon,
      };
    })
    .filter((cat) => cat.amount > 0);

  // Calculate monthly data for the past 6 months
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);
    const monthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === date.getMonth() &&
        transactionDate.getFullYear() === date.getFullYear()
      );
    });
    const monthTotal = monthTransactions.reduce((sum, t) => sum + t.amount, 0);

    monthlyData.push({
      month: getMonthName(date.getMonth()),
      amount: monthTotal,
    });
  }

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const getBudgetInsights = () => {
    const insights = [];

    budgets.forEach((budget) => {
      const categorySpent = currentMonthTransactions
        .filter((t) => t.category === budget.categoryName)
        .reduce((sum, t) => sum + t.amount, 0);

      const percentage =
        budget.amount > 0 ? (categorySpent / budget.amount) * 100 : 0;

      if (percentage > 100) {
        insights.push({
          type: "overspent",
          category: budget.categoryName,
          amount: categorySpent - budget.amount,
          message: `You overspent in ${budget.categoryName} by ${formatCurrency(
            categorySpent - budget.amount
          )}`,
        });
      } else if (percentage < 80) {
        insights.push({
          type: "within_budget",
          category: budget.categoryName,
          message: `You're within budget in ${budget.categoryName}`,
        });
      }
    });

    return insights;
  };

  const budgetInsights = getBudgetInsights();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's your financial overview for{" "}
            {getMonthName(currentMonth)} {currentYear}
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Transaction</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalBudget)}
            </div>
            <p className="text-xs text-muted-foreground">Monthly budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Budget Remaining
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalBudget - totalExpenses >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(totalBudget - totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalBudget - totalExpenses >= 0
                ? "Under budget"
                : "Over budget"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentMonthTransactions.length}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Expenses Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="amount" fill="#402E2A" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      {budgetInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Budget Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {budgetInsights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    insight.type === "overspent"
                      ? "bg-red-50 border border-red-200"
                      : "bg-green-50 border border-green-200"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      insight.type === "overspent"
                        ? "text-red-800"
                        : "text-green-800"
                    }`}
                  >
                    {insight.message}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      <TransactionList onEditTransaction={handleEditTransaction} limit={5} />

      {/* Transaction Form */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        transaction={editingTransaction}
      />
    </div>
  );
};

export default Dashboard;
