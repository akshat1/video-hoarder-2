import { getInstance } from "./net";
import { getLogger } from "../../common/logger";
import { actionCreatorFactory, AsyncActionCreator, Dispatch, reducerFactory } from "./boilerplate";
import { User as UserModel, DummyUser } from "../../common/model/User";

const rootLogger = getLogger("redux/session-management");

export const User = "User";
export const setUser = actionCreatorFactory<UserModel>(User);

export const FetchingUser = "FetchingUser";
const setFetchingUser = actionCreatorFactory<boolean>(FetchingUser);

export const UserFetchDone = "UserFetchDone";
const setUserFetchDone = actionCreatorFactory<boolean>(UserFetchDone);

export const LoginError = "LoginError";
const setLoginError = actionCreatorFactory<string>(LoginError);

export const doLogIn = (username: string, password: string): AsyncActionCreator =>
  async (dispatch: Dispatch): Promise<void> => {
    const logger = getLogger("doLogin", rootLogger);
    try {
      const form = new URLSearchParams()
      form.append("username", username);
      form.append("password", password);
      logger.debug(form)
      const response = await getInstance().post("./api/user/login", form);
      logger.debug("status:", response.status);
      if (response.status !== 200) {
        dispatch(setLoginError("Login error."));
        return;
      }

      const user = response.data
      dispatch(setLoginError(null));
      dispatch(setUser(user));
     } catch(err) {
       logger.error("Log-in Failed!!!");
       logger.error(err);
       if (err.response?.status === 401) {
          dispatch(setLoginError("Incorrect username or password."));
        } else {
          dispatch(setLoginError("Login error."));
        }
     }
  };

export const fetchingUser = reducerFactory<boolean>(FetchingUser, false);
export const user = reducerFactory<UserModel>(User, DummyUser);
export const userFetchDone = reducerFactory<boolean>(UserFetchDone, false);
export const loginError = reducerFactory<Error>(LoginError, null);
