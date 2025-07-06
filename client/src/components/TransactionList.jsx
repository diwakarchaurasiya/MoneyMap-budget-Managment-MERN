import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useTransaction } from "../context/TransactionContext";
import { formatCurrency, formatDate } from "../lib/utils";

const TransactionList = ({ onEditTransaction, limit = null }) => {
  const { transactions, deleteTransaction, categories, filters } =
    useTransaction();

  const getCategoryIcon = (categoryName) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category ? category.icon : "📦";
  };

  const getCategoryColor = (categoryName) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category ? category.color : "#DDA0DD";
  };

  const displayTransactions = limit
    ? transactions.slice(0, limit)
    : transactions;

  const hasActiveFilters = filters.startDate || filters.endDate;
  const getTitle = () => {
    if (hasActiveFilters) {
      return `Filtered Transactions (${displayTransactions.length})`;
    }
    return limit
      ? "Recent Transactions"
      : `All Transactions (${displayTransactions.length})`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
        {hasActiveFilters && (
          <p className="text-sm text-gray-500">
            Showing transactions from{" "}
            {filters.startDate
              ? new Date(filters.startDate).toLocaleDateString()
              : "start"}
            to{" "}
            {filters.endDate
              ? new Date(filters.endDate).toLocaleDateString()
              : "end"}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayTransactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {hasActiveFilters
                ? "No transactions found for the selected date range"
                : "No transactions found"}
            </p>
          ) : (
            displayTransactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                    style={{
                      backgroundColor: getCategoryColor(transaction.category),
                    }}
                  >
                    {getCategoryIcon(transaction.category)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.category}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </span>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditTransaction(transaction)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTransaction(transaction._id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionList;
