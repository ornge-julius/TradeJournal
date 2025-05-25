import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  trades: [],
  loading: false,
  error: null,
  filters: {
    result: null,
    ticker: null,
    type: null,
    reasoning: null,
    sortBy: 'entryDate',
    sortOrder: 'desc'
  }
};

const tradeSlice = createSlice({
  name: 'trades',
  initialState,
  reducers: {
    setTrades: (state, action) => {
      state.trades = action.payload;
    },
    addTrade: (state, action) => {
      state.trades.push(action.payload);
    },
    updateTrade: (state, action) => {
      const index = state.trades.findIndex(trade => trade.id === action.payload.id);
      if (index !== -1) {
        state.trades[index] = action.payload;
      }
    },
    deleteTrade: (state, action) => {
      state.trades = state.trades.filter(trade => trade.id !== action.payload);
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  setTrades,
  addTrade,
  updateTrade,
  deleteTrade,
  setFilter,
  setLoading,
  setError
} = tradeSlice.actions;

export default tradeSlice.reducer; 