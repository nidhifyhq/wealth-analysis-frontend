import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  authToken: "",
  userId: "",
  name: "",
  email: "",
  pinHash: "",
  isPinSet: false,
  isPinVerifiedThisSession: false,
  isAdmin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthFromLogin: (state, action) => {
      const data = action.payload;
      state.isAuthenticated = true;
      state.isPinVerifiedThisSession = true;
      if (data.authToken) state.authToken = data.authToken;
      if (data.userId) state.userId = data.userId;
      if (data.name) state.name = data.name;
      if (data.email) state.email = data.email;
      if (data.isAdmin !== undefined) state.isAdmin = data.isAdmin;
    },

    setPin: (state, action) => {
      state.pinHash = action.payload;
      state.isPinSet = true;
    },

    clearPin: (state) => {
      state.pinHash = "";
      state.isPinSet = false;
    },

    setPinVerified: (state) => {
      state.isPinVerifiedThisSession = true;
    },

    clearPinVerified: (state) => {
      state.isPinVerifiedThisSession = false;
    },

    logout: () => initialState,
  },
});

export const { setAuthFromLogin, setPin, clearPin, setPinVerified, clearPinVerified, logout } = authSlice.actions;
export default authSlice.reducer;
