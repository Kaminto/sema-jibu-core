import React from "react";
import { List, Datagrid, TextField, DateField } from "react-admin";

export const KioskList = props => (
  <List title="Kiosks" {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <DateField label="Created" source="created_at" />
    </Datagrid>
  </List>
);
