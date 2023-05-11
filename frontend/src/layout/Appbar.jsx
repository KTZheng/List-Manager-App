import { AppBar, Box, Toolbar, IconButton } from "@mui/material";
import * as React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import styles from ".././layout/Appbar.module.css";
import NotificationHeading from "./AppbarHeading";
import MessageMenu from "./AppbarMessages";
import DrawerMenu from "./AppbarDrawer";
import { AppContext } from "../utils/AppContextProvider";
import { useContext, useState } from "react";
import UserMenu from "./AppbarUserMenu";
import LoginButton from "./LoginButton";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/user";

export default function DocAppBar() {
  const { handleDrawerOpen, loggedIn, setLoggedIn, setLoggedInUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const logoutResponse = await logoutUser(setLoggedIn, setLoggedInUser, navigate);
    } catch (error) {
      console.log(error);
    }
  };

  if (loggedIn) {
    return (
      <Box className={styles.appBarContainer}>
        <AppBar
          position="static"
        >
          <Toolbar className={styles.toolbar}>
            <IconButton
              size="large"
              edge="start"
              color="primary"
              aria-label="menu"
              onClick={handleDrawerOpen}
              sx={{ mr: 2 }}
            >
              <MenuIcon sx={{ color: "#9ED0F9" }} />
            </IconButton>

            <NotificationHeading />


            <MessageMenu />

            {loggedIn ? (
              <UserMenu handleLogout={handleLogout} />
            ) : (
              <LoginButton />
            )}

          </Toolbar>
        </AppBar>

        {loggedIn ? <DrawerMenu /> : null}

      </Box>
    );
  }
}

