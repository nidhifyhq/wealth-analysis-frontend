import api from "../config/axios"

export const postRequest = async (url, data) => {
  try {
    return await api.post(url, data)
  } catch (error) {
    return error.response?.data || false
  }
}

export const getRequest = async (url, params) => {
  try {
    return await api.get(url, { params })
  } catch (error) {
    return error.response?.data || false
  }
}


export const deleteRequest = async (url, params) => {
  try {
    return await api.delete(url, { params })
  } catch {
    return false
  }
}

export const uploadFileRequest = async (url, formData) => {
  try {
    return await api.post(url, formData, {
      headers: { 'Content-Type': undefined },
    })
  } catch (error) {
    return error.response?.data || false
  }
}