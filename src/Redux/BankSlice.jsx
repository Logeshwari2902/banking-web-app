import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';

const initialState = {
  bankAccounts: [], 
  transactions: [], 
  selectedBank: '', 
};

export const fetchBankAccounts = createAsyncThunk(
  'bank/fetchBankAccounts',
  async () => {
    const url = process.env.REACT_APP_API_URL;
    const response = await fetch(url+'banknames/bankname');
    if (!response.ok) {
      throw new Error('Failed to fetch bank accounts');
    }
    const data = await response.json();
    return data;
  }
);

export const fetchTransactions = createAsyncThunk(
  'bank/fetchTransactions',
  async () => {
    const url = process.env.REACT_APP_API_URL;
    const response = await fetch(url+'gettransactions/fetchtransactions');
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    const data = await response.json();
    return data;
  }
);

// Async action to handle the transfer of funds and update the balance
export const transferFunds = createAsyncThunk(
  'bank/transferFunds',
  async ({ accountName, amount }, { dispatch, getState }) => {
    const state = getState();
    const account = state.bank.bankAccounts.find(acc => acc.bankName === accountName);

    if (account && account.balance >= amount) {
      const newBalance = account.balance - amount;
      
      dispatch(updateBalance({ accountName, newBalance }));
      
      dispatch(addTransaction({
        account: accountName,
        amount,
        type: 'expense', 
        date: new Date().toLocaleString(), 
        status: 'Success', 
        category: 'Transfer', 
      }));
      return { accountName, newBalance };
    } else {
      throw new Error('Insufficient balance');
    }
  }
);

// Action to update the balance of a specific bank account
export const updateBalance = createAction('bank/updateBalance');

const bankSlice = createSlice({
  name: 'bank',
  initialState,
  reducers: {
    addBankAccount: (state, action) => {
      state.bankAccounts.push(action.payload);
      // Set default bank when first added
      if (!state.selectedBank) {
        state.selectedBank = action.payload.bankName;
      }
    },
    addTransaction: (state, action) => {
      state.transactions.push(action.payload); 
    },
    setSelectedBank: (state, action) => {
      state.selectedBank = action.payload; 
    },
    resetState: () => initialState, 
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBankAccounts.fulfilled, (state, action) => {
        state.bankAccounts = action.payload; // Populate bank accounts from the server response
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload; // Populate transactions from the server response
      })
      .addCase(transferFunds.fulfilled, (state, action) => {
        const { accountName, newBalance } = action.payload;
        const account = state.bankAccounts.find(acc => acc.bankName === accountName);
        if (account) {
          account.balance = newBalance; // Update the balance for the account
        }
      })
      .addCase(updateBalance, (state, action) => {
        const { accountName, newBalance } = action.payload;
        const account = state.bankAccounts.find(acc => acc.bankName === accountName);
        if (account) {
          account.balance = newBalance; // Update the balance for the specific account
        }
      });
  },
});

// Exporting actions
export const { addBankAccount, addTransaction, setSelectedBank, resetState } = bankSlice.actions;

// Selectors
export const selectBankAccounts = (state) => state.bank.bankAccounts; // Fetch bank accounts
export const selectTransactions = (state) => state.bank.transactions; // Fetch transactions
export const selectSelectedBank = (state) => state.bank.selectedBank; // Fetch selected bank

// Exporting the reducer
export default bankSlice.reducer;