import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  TextField,
} from "react-admin";

export const Title = ({ record }) => <span>Kiosk #{record.id}</span>;

export const KioskEdit = props => (
  <Edit title={<Title />} {...props}>
    <SimpleForm redirect={redirect}>
      <TextField source="id" />
      <TextInput source="name" />
    </SimpleForm>
  </Edit>
);

const redirect = (_basePath, id) => `sema/kiosks/admin`;
