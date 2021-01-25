import { doLogOut } from "../redux/session-management";
import { If } from "./ControlStatements";
import {
  AppBar,
  Fade,
  IconButton,
  ListItemIcon,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar as MuiToolbar,
  Typography,
} from "@material-ui/core";
import { AccountBox, Add, ArrowBack, ExitToApp, Settings } from "@material-ui/icons";
import React, { CSSProperties,useState } from "react";
import { connect, useDispatch } from "react-redux";

interface StoreProps {
  showBackButton: boolean,
  showSettingsButton: boolean,
}
type Props = StoreProps;

const getMenuStyle = (anchorEl:HTMLElement): CSSProperties => ({
  marginTop: anchorEl ? `${anchorEl.getBoundingClientRect().height}px` : undefined,
});

const useStyles = makeStyles(() => ({
  toolbarCentralSpacer: {
    flexGrow: 1,
  },
}));

const ToolbarInternal:React.FunctionComponent<Props> = (props) => {
  const {
    showBackButton,
    showSettingsButton,
  } = props;

  const dispatch = useDispatch();
  const [state, setState] = useState({
    userMenuAnchor: null,
  });

  const {
    userMenuAnchor,
  } = state;

  const classes = useStyles();
  const openUserMenu = event => setState({ userMenuAnchor: event.currentTarget});
  const closeUserMenu = () => setState({ userMenuAnchor: null });
  const onBackClicked = () => null;
  const onAddClicked = () => null;
  const onSettingsClicked = () => null;
  const onLogOutClicked = () => dispatch(doLogOut());

  return (
    <AppBar position="static">
      <MuiToolbar>
        <If condition={showBackButton}>
          <IconButton
            aria-label="Go back"
            color="inherit"
            edge="start"
            onClick={onBackClicked}
          >
            <ArrowBack />
          </IconButton>
        </If>
        <IconButton
          aria-label="Add a new download"
          color="inherit"
          edge="start"
          onClick={onAddClicked}
        >
          <Add />
        </IconButton>
        <If condition={showSettingsButton}>
          <IconButton
            aria-label="Settings"
            color="inherit"
            edge="start"
            onClick={onSettingsClicked}
          >
            <Settings />
          </IconButton>
        </If>
        <div className={classes.toolbarCentralSpacer} />
        <IconButton
          aria-label="menu"
          color="inherit"
          edge="start"
          onClick={openUserMenu}
        >
          <AccountBox />
        </IconButton>
        <Menu
          TransitionComponent={Fade}
          anchorEl={userMenuAnchor}
          id="user-menu"
          keepMounted
          onClose={closeUserMenu}
          open={Boolean(userMenuAnchor)}
          style={getMenuStyle(userMenuAnchor)}
        >
          <MenuItem>
            <ListItemIcon>
              <AccountBox />
            </ListItemIcon>
            <Typography variant="inherit">My Account</Typography>
          </MenuItem>
          <MenuItem onClick={onLogOutClicked}>
            <ListItemIcon>
              <ExitToApp/>
            </ListItemIcon>
            <Typography variant="inherit">Sign Out</Typography>
          </MenuItem>
        </Menu>
      </MuiToolbar>
    </AppBar>
  );
};

// TODO: Flesh this one out.
const mapStateToProps = (): StoreProps => ({
  showBackButton: true,
  showSettingsButton: true,
});

export const Toolbar = connect(mapStateToProps)(ToolbarInternal);
