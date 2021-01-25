import React, { Fragment, useEffect } from 'react';
import { connect, useDispatch } from "react-redux";
import { Typography } from "@material-ui/core";
import { ClientStoreState } from '../../common/model/ClientStoreState';
import { isLoggedIn, isFetchingUser } from '../selectors';
import { If } from "./ControlStatements";
import { LoginForm } from './LoginForm';
import { fetchUser } from '../redux/session-management';
import { Main } from './Main';

interface StoreProps {
  loggedIn: boolean,
  loggingIn: boolean,
};

export type Props = StoreProps;

const AppInternal: React.FunctionComponent<Props> = (props) => {
  const {
    loggedIn,
    loggingIn,
  } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('Fetch user');
    dispatch(fetchUser());
  }, []);
  return (
    <Fragment>
      <If condition={loggedIn}>
        <Main />
      </If>
      <If condition={!loggedIn}>
        <If condition={loggingIn}>
          <Typography>Logging in...</Typography>
        </If>
        <If condition={!loggingIn}>
          <LoginForm />
        </If>
      </If>
    </Fragment>
  );
};

const mapStateToProps = (state: ClientStoreState): StoreProps => ({
  loggedIn: isLoggedIn(state),
  loggingIn: isFetchingUser(state),
});

export const App = connect(mapStateToProps)(AppInternal);
