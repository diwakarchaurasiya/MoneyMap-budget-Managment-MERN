import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Plus, Download } from "lucide-react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import DateFilter from "../components/DateFilter";
import { useTransaction } from "../context/TransactionContext";

const Transactions = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const { filters, setFilters, exportTransactionsCSV } = useTransaction();

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleClearFilters = () => {
    setFilters({ startDate: "", endDate: "", category: "" });
  };

  const handleExportCSV = () => {
    exportTransactionsCSV();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">
            {filters.startDate || filters.endDate
              ? `Showing transactions from ${
                  filters.startDate
                    ? new Date(filters.startDate).toLocaleDateString()
                    : "start"
                } to ${
                  filters.endDate
                    ? new Date(filters.endDate).toLocaleDateString()
                    : "end"
                }`
              : "Manage all your financial transactions"}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Transaction</span>
          </Button>
        </div>
      </div>

      {/* Date Filter */}
      <DateFilter
        startDate={filters.startDate}
        endDate={filters.endDate}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Transaction List */}
      <TransactionList onEditTransaction={handleEditTransaction} />

      {/* Transaction Form */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        transaction={editingTransaction}
      />
    </div>
  );
};

export default Transactions;
