import { HttpError } from "react-admin";
import { getAction } from "./actions";

export function restProvider(client) {
  return (type, resource, params) => {
    const getConfig = getAction(type, resource);

    if (!getConfig) {
      return Promise.reject(new HttpError("Unsupported action"));
    }

    const url = `/${resource}`;

    const config = getConfig(url, params);

    return client(config)
      .then(response => response.data)
      .catch(error => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          return Promise.reject(
            new HttpError(error.response.data.message, error.response.status)
          );
        }

        return Promise.reject(new HttpError(error.message));
      });
  };
}
