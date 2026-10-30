import { createSlice } from "@reduxjs/toolkit";
import { logout } from "../auth/auth.slice";

const initialState = {
  summaryData: null,
  hasChecked: false,
  isLoading: false,
  error: null,
};

const epfSlice = createSlice({
  name: "epf",
  initialState,
  reducers: {
    setEpfLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setEpfSummary: (state, action) => {
      state.summaryData = action.payload;
      state.hasChecked = true;
      state.isLoading = false;
      state.error = null;
    },
    setEpfError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.hasChecked = true;
    },
    clearEpfData: (state) => {
      state.summaryData = null;
      state.hasChecked = true;
      state.isLoading = false;
      state.error = null;
    },
    resetEpfState: () => initialState,
  },
  extraReducers: (builder) => {
    // When the user logs out from anywhere in the app, purge EPF cache
    builder.addCase(logout, () => initialState);
  },
});

export const {
  setEpfLoading,
  setEpfSummary,
  setEpfError,
  clearEpfData,
  resetEpfState,
} = epfSlice.actions;

export default epfSlice.reducer;
