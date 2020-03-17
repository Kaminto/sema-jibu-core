import { stringify } from "qs";
import {
  GET_LIST,
  GET_ONE,
  CREATE,
  UPDATE,
  UPDATE_MANY,
  DELETE,
  DELETE_MANY,
  GET_MANY,
  GET_MANY_REFERENCE
} from "react-admin";

const SAMPLE_CUSTOM_ACTION = "SAMPLE_CUSTOM_ACTION";

const restActions = {
  [CREATE]: create,
  [DELETE]: destroy,
  [DELETE_MANY]: destroyMany,
  [GET_LIST]: getList,
  [GET_MANY]: getMany,
  [GET_MANY_REFERENCE]: getManyReference,
  [GET_ONE]: getOne,
  [UPDATE]: update,
  [UPDATE_MANY]: updateMany
};

const resourceAction = {
  "sample/resouce": {
    [SAMPLE_CUSTOM_ACTION]: (url, params) => ({
      url,
      params
    })
  }
};

export function getAction(type, resource) {
  if (restActions[type]) {
    return restActions[type];
  }

  if (resourceAction[resource] && resourceAction[resource][type]) {
    return resourceAction[resource][type];
  }
}

function getList(url, params) {
  return {
    method: "GET",
    url: `${url}?${stringify({
      ...params.pagination,
      ...params.sort,
      filter: params.filter
    })}`
  };
}

function getOne(url, params) {
  return { method: "GET", url: `${url}/${params.id}` };
}

function getMany(url, params) {
  const { ids } = params;

  return { method: "GET", url: `${url}?${stringify({ ids })}` };
}

function getManyReference(url, params) {
  const { page, perPage } = params.pagination;
  const { field, order } = params.sort;
  const query = {
    field,
    order,
    page,
    perPage,
    filter: {
      ...params.filter,
      [params.target]: params.id
    }
  };

  return { method: "GET", url: `${url}?${stringify(query)}` };
}

function create(url, params) {
  return { method: "POST", url, data: params.data };
}

function update(url, params) {
  return { method: "PUT", url: `${url}/${params.id}`, data: params.data };
}

function updateMany(url, params) {
  const { ids, data } = params;
  return { method: "PUT", url: `${url}?${stringify({ ids })}`, data };
}

function destroy(url, params) {
  return { method: "DELETE", url: `${url}/${params.id}` };
}

function destroyMany(url, params) {
  const { ids } = params;
  return { method: "DELETE", url: `${url}?${stringify({ ids })}` };
}
