import { Toolbar } from "./Toolbar";
import { Container, makeStyles } from "@material-ui/core";
import React, { FunctionComponent } from "react";

const useStyles = makeStyles(() => ({
  container: {
    height: "100vh",
    padding: 0,
  },
}));

export const Main:FunctionComponent = () => {
  const classes = useStyles();
  return (
    <Container className={classes.container}>
      <Toolbar />
    </Container>
  );
};
