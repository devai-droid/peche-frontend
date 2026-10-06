/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios"
import qs from "qs"
import { env } from "../env"

const BASE_API_URL = env.BACKEND_API_URL.replace("/api", "")

const axiosClient = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-type": "application/json",
  },
})

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => config)

function setAuthHeader(token: string): void {
  axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`
}

function clearAuthHeader(): void {
  axiosClient.defaults.headers.common.Authorization = undefined
}

export default axiosClient
export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = axios.CancelToken.source()
  const language = localStorage.getItem("language")
  const newConfig = language
    ? { ...config, headers: { ...config.headers, "Accept-Language": language } }
    : config
  return axiosClient({
    ...newConfig,
    cancelToken: source.token,
    // encode:false로 보내되, 쿼리에서 공백으로 해석되는 '+'만 %2B로 인코딩(예: 상품명 "클라디에 R+").
    paramsSerializer: (params) =>
      qs
        .stringify(params, {
          arrayFormat: "comma",
          encode: false,
        })
        .replace(/\+/g, "%2B"),
  }).then(({ data }) => data)
}
export { setAuthHeader, clearAuthHeader }
