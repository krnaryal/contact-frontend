import axios from "axios";
import useStore from "../store/store";
import { apiUrl } from "./constants";

const privateAgent = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

privateAgent.interceptors.request.use(
  (config) => {
    const token = useStore.getState().token;
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

const publicAgent = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export { privateAgent, publicAgent };
