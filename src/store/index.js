import { configureStore } from '@reduxjs/toolkit';
import tradeReducer from './tradeSlice';

export const store = configureStore({
  reducer: {
    trades: tradeReducer
  }
}); 