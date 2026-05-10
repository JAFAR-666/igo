import axios from "axios";

export const mobileApi = axios.create({
  baseURL: "http://localhost:4000/api",
});

export function setMobileToken(token: string | null) {
  if (!token) {
    delete mobileApi.defaults.headers.common.Authorization;
    return;
  }

  mobileApi.defaults.headers.common.Authorization = `Bearer ${token}`;
}
