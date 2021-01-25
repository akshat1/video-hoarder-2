import { fetchingUser, loginError, user, userFetchDone } from "../session-management";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  fetchingUser,
  loginError,
  user,
  userFetchDone,
});
