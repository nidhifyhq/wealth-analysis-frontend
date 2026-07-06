import { getRequest, postRequest, deleteRequest } from "../apiClient"
import { API_ROUTES } from "../../constants/apiRoutes"

export const fetchBudget = () => getRequest(API_ROUTES.BUDGET_GET)

export const saveBudget = (data) => postRequest(API_ROUTES.BUDGET_SAVE, data)

export const deleteBudget = () => deleteRequest(API_ROUTES.BUDGET_DELETE)
