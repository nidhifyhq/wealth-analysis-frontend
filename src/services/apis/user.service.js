import { getRequest, deleteRequest } from "../apiClient"
import { API_ROUTES } from "../../constants/apiRoutes"

export const fetchUserDetails = () => {
  return getRequest(API_ROUTES.USER_DETAILS)
}

export const deleteUserAccount = () => {
  return deleteRequest(API_ROUTES.USER_DELETE)
}
