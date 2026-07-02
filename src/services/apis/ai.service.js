import { postRequest } from "../apiClient"
import { API_ROUTES } from "../../constants/apiRoutes"

export const sendChatMessage = (prompt) => {
  return postRequest(API_ROUTES.AI_CHAT, { prompt })
}
