import {
  Button,
  TextField,
  Box,
  Grid,
  useTheme,
  InputAdornment,
  Typography,
  IconButton,
} from "@mui/material";

import React from "react";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState, useContext } from "react";
import { loginUser } from "../../api/user";
import { AppContext } from "../../utils/AppContextProvider";
import { useNavigate } from "react-router-dom";

function LoginBox() {
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { setLoggedIn, setLoggedInUser } = useContext(AppContext);
  const navigate = useNavigate();

  const onLogin = async (e) => {
    e.preventDefault();

    try {
      await loginUser(email, password, setLoggedIn, setLoggedInUser, navigate);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          my: 8,
          mx: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          sx={{
            color: theme.palette.info.dark,
          }}
        >
          Welcome!
        </Typography>

        <Box component="form" noValidate sx={{ mt: 1 }}>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityOutlinedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  pl: "5px",
                }}
              >
              </Box>
            </Grid>
            <Grid item xs={12}>
              <div style={{ height: "10px" }}>
                {errorMessage && (
                  <Typography
                    variant="subtitle2"
                    color="error"
                    sx={{ display: "flex", pl: "5px" }}
                  >
                    {errorMessage}
                  </Typography>
                )}
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={onLogin}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

// export default LoginBox;
export default React.memo(LoginBox);
