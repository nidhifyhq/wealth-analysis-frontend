import { getRequest, postRequest, deleteRequest, uploadFileRequest } from "../apiClient"
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

export const deleteCasData = () => {
  return deleteRequest(API_ROUTES.CAS_DATA_DELETE)
}

export const fetchFDList = () => {
  return getRequest(API_ROUTES.FD_LIST)
}

export const createFD = (payload) => {
  return postRequest(API_ROUTES.FD_CREATE, payload)
}

export const fetchFDById = (id) => {
  return getRequest(`${API_ROUTES.FD_BY_ID}/${id}`)
}

export const deleteFD = (id) => {
  return deleteRequest(`${API_ROUTES.FD_BY_ID}/${id}`)
}

export const createGold = (payload) => {
  return postRequest(API_ROUTES.GOLD_CREATE, payload)
}

export const fetchGoldList = () => {
  return getRequest(API_ROUTES.GOLD_LIST)
}

export const deleteGold = (id) => {
  return deleteRequest(`${API_ROUTES.GOLD_DELETE}/${id}`)
}

export const createRD = (payload) => {
  return postRequest(API_ROUTES.RD_CREATE, payload)
}

export const fetchRDList = () => {
  return getRequest(API_ROUTES.RD_LIST)
}

export const deleteRD = (id) => {
  return deleteRequest(`${API_ROUTES.RD_DELETE}/${id}`)
}
