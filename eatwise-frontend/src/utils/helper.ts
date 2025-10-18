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
