import React from "react";
import { List, Datagrid, TextField, EmailField } from "react-admin";

export const UserList = props => (
  <List title="Users" {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />      
      <TextField  source="firstName" />
      <TextField  source="lastName" />
      <TextField source="username" />
      <EmailField source="email" />
      <TextField source="role" />
    </Datagrid>
  </List>
);
 