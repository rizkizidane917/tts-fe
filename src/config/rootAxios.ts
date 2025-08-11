// config/rootaxios.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";
import Cookies from "js-cookie";

const Lang = Cookies.get("lang");

export const Axios: AxiosInstance = axios.create({
  baseURL: process.env.api_v1,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": Lang,
  },
  withCredentials: true,
});

export interface RootAxiosParams {
  path: string;
  params?: Record<string, any>;
  payload?: Record<string, any>;
  method: Method;
  api?: string;
}

export const rootAxios = async <T = unknown>({
  path,
  params,
  payload,
  method,
}: RootAxiosParams): Promise<T> => {
  const config: AxiosRequestConfig = {
    params,
  };

  let res: AxiosResponse<T>;

  if (method.toLowerCase() === "get" || method.toLowerCase() === "delete") {
    res = await Axios[method](path, config);
  } else {
    res = await Axios[method](path, payload, config);
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
