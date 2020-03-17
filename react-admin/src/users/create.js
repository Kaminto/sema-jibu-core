import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
} from "react-admin";
import { userRoles } from "../constants";

export const UserCreate = props => (
  <Create title="Register User" {...props}>
    <SimpleForm redirect={redirect}>
      <TextInput source="firstName" />
      <TextInput source="lastName" />
      <TextInput source="username" />
      <TextInput source="email" />
      <SelectInput source="role" choices={userRoles} />
    </SimpleForm>
  </Create>
);

const redirect = (_basePath, _id) => `/sema/users/admin`;
