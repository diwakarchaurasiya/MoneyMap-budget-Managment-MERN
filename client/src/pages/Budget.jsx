import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTransaction } from "../context/TransactionContext";
import { formatCurrency, getMonthName } from "../lib/utils";
import DateFilter from "../components/DateFilter";

const Budget = () => {
  const {
    transactions,
    categories,
    budgets,
    updateBudget,
    filters,
    setFilters,
    fetchBudgets,
  } = useTransaction();
  const [budgetInputs, setBudgetInputs] = useState({});

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Filter transactions based on date range or current month if no filter
  const filteredTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);

    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      return transactionDate >= start && transactionDate <= end;
    } else if (filters.startDate) {
      const start = new Date(filters.startDate);
      return transactionDate >= start;
    } else if (filters.endDate) {
      const end = new Date(filters.endDate);
      return transactionDate <= end;
    } else {
      // Default to current month if no filters
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    }
  });

  // Update budgets when filters change
  useEffect(() => {
    if (filters.startDate || filters.endDate) {
      fetchBudgets(filters);
    }
  }, [filters, fetchBudgets]);

  // Calculate budget vs actual data
  const budgetData = categories.map((category) => {
    const budget = budgets.find((b) => b.categoryName === category.name);
    const actual = filteredTransactions
      .filter((t) => t.category === category.name)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      category: category.name,
      budget: budget?.amount || 0,
      actual,
      icon: category.icon,
      color: category.color,
    };
  });

  const handleBudgetChange = (categoryName, amount) => {
    setBudgetInputs((prev) => ({
      ...prev,
      [categoryName]: amount,
    }));
  };

  const handleSaveBudget = async (categoryName) => {
    const amount = parseFloat(budgetInputs[categoryName] || 0);
    if (amount >= 0) {
      await updateBudget({
        categoryName,
        amount,
        month: currentMonth,
        year: currentYear,
      });
      setBudgetInputs((prev) => ({
        ...prev,
        [categoryName]: "",
      }));
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleClearFilters = () => {
    setFilters({ startDate: "", endDate: "", category: "" });
  };

  const totalBudget = budgetData.reduce((sum, item) => sum + item.budget, 0);
  const totalActual = budgetData.reduce((sum, item) => sum + item.actual, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Budget</h1>
        <p className="text-gray-600">
          {filters.startDate || filters.endDate
            ? `Budget tracking for ${
                filters.startDate
                  ? new Date(filters.startDate).toLocaleDateString()
                  : "start"
              } to ${
                filters.endDate
                  ? new Date(filters.endDate).toLocaleDateString()
                  : "end"
              }`
            : `Set and track your monthly budget for ${getMonthName(
                currentMonth
              )} ${currentYear}`}
        </p>
      </div>

      {/* Date Filter */}
      <DateFilter
        startDate={filters.startDate}
        endDate={filters.endDate}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalBudget)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalActual)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalBudget - totalActual >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(totalBudget - totalActual)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget vs Actual Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="budget" fill="#E5E7EB" name="Budget" />
              <Bar dataKey="actual" fill="#402E2A" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Budget Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Set Monthly Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => {
              const budget = budgets.find(
                (b) => b.categoryName === category.name
              );
              const actual = filteredTransactions
                .filter((t) => t.category === category.name)
                .reduce((sum, t) => sum + t.amount, 0);

              return (
                <div key={category.id} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{category.icon}</span>
                    <div>
                      <Label className="text-sm font-medium">
                        {category.name}
                      </Label>
                      <p className="text-xs text-gray-500">
                        Spent: {formatCurrency(actual)} / Budget:{" "}
                        {formatCurrency(budget?.amount || 0)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Enter budget amount"
                      value={budgetInputs[category.name] || ""}
                      onChange={(e) =>
                        handleBudgetChange(category.name, e.target.value)
                      }
                    />
                    <Button
                      onClick={() => handleSaveBudget(category.name)}
                      disabled={!budgetInputs[category.name]}
                    >
                      Save
                    </Button>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          budget?.amount
                            ? Math.min((actual / budget.amount) * 100, 100)
                            : 0
                        }%`,
                        backgroundColor:
                          budget?.amount && actual > budget.amount
                            ? "#EF4444"
                            : "#402E2A",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Budget;
