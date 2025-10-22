/*
 * Copyright 2025 NutriTrack
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}
export const getAccessToken = () => {
  const token = window.localStorage.getItem("access_token");
  if (token == null) return null;
  return token;
};
export const getRefreshToken = () => {
  const token = window.localStorage.getItem("refresh_token");
  if (token == null) return null;
  return token;
};
export const setAccessToken = (token: string) => {
  window.localStorage.setItem("access_token", token);
};
export const setRefreshToken = (token: string) => {
  window.localStorage.setItem("refresh_token", token);
};
export const removeLocalStorageToken = () => {
  window.localStorage.removeItem("refresh_token");
};
export const clearToken = () => {
  window.localStorage.removeItem("refresh_token");
  window.localStorage.removeItem("access_token");
};
