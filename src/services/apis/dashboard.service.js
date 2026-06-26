import { getRequest, postRequest } from "../apiClient"
import { API_ROUTES } from "../../constants/apiRoutes"

export const fetchDashboardProducts = (payload) => {
    postRequest(API_ROUTES.DASHBOARD_PRODUCTS, payload)
};
