import * as React from 'react';
import * as ReactDOM from "react-dom";
import { HashRouter } from 'react-router-dom';
import { useMediaQuery } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { getTheme } from "./theme";
import { Provider } from "react-redux";
import { App } from './components/App';
import { getStore } from './redux/store';

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

var mountNode = document.getElementById("app");
ReactDOM.render(<Main />, mountNode);
