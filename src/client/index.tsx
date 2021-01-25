import { App } from "./components/App";
import { getStore } from "./redux/store";
import { getTheme } from "./theme";
import { useMediaQuery } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";

const Main:React.FunctionComponent = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  return (
    <Provider store={getStore()}>
      <HashRouter>
        <ThemeProvider theme={getTheme(prefersDarkMode)}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </HashRouter>
    </Provider>
  );
};

const mountNode = document.getElementById("app");
ReactDOM.render(<Main />, mountNode);
