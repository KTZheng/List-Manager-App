import React from "react";
import { Typography } from "@mui/material";

export default function LoginButton() {
  return (
    <Typography
      variant="button"
      onClick={() => {
        window.location.href = "/login";
      }}
      style={{ cursor: "pointer" }}
    >
      Login
    </Typography>
  );
}
