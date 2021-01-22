import React, { Fragment, useEffect } from 'react';
import { connect, useDispatch } from "react-redux";
import { Typography } from "@material-ui/core";
import { ClientStoreState } from '../common/model/ClientStoreState';
import { getUserName, isLoggedIn } from './selectors';
import { If } from "./ControlStatements";
import { doLogIn } from "./redux/session-management";

interface PropTypes {
  loggedIn: boolean,
  userName: string,
};

const App: React.FunctionComponent<PropTypes> = (props) => {
  console.log(props);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(doLogIn("admin", "password"));
  }, []);
  return (
    <Fragment>
      <If condition={props.loggedIn}>
        <Typography>{`Hello ${props.userName}`}</Typography>
      </If>
      <If condition={!props.loggedIn}>
        <Typography>Not logged in.</Typography>
      </If>
    </Fragment>
  );
};

const mapStateToProps = (state: ClientStoreState): PropTypes => ({
  loggedIn: isLoggedIn(state),
  userName: getUserName(state),
});

export default connect(mapStateToProps)(App);
