import React, { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "react-toastify";
import * as api from "../services/api";

const TransactionContext = createContext();

const initialState = {
  transactions: [],
  budgets: [],
  categories: [
    { id: 1, name: "Food", icon: "🍕", color: "#FF6B6B" },
    { id: 2, name: "Transport", icon: "🚗", color: "#4ECDC4" },
    { id: 3, name: "Rent", icon: "🏠", color: "#45B7D1" },
    { id: 4, name: "Health", icon: "💊", color: "#96CEB4" },
    { id: 5, name: "Shopping", icon: "🛍️", color: "#FFEAA7" },
    { id: 6, name: "Others", icon: "📦", color: "#DDA0DD" },
  ],
  loading: false,
  error: null,
  filters: {
    startDate: "",
    endDate: "",
    category: "",
  },
};

const transactionReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload, loading: false };
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        loading: false,
      };
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t._id === action.payload._id ? action.payload : t
        ),
        loading: false,
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter(
          (t) => t._id !== action.payload
        ),
        loading: false,
      };
    case "SET_BUDGETS":
      return { ...state, budgets: action.payload, loading: false };
    case "UPDATE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.some(
          (b) => b.categoryId === action.payload.categoryId
        )
          ? state.budgets.map((b) =>
              b.categoryId === action.payload.categoryId ? action.payload : b
            )
          : [...state.budgets, action.payload],
        loading: false,
      };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    default:
      return state;
  }
};

export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Fetch transactions
  const fetchTransactions = async (filters = {}) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const data = await api.getTransactions(filters);
      dispatch({ type: "SET_TRANSACTIONS", payload: data });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error("Failed to fetch transactions");
    }
  };

  // Add transaction
  const addTransaction = async (transactionData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const data = await api.createTransaction(transactionData);
      // Refresh transactions with current filters
      await fetchTransactions(state.filters);
      toast.success("Transaction added successfully");
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error("Failed to add transaction");
    }
  };

  // Update transaction
  const updateTransaction = async (id, transactionData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const data = await api.updateTransaction(id, transactionData);
      // Refresh transactions with current filters
      await fetchTransactions(state.filters);
      toast.success("Transaction updated successfully");
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error("Failed to update transaction");
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await api.deleteTransaction(id);
      // Refresh transactions with current filters
      await fetchTransactions(state.filters);
      toast.success("Transaction deleted successfully");
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error("Failed to delete transaction");
    }
  };

  // Fetch budgets
  const fetchBudgets = async (filters = {}) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const data = await api.getBudgets(filters);
      dispatch({ type: "SET_BUDGETS", payload: data });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error("Failed to fetch budgets");
    }
  };

  // Update budget
  const updateBudget = async (budgetData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const data = await api.updateBudget(budgetData);
      dispatch({ type: "UPDATE_BUDGET", payload: data });
      toast.success("Budget updated successfully");
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error("Failed to update budget");
    }
  };

  // Set filters
  const setFilters = (filters) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
    fetchTransactions(filters);
  };

  // Export transactions to CSV
  const exportTransactionsCSV = async () => {
    try {
      await api.exportTransactionsCSV(state.filters);
      toast.success("Transactions exported successfully");
    } catch (error) {
      toast.error("Failed to export transactions");
    }
  };

  // Load initial data
  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  const value = {
    ...state,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateBudget,
    fetchTransactions,
    fetchBudgets,
    setFilters,
    exportTransactionsCSV,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransaction must be used within a TransactionProvider");
  }
  return context;
};
