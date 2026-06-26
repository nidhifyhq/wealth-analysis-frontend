import { getRequest } from "../apiClient"
import { API_ROUTES } from "../../constants/apiRoutes"

export const fetchInvestmentShortDetails = () => {
  return getRequest(API_ROUTES.INVESTMENT_SHORT_DETAILS)
}
