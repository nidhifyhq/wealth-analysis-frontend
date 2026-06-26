import { uploadFileRequest } from "../apiClient"
import { API_ROUTES } from "../../constants/apiRoutes"

export const uploadCas = (formData) => {
  return uploadFileRequest(API_ROUTES.CAS_UPLOAD, formData)
}
