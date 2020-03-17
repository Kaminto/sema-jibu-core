import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
} from "react-admin";

export const CreateProduct = props => {
  return (
    <Create title="Create Product" {...props}>
      <SimpleForm redirect={redirect}>
        <TextInput source="description" />
        <TextInput source="sku" />
        <TextInput source="priceAmount" />
        <TextInput source="priceCurrency" />
        <TextInput source="unitMeasurement" />
      </SimpleForm>
    </Create>
  );
};

const redirect = (_basePath, _id, data) => `sema/products/admin`;
