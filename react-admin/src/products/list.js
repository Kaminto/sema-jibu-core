import React from "react";
import { List, Datagrid, TextField } from "react-admin";

export const ListProducts = props => (
  <List title="Products" {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="description" />
      <TextField source="sku" />
      <TextField source="priceAmount" />
      <TextField source="priceCurrency" />
      <TextField source="unitMeasurement" />


    </Datagrid>
  </List>
);
