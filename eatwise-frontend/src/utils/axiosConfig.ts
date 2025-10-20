import axios from "axios";

import { AI_URL, BASE_URL } from "./Url";
import { getAccessToken } from "./helper";

export const AI_REQUEST = axios.create({
  baseURL: AI_URL,
});

export const API = axios.create({
  baseURL: BASE_URL,
});

export const AUTH_REQUEST = axios.create({
  baseURL: BASE_URL,
});

AUTH_REQUEST.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
