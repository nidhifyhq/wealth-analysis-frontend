import { getRequest, uploadFileRequest } from "../apiClient"
import { API_ROUTES } from "../../constants/apiRoutes"

export const uploadCas = (formData) => {
  return uploadFileRequest(API_ROUTES.CAS_UPLOAD, formData)
}

export const fetchMyFundSummary = () => {
  return getRequest(API_ROUTES.MY_FUND_SUMMARY)
}

export const fetchAllMyFundViews = () => {
  return getRequest(API_ROUTES.ALL_MYFUND_VIEWS)
}
