# MoneyMap - Date Filtering and CSV Export Features

## New Features Added

### 1. Date Range Filtering for Transactions

- **Location**: Transactions page (`/transactions`)
- **How to use**:
  1. Navigate to the Transactions page
  2. Use the "Date Filter" card to select start and/or end dates
  3. Transactions will automatically filter to show only those within the selected date range
  4. Click "Clear Filters" to reset and show all transactions

### 2. CSV Export for Transactions

- **Location**: Transactions page (`/transactions`)
- **How to use**:
  1. Optionally set date filters to export only specific transactions
  2. Click the "Export CSV" button in the top-right corner
  3. A CSV file named "transactions.csv" will be automatically downloaded
  4. The CSV includes columns: Date, Description, Category, Amount

### 3. Budget Date Filtering

- **Location**: Budget page (`/budget`)
- **How to use**:
  1. Navigate to the Budget page
  2. Use the "Date Filter" card to select a date range
  3. Budget comparisons will show spending within the selected period
  4. Charts and statistics update to reflect the filtered timeframe

## Technical Implementation

### Backend Changes

1. **Enhanced Transaction Endpoint** (`GET /api/transactions`):

   - Added support for `startDate` and `endDate` query parameters
   - Filters transactions by date range when parameters are provided

2. **CSV Export Endpoint** (`GET /api/transactions/export/csv`):

   - Returns transactions in CSV format
   - Supports date filtering via query parameters
   - Properly escapes special characters in descriptions
   - Sets appropriate headers for file download

3. **Budget Filtering** (`GET /api/budgets`):
   - Added date range filtering for budget data
   - Converts date ranges to year/month combinations for filtering

### Frontend Changes

1. **DateFilter Component**:

   - Reusable component for date range selection
   - Includes start date, end date inputs and clear filters button
   - Used on both Transactions and Budget pages

2. **Enhanced TransactionContext**:

   - Added filter state management
   - `setFilters` method updates filters and refreshes data
   - `exportTransactionsCSV` method handles CSV download
   - CRUD operations now refresh data with current filters

3. **Updated TransactionList Component**:

   - Shows filtered transaction count
   - Displays current date range when filters are active
   - Better empty state messages for filtered results

4. **Enhanced UI Feedback**:
   - Page headers show current filter status
   - Transaction count displays in list headers
   - Clear visual indicators when filters are active

## API Endpoints

- `GET /api/transactions?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Get filtered transactions
- `GET /api/transactions/export/csv?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Export transactions as CSV
- `GET /api/budgets?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Get filtered budgets

## Example Usage

1. **Filter transactions for current month**:

   - Set startDate to first day of month (e.g., "2025-07-01")
   - Set endDate to last day of month (e.g., "2025-07-31")

2. **Export last 30 days of transactions**:

   - Set startDate 30 days ago
   - Click "Export CSV"

3. **View budget performance for a quarter**:
   - Navigate to Budget page
   - Set date range for the quarter
   - View updated charts and statistics
