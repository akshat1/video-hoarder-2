import { rootReducer } from "./reducers";
import { Store, applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";

let store:Store;
export const getStore = () => {
  if (!store) {
    const middlewares = [thunk];
    /* istanbul ignore next. We'll figure out the devtools branch when we mock the window. */
    const composeArgs = [
      applyMiddleware(...middlewares),
      // @ts-ignore
      typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,  // TODO: Fake window for testing.
    ];

    // @ts-ignore
    store = compose(...composeArgs)(createStore)(rootReducer);
  }

  return store;
}
