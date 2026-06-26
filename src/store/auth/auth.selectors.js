export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthToken = (state) => state.auth.authToken;
export const selectUserId = (state) => state.auth.userId;
export const selectUserName = (state) => state.auth.name;
export const selectUserEmail = (state) => state.auth.email;

