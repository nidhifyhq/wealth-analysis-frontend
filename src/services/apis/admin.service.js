import { cronPostRequest, cronGetRequest } from "../apiClient"
import { API_ROUTES } from "../../constants/apiRoutes"

export const fetchUsers = () => cronGetRequest(API_ROUTES.NOTIFICATION_USERS)
export const fetchAllUsers = () => cronGetRequest(API_ROUTES.ADMIN_ALL_USERS)
export const sendNotification = (payload) => cronPostRequest(API_ROUTES.NOTIFICATION_SEND, payload)
export const sendRandomNotification = (payload) => cronPostRequest(API_ROUTES.NOTIFICATION_SEND_RANDOM, payload)

export const syncNav = () => cronPostRequest(API_ROUTES.ADMIN_SYNC_NAV)
export const updatePortfolios = () => cronPostRequest(API_ROUTES.ADMIN_UPDATE_PORTFOLIOS)

