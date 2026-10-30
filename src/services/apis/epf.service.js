import { getRequest, uploadFileRequest, deleteRequest } from "../apiClient";
import { API_ROUTES } from "../../constants/apiRoutes";

export const uploadEpfPassbook = (formData) => {
  return uploadFileRequest(API_ROUTES.EPF_UPLOAD, formData);
};

export const fetchEpfSummary = () => {
  return getRequest(API_ROUTES.EPF_SUMMARY);
};

export const deleteAllEpfData = () => {
  return deleteRequest(API_ROUTES.EPF_DELETE_ALL);
};
