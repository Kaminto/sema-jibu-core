import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput
} from "react-admin";

import { userRoles } from "../constants";
import { EditToolbar } from "../elements/edit-toolbar";

export const UserEdit = props => (
  <Edit title="Edit User" {...props}>
    <SimpleForm toolbar={<EditToolbar />} redirect={redirect}>
      <TextInput source="firstName" />
      <TextInput source="lastName" />
      <TextInput source="username" />
      <TextInput source="email" />
      <SelectInput source="role" choices={userRoles} />
    </SimpleForm>
  </Edit>
);

const redirect = (_basePath, _id) => `/sema/users/admin`;
