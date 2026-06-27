export const API_ROUTES = {
  CHECK_EMAIL: "/api/auth/check-email",
  REGISTER_SEND_OTP: "/api/auth/register-send-otp",
  REGISTER_VERIFY_OTP: "/api/auth/register-verify-otp",
  LOGIN: "/api/auth/login",
  INVESTMENT_SHORT_DETAILS: "/api/user/investment-assets-details",
  COMPARE_PORTFOLIO: "/api/analysis/compare",
  CAS_UPLOAD: "/api/portfolio/cas-upload",
  MY_FUND_SUMMARY: "/api/portfolio/my-fund-summary",
  ALL_MYFUND_VIEWS: "/api/portfolio/all-myfund-views",
  USER_DETAILS: "/api/user/details",
  USER_DELETE: "/api/user/delete",
  CAS_DATA_DELETE: "/api/portfolio/cas-data-delete",
  FD_LIST: "/api/fd",
  FD_CREATE: "/api/fd",
  FD_BY_ID: "/api/fd", // append /:id in service
}
