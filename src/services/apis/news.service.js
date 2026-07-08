import newsApi from "../newsApiClient"
import { API_ROUTES } from "../../constants/apiRoutes"

export const fetchNewsFeed = async (params) => {
  try {
    return await newsApi.get(API_ROUTES.NEWS_FEED, { params })
  } catch (error) {
    return error.response?.data || false
  }
}

export const fetchNewsRelated = async (params) => {
  try {
    return await newsApi.get(API_ROUTES.NEWS_RELATED, { params })
  } catch (error) {
    return error.response?.data || false
  }
}
