import { createMuiTheme } from "@material-ui/core/styles";
import _ from "lodash";

export const getTheme:any = _.memoize(darkMode =>
  createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
    },
  }),
);
