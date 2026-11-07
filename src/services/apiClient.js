import api from "../config/axios"
import { ENV } from "../config/env"

export const postRequest = async (url, data, options = {}) => {
  try {
    return await api.post(url, data, options)
  } catch (error) {
    return error.response?.data || false
  }
}

export const getRequest = async (url, params, options = {}) => {
  try {
    return await api.get(url, { params, ...options })
  } catch (error) {
    return error.response?.data || false
  }
}


export const deleteRequest = async (url, params, options = {}) => {
  try {
    return await api.delete(url, { params, ...options })
  } catch (error) {
    return error.response?.data || false
  }
}

export const uploadFileRequest = async (url, formData, options = {}) => {
  try {
    return await api.post(url, formData, {
      headers: { 'Content-Type': undefined },
      ...options,
    })
  } catch (error) {
    return error.response?.data || false
  }
}

export const cronPostRequest = async (url, data, options = {}) => {
  return postRequest(url, data, {
    baseURL: ENV.CRON_BASE_URL || ENV.API_BASE_URL,
    ...options,
  })
}

export const cronGetRequest = async (url, params, options = {}) => {
  return getRequest(url, params, {
    baseURL: ENV.CRON_BASE_URL || ENV.API_BASE_URL,
    ...options,
  })
}
