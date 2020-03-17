import {
  AUTH_CHECK,
  AUTH_ERROR,
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_GET_PERMISSIONS
} from "react-admin";
import decodeJwt from "jwt-decode";

const authActions = {
  [AUTH_ERROR]: authError,
  [AUTH_LOGIN]: authLogin,
  [AUTH_LOGOUT]: authLogout,
  [AUTH_CHECK]: authCheck,
  [AUTH_GET_PERMISSIONS]: authGetPermissions
};

export function authProvider(client) {
  return (type, params) => {
    const action = authActions[type];

    return action(params, client);
  };
}

function authCheck(_params) {
  const token = localStorage.getItem("token");

  if (!token) {
    return Promise.reject();
  }

  return Promise.resolve();
}

function authError(error) {
  if (error.status === 401) {
    return Promise.reject();
  }

  return Promise.resolve();
}

function authLogin(params, client) {
  const { email, password } = params;
  return client
    .post(`/sema/login`, { usernameOrEmail: 'training', password: '123' })
    .then(response => {
      console.log('response', response);
      return response.data;
    })
    .then(({ token }) => {
      localStorage.setItem("token", token);
    });
}

function authLogout(_params, _client) {
  localStorage.removeItem("token");
  return Promise.resolve();
}

function jsonToken() {
  const token = localStorage.getItem("token");
  const decodedToken = token ? decodeJwt(token) : null;
  return decodedToken;
}

function authGetPermissions() {
  const user = jsonToken();
  return user ? Promise.resolve(user) : Promise.reject();
}
