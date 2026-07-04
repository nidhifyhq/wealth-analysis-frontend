export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthToken = (state) => state.auth.authToken;
export const selectUserId = (state) => state.auth.userId;
export const selectUserName = (state) => state.auth.name;
export const selectUserEmail = (state) => state.auth.email;
export const selectPinHash = (state) => state.auth.pinHash;
export const selectIsPinSet = (state) => state.auth.isPinSet;
export const selectIsPinVerifiedThisSession = (state) => state.auth.isPinVerifiedThisSession;
export const selectIsAdmin = (state) => state.auth.isAdmin;
export const selectShowBalance = (state) => state.auth.showBalance;

