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
  MenuItem,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    mobile: "",
  });

  const [departments] = useState([
    { id: 1, name: "Electrical" },
    { id: 2, name: "Mechanical" },
    { id: 3, name: "Civil" },
    { id: 4, name: "CSE" },
    { id: 5, name: "IT" },
  ]);

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    const url = `${baseURL}/admin/register`;

    try {
      const { data } = await axios.post(url, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log("data register", data);

      if (data?.success) {
        setOpenSnackbar(true);
        setErrorMessage(""); // Clear error if previously set
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Registration failed");
      setOpenSnackbar(true);
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
          }}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#fff" }}>
            Admin Register
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              sx={textFieldStyles}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              sx={textFieldStyles}
            />
            <TextField
              label="Password"
              name="password"
              // type={showPassword ? "text" : "password"}
              type={showPassword.password ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              sx={textFieldStyles}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      // onClick={() => setShowPassword((prev) => !prev)}
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          password: !prev.password,
                        }))
                      }
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      sx={{ color: "#fff" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword.confirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              sx={textFieldStyles}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      // onClick={() => setShowPassword((prev) => !prev)}
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          confirmPassword: !prev.confirmPassword,
                        }))
                      }
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      sx={{ color: "#fff" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!!passwordError}
              helperText={passwordError}
            />
            <TextField
              label="Mobile Number"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              sx={textFieldStyles}
            />
            <TextField
              select
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              sx={textFieldStyles}
            >
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.name}>
                  {dept.name}
                </MenuItem>
              ))}
            </TextField>

            <Button
              type="submit"
              variant="contained"
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
              Register
            </Button>

            {/* login link */}
            <Typography variant="body2" sx={{ color: "#fff", marginTop: 2 }}>
              You already have an account?{" "}
              <Link
                href="/login"
                underline="hover"
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* Snackbar */}
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
          {errorMessage || "Registration successful! Redirecting..."}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const textFieldStyles = {
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
};

export default AdminRegisterPage;
