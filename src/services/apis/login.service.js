import { postRequest } from "../apiClient"
import { API_ROUTES } from "../../constants/apiRoutes"

export const checkEmail = (payload) => {
  return postRequest(API_ROUTES.CHECK_EMAIL, payload)
}

export const registerSendOtp = (payload) => {
  return postRequest(API_ROUTES.REGISTER_SEND_OTP, payload)
}

export const registerVerifyOtp = (payload) => {
  return postRequest(API_ROUTES.REGISTER_VERIFY_OTP, payload)
}

export const userLogin = (payload) => {
  return postRequest(API_ROUTES.LOGIN, payload)
}

export const forgotPasswordSendOtp = (payload) => {
  return postRequest(API_ROUTES.FORGOT_PASSWORD_SEND_OTP, payload)
}

export const forgotPasswordReset = (payload) => {
  return postRequest(API_ROUTES.FORGOT_PASSWORD_RESET, payload)
}
