import { combineReducers, createStore, Store } from "redux";
import { rootReducer } from "./reducers";

let store:Store;
export const getStore = () => {
  if (!store) {
    store = createStore(rootReducer);
  }

  return store;
}
