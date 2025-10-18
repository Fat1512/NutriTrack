import axios from "axios";

import { BASE_URL } from "./Url";
import { getAccessToken } from "./helper";
// import { refreshToken } from "../services/AuthService";

let retryQueue = [];
let isRefresh = false;

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

// AUTH_REQUEST.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const { response, config } = error;
//     if (response.status == 401 || response.status == 403) {
//       if (!isRefresh) {
//         isRefresh = true;
//         try {
//           const token = await refreshToken();
//           setLocalStorageToken(token);

//           // retryQueue.forEach((req) => {
//           //   AUTH_REQUEST.request(req.config)
//           //     .then((res) => req.resolve(res))
//           //     .catch((err) => req.reject(err));
//           // });

//           config.headers["Authorization"] = `Bearer ${token.accessToken}`;

//           retryQueue = [];

//           return AUTH_REQUEST(config);
//         } catch (err) {
//           retryQueue = [];

//           return Promise.reject(error);
//         } finally {
//           isRefresh = false;
//         }
//       }

//       return new Promise((resolve, reject) => {
//         retryQueue.push({ config: config, resolve, reject });
//       });
//     }
//     return Promise.reject(error);
//   }
// );
