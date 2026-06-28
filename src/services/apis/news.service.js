import { getRequest } from "../apiClient"
import { API_ROUTES } from "../../constants/apiRoutes"

export const fetchNewsFeed = (params, options) => {
  return getRequest(API_ROUTES.NEWS_FEED, params, options)
}

export const fetchNewsRelated = (params, options) => {
  return getRequest(API_ROUTES.NEWS_RELATED, params, options)
}
