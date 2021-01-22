import { combineReducers } from "redux";
import { fetchingUser, loginError, user, userFetchDone } from "../session-management";

export const rootReducer = combineReducers({
  fetchingUser,
  loginError,
  user,
  userFetchDone,
});
