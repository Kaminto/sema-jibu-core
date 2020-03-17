import axios from "axios";

import { backendUrl } from "../config";

export function httpClient(baseURL) {
  const client = axios.create({ baseURL });
  client.interceptors.request.use(request => {
    const accessToken = localStorage.getItem("token");
    return {
      ...request,
      headers: {
        ...request.headers,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
      }
    };
  });

  return client;
}

export const client = httpClient(backendUrl);
