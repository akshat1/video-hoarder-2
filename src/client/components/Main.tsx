import React, { FunctionComponent } from "react";
import { Container, makeStyles, Theme, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { ClientStoreState } from "../../common/model/ClientStoreState";
import { getUserName } from "../selectors";
import { Toolbar } from "./Toolbar";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    height: "100vh",
    padding: 0,
  }
}));

interface StoreProps {
  userName: string
}

export type Props = StoreProps;

const MainInternal:FunctionComponent<Props> = (props) => {
  const { userName } = props;
  const classes = useStyles();
  return (
    <Container className={classes.container}>
      <Toolbar />
    </Container>
  );
};

const mapStateToProps = (state: ClientStoreState): StoreProps => ({
  userName: getUserName(state),
});

export const Main = connect(mapStateToProps)(MainInternal);
