import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const url = `${baseURL}/admin/login`;

    try {
      const { data } = await axios.post(
        url,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (data?.success) {
        setOpenSnackbar(true);
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Login failed");
      setOpenSnackbar(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        // background: "linear-gradient(135deg, #667eea 0%, #f4f4f4 100%)",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            backgroundColor: "#075985",
            // backgroundColor: "#043c5a",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            fontWeight="bold"
            // color="primary"
            sx={{ color: "#fff" }}
          >
            Welcome
          </Typography>
          <Typography
            variant="body1"
            // color="textSecondary"
            gutterBottom
            sx={{ color: "#fff" }}
          >
            Please login to continue
          </Typography>
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                "& .MuiInputBase-root": {
                  color: "#fff",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#fff",
                    borderRadius: "10px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#fff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#fff",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#fff",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#fff",
                },
              }}
            />
            <TextField
              label="Password"
              // type="password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                "& .MuiInputBase-root": {
                  color: "#fff",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#fff",
                    borderRadius: "10px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#fff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#fff",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#fff",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#fff",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ color: "#fff" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                marginTop: 2,
                padding: 1,
                borderRadius: 2,
                backgroundColor: "#f0f9ff",
                "&:hover": {
                  backgroundColor: "#bae6fd",
                },
                color: "#082f49",
              }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Snackbar for Success & Error Messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={errorMessage ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {errorMessage || "Login successful! Redirecting..."}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
