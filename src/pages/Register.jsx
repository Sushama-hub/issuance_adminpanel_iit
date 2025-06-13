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
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import Register2 from "../assets/images/register2.jpg";
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
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validate mobile number
  const isValidMobileNumber = (mobNumber) => {
    const mobilePattern = /^[6-9]\d{9}$/;
    // Validate Indian number format
    if (!mobilePattern.test(mobNumber)) {
      setMobileError("Enter a valid 10-digit Indian mobile number");
      return false;
    } else {
      setMobileError("");
      return true;
    }
    // ---OR----
    // if (!mobilePattern.test(mobNumber)) {
    //   return {
    //     mobileValid: false,
    //     errorMessage: "Enter a valid 10-digit Indian mobile number",
    //   };
    // } else {
    //   return { mobileValid: true, errorMessage: "" };
    // }
  };

  const isValidPassword = (password) => {
    // const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    const passwordPattern = /^\d{6}$/; // Only 6 digits

    // (?=.*[a-z]) → at least one lowercase
    // (?=.*[A-Z]) → at least one uppercase
    // (?=.*\d) → at least one digit
    // (?=.*[\W_]) → at least one special character (non-word character)
    // .{6,} → at least 6 characters total

    if (password.length > 10) return;
    // if (!passwordPattern.test(password)) {
    if (password.length < 8) {
      // setPasswordError(
      //   "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
      // );
      setPasswordError("Password must be exactly 8 digits");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setEmailError("Enter a valid email address");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mobile number validation (10 digits, Indian format)
    if (name === "mobile") {
      // Only allow digits
      if (!/^\d*$/.test(value)) return;

      // Max 10 digits
      if (value.length > 10) return;
      // 1.-------------------
      if (value.length < 10) {
        setMobileError("Enter a valid 10-digit mobile number");
      } else {
        isValidMobileNumber(value);
        // ---OR----
        // const { mobileValid, errorMessage } = isValidMobileNumber(value);
        // setMobileError(errorMessage);
      }
    }

    if (name === "password") {
      isValidPassword(value);
    }

    if (name === "email") {
      isValidEmail(value);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let isValid = true;

    // Mobile Validation
    if (!isValidMobileNumber(formData.mobile)) {
      isValid = false;
    }
    // const { mobileValid, errorMessage } = isValidMobileNumber(formData.mobile);
    // if (!mobileValid) {
    //   setMobileError(errorMessage);
    //   isValid = false;
    // } else {
    //   setMobileError("");
    // }

    // Password Validation
    if (!isValidPassword(formData.password)) {
      isValid = false;
    }

    if (!isValidEmail(formData.email)) {
      isValid = false;
    }

    // Confirm Password Check
    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    if (!isValid) {
      setIsLoading(false);
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

      showErrorToast(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        background: "linear-gradient(135deg, #075985 0%, #043c5a 100%)",
        py: { xs: 4, md: 0 }, // vertical padding on mobile to prevent overflow
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
                // src="/src/assets/images/register2.jpg"
                src={Register2}
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
                p: 4,
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
                  error={!!emailError}
                  helperText={emailError}
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
                          {showPassword?.password ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={!!passwordError}
                  helperText={passwordError}
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
                          {showPassword?.confirmPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={!!confirmPasswordError}
                  helperText={confirmPasswordError}
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
                  // slotProps={{
                  //   formHelperText: {
                  //     sx: {
                  //       backgroundColor: "#fdecea", // light red background
                  //       color: "#b71c1c", // dark red text
                  //       px: 1,
                  //       borderRadius: "4px",
                  //       mt: 0.5,
                  //     },
                  //   },
                  // }}
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
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Register"
                  )}
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
