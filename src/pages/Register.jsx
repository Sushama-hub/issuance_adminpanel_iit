import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  InputAdornment,
  IconButton,
  MenuItem,
  Link,
  Grid,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import { apiRequest } from "../utils/api";

const AdminRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "Electronics",
    mobile: "",
  });

  const [departments] = useState([
    { id: 1, name: "Electrical" },
    { id: 2, name: "Mechanical" },
    { id: 3, name: "Civil" },
    { id: 4, name: "CSE" },
    { id: 5, name: "IT" },
    { id: 6, name: "Electrical" },
  ]);

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [passwordError, setPasswordError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mobile number validation (10 digits, Indian format)
    if (name === "mobile") {
      const mobilePattern = /^[6-9]\d{9}$/;
      if (!mobilePattern.test(value)) {
        setMobileError("Enter a valid 10-digit Indian mobile number");
      } else {
        setMobileError("");
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mobilePattern = /^[6-9]\d{9}$/;
    let isValid = true;

    if (!mobilePattern.test(formData.mobile)) {
      setMobileError("Please Enter a valid 10-digit Indian mobile number");
      isValid = false;
    } else {
      setMobileError("");
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) {
      return; // stop form submission
    }

    try {
      const { data } = await apiRequest.post("/admin/register", formData);

      if (data?.success) {
        showSuccessToast(
          data?.message || "Registration successful! Please proceed to login."
        );
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      showErrorToast("Registration failed. Please try again.");
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
        background: "linear-gradient(135deg, #075985 0%, #043c5a 100%)",
      }}
    >
      <Container maxWidth="md" sx={{ p: 1 }}>
        <Grid container spacing={1}>
          {/* Left Side - Image with Overlay */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: "100%",
                borderRadius: "20px 0 0 20px",
                overflow: "hidden",
                display: { xs: "none", md: "block" },
              }}
            >
              <img
                src="/src/assets/images/register2.jpg"
                alt="login"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "inherit",
                }}
              />
            </Box>
          </Grid>

          {/* Right Side - Register Form */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={12}
              sx={{
                p: 3,
                height: "100%",
                textAlign: "center",
                borderRadius: { xs: "20px", md: "0 20px 20px 0" },
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(12px)",
                boxShadow: "0px 6px 25px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                fontWeight="bold"
                color="#FFFFFF"
              >
                Register
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
                  size="small"
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
                  size="small"
                  sx={textFieldStyles}
                />
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword.password ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  size="small"
                  sx={textFieldStyles}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
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
                  size="small"
                  sx={textFieldStyles}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
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
                  size="small"
                  sx={textFieldStyles}
                  error={!!mobileError}
                  helperText={mobileError}
                />

                <TextField
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={textFieldStyles}
                />
                {/* <TextField
                  select
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  size="small"
                  sx={textFieldStyles}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </TextField> */}

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    mt: 2,
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
                <Typography
                  variant="body2"
                  sx={{ color: "#fff", marginTop: 2 }}
                >
                  You already have an account?{" "}
                  <Link
                    href="/login"
                    underline="hover"
                    sx={{ color: "#fff", fontWeight: "bold" }}
                  >
                    Login here.
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const textFieldStyles = {
  textAlign: "left",
  "& .MuiInputBase-root": {
    color: "#fff",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.6)",
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
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 100px rgba(255,255,255,0.1) inset",
    WebkitTextFillColor: "#fff",
    caretColor: "#fff",
    borderRadius: "10px",
    transition: "background-color 5000s ease-in-out 0s",
  },
};

export default AdminRegisterPage;
