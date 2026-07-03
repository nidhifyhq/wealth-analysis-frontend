import { postRequest, getRequest } from "../apiClient"
import { API_ROUTES } from "../../constants/apiRoutes"

export const fetchUsers = () => getRequest(API_ROUTES.NOTIFICATION_USERS)
export const sendNotification = (payload) => postRequest(API_ROUTES.NOTIFICATION_SEND, payload)
export const sendRandomNotification = (payload) => postRequest(API_ROUTES.NOTIFICATION_SEND_RANDOM, payload)

export const syncNav = () => postRequest(API_ROUTES.ADMIN_SYNC_NAV)
export const updatePortfolios = () => postRequest(API_ROUTES.ADMIN_UPDATE_PORTFOLIOS)
