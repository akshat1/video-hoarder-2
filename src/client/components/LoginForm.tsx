import { doLogIn } from "../redux/session-management";
import { getLoginError, isFetchingUser, isLoggedIn } from "../selectors";
import { Button, Theme, Container, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { If } from "./ControlStatements";
import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { ClientStoreState } from "../../common/model/ClientStoreState";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  submit: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  form: {
    width: "100%",
  },

  loginError: {
    margin: theme.spacing[2],
  },
}));

interface IsSubmitDisabledArgs {
  fetchingUser: boolean
  loggedIn: boolean
  password: string
  userName: string
};
export const isSubmitDisabled = ({ loggedIn, fetchingUser, userName, password }: IsSubmitDisabledArgs) =>
  loggedIn || fetchingUser || !(userName && password);

interface OwnProps {
  className?: string,
}

export interface StoreProps {
  fetchingUser: boolean,
  loggedIn: boolean,
  loginError: string,
}

export type Props = OwnProps & StoreProps; // OwnProps & DispatchProp & StoreProps;

const LoginFormInternal: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const {
    className,
    fetchingUser,
    loggedIn,
    loginError,
  } = props;

  const dispatch = useDispatch()
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const onSubmit = e => {
    e.preventDefault();
    dispatch(doLogIn(userName, password));
    setUserName("");
    setPassword("");
  }
  const onUserNameChanged = e => setUserName(e.currentTarget.value);
  const onPasswordChanged = e => setPassword(e.currentTarget.value);

  return (
    <Container
      className={`${classes.container} ${className}`}
      maxWidth="xs"
    >
      <Typography
        component="h1"
        variant="h5"
      >
        Sign In
      </Typography>
      <form
        className={classes.form}
        noValidate
        onSubmit={onSubmit}
      >
        <TextField
          autoFocus
          fullWidth
          id="userName"
          label="Username"
          margin="normal"
          name="username"
          onChange={onUserNameChanged}
          required
          value={userName}
          variant="outlined"
        />
        <TextField
          fullWidth
          id="password"
          label="Password"
          margin="normal"
          name="password"
          onChange={onPasswordChanged}
          required
          type="password"
          value={password}
          variant="outlined"
        />
        <Button
          className={classes.submit}
          color="primary"
          disabled={isSubmitDisabled({ userName, password, fetchingUser, loggedIn })}
          fullWidth
          type="submit"
          variant="contained"
        >
          Sign In
          </Button>
        <If condition={!!loginError}>
          <Typography
            className={classes.loginError}
            color="error"
          >
            {loginError}
          </Typography>
        </If>
      </form>
    </Container>
  );
};

LoginFormInternal.defaultProps = {
  className: "",
};

const stateToProps = (state:ClientStoreState): StoreProps => ({
  fetchingUser: isFetchingUser(state),
  loggedIn: isLoggedIn(state),
  loginError: getLoginError(state),
});

export const LoginForm = connect(stateToProps)(LoginFormInternal);
