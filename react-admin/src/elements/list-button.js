import React from "react";
import { Button } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { Link } from "react-router-dom";

export const ListButton = ({ resource }) => {
  return (
    <Button
      variant="flat"
      color="default"
      component={Link}
      to={{
        pathname: resource
      }}
    >
      <ArrowBack />
    </Button>
  );
};
