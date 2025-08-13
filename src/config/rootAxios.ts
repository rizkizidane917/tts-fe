import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  Method,
} from "axios";

export const Axios: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_KEY,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RootAxiosParams {
  path: string;
  params?: Record<string, any>;
  payload?: Record<string, any>;
  method: Method;
  api?: string;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export const rootAxios = async <T = unknown>({
  path,
  params,
  payload,
  method,
}: RootAxiosParams): Promise<T> => {
  const config: AxiosRequestConfig = { params };
  let res: AxiosResponse<T>;

  const lowerMethod = method.toLowerCase() as Method;

  if (lowerMethod === "get" || lowerMethod === "delete") {
    res = await Axios.request<T>({
      url: path,
      method: lowerMethod,
      ...config,
    });
  } else {
    res = await Axios.request<T>({
      url: path,
      method: lowerMethod,
      data: payload,
      ...config,
    });
  }

  return res.data;
};

export const setAuthToken = (token?: string): void => {
  if (typeof window !== "undefined") {
    if (token) {
      Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("loginToken", token);
    } else {
      delete Axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("loginToken");
    }
  }
};
