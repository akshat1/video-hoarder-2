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
      dispatch(setFetchingUser(true));
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
    } finally {
      dispatch(setFetchingUser(false));
    }
  };

export const doLogOut = (): AsyncActionCreator =>
  async (dispatch: Dispatch): Promise<void> => {
    await getInstance().post("./api/user/logout");
    // disconnect();
    dispatch(setUser(DummyUser));
  };

export const fetchUser = ():AsyncActionCreator =>
  async (dispatch: Dispatch): Promise<void> => {
    const logger = getLogger("fetchUser");
    try {
      dispatch(setFetchingUser(true));
      const response = await getInstance().get("./api/user/me");
      if (response.status !== 200) {
        throw new Error("Error occurred");
      }
      const user = response.data;
      dispatch(setUser(user));
    } catch (err) {
      logger.error(err);
      dispatch(setUser({}));
    }
    dispatch(setFetchingUser(false));
    dispatch(setUserFetchDone(true));
  };

export const fetchingUser = reducerFactory<boolean>(FetchingUser, false);
export const user = reducerFactory<UserModel>(User, DummyUser);
export const userFetchDone = reducerFactory<boolean>(UserFetchDone, false);
export const loginError = reducerFactory<Error>(LoginError, null);
