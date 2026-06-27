import { getRequest } from "../apiClient"
import { API_ROUTES } from "../../constants/apiRoutes"

export const fetchInvestmentShortDetails = () => {
  return getRequest(API_ROUTES.INVESTMENT_SHORT_DETAILS)
}

export const fetchPortfolioComparison = (params) => {
  return getRequest(API_ROUTES.COMPARE_PORTFOLIO, params)
}

export const fetchTotalAssets = () => {
  return getRequest(API_ROUTES.TOTAL_ASSETS)
}

export const fetchDashboardProduct = () => {
  return getRequest(API_ROUTES.DASHBOARD_PRODUCT)
}

export const fetchOtherInvestmentAssets = () => {
  return getRequest(API_ROUTES.OTHER_INVESTMENT_ASSETS)
}
