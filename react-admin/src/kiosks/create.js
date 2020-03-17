import React from "react";
import { Create, SimpleForm, TextInput } from "react-admin";

export const KioskCreate = props => (
  <Create title="Add Kiosk" {...props}>
    <SimpleForm redirect={redirect}>
      <TextInput source="name" />
    </SimpleForm>
  </Create>
);

const redirect = (_basePath, id) => `sema/kiosks/admin`;
