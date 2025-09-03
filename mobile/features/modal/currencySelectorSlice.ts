import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Currency } from '../../types'; // Adjust path if needed

interface CurrencySelectorState {
  currency: Currency | null;
  recent: Currency[]; // most recently selected (unique, newest first)
  recentLimit: number;
}

const initialState: CurrencySelectorState = {
  currency: null,
  recent: [],
  recentLimit: 6,
};

const currencySelectorSlice = createSlice({
  name: 'currencySelector',
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<Currency>) => {
      state.currency = action.payload;
      // Maintain MRU list
      const existingIndex = state.recent.findIndex(
        (c) => c.countryCode === action.payload.countryCode
      );
      if (existingIndex !== -1) {
        state.recent.splice(existingIndex, 1);
      }
      state.recent.unshift(action.payload);
      if (state.recent.length > state.recentLimit) {
        state.recent = state.recent.slice(0, state.recentLimit);
      }
    },
    clearRecent: (state) => {
      state.recent = [];
    },
    resetCurrency: (state) => {
      state.currency = null;
    },
  },
});

export const { setCurrency, resetCurrency } = currencySelectorSlice.actions;

export default currencySelectorSlice.reducer;