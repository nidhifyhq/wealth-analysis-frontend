import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  authToken: "",
  userId: "",
  name: "",
  email: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthFromLogin: (state, action) => {
      const data = action.payload;
      state.isAuthenticated = true;
      if (data.authToken) state.authToken = data.authToken;
      if (data.userId) state.userId = data.userId;
      if (data.name) state.name = data.name;
      if (data.email) state.email = data.email;
    },

    logout: () => initialState,
  },
});

export const { setAuthFromLogin, logout } = authSlice.actions;
export default authSlice.reducer;
