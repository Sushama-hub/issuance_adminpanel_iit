import React from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { Box, Button } from "@mui/material";

export default function GoogleLoginButton({ onSuccess }) {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google Login Success:", user);
      if (onSuccess) onSuccess(user);
    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Google Sign-in failed. Please try again.");
    }
  };

  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={handleGoogleLogin}
      sx={{
        width: { xs: "none", md: "30%" },
        padding: "5px",
        fontSize: "0.8rem",
        borderRadius: "4px",
        mb: 0.5,
        gap: 1,
      }}
    >
      <Box
        component="img"
        src="/google.png"
        alt="Google logo"
        sx={{ width: 24, height: 24 }}
      />
      Sign in with Google
    </Button>
  );
}
