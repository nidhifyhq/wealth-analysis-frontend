import axios from "axios";

const newsApi = axios.create({
  baseURL: "https://nidhify-news-backend.onrender.com",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

newsApi.interceptors.response.use(
  response => response.data,
  error => {
    console.error("News API Error:", error);
    return Promise.reject(error);
  }
);

export default newsApi;
