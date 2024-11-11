import { configureStore } from '@reduxjs/toolkit';
import bankReducer from './BankSlice';

const store = configureStore({
  reducer: {
    bank: bankReducer,
  },
 
});

export default store;