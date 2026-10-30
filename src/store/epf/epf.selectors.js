export const selectEpfSummary = (state) => {
  const data = state.epf?.summaryData;
  if (!data || data === "null" || data === "undefined" || typeof data !== "object") {
    return null;
  }
  return data;
};

export const selectEpfHasChecked = (state) => state.epf?.hasChecked;
export const selectEpfIsLoading = (state) => state.epf?.isLoading;
export const selectHasEpfData = (state) => {
  const summary = selectEpfSummary(state);
  if (!summary) return false;
  return Boolean(
    summary?.balance?.currentBalance != null ||
    (Array.isArray(summary?.accounts) && summary.accounts.length > 0)
  );
};
