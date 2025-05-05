import React, { useState } from "react"
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  InputAdornment,
  IconButton,
  Link,
  Grid,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "../utils/toastUtils"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL

  const handleClickShowPassword = () => setShowPassword(!showPassword)

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const { data } = await axios.post(
        `${baseURL}/admin/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )

      if (data?.success) {
        const token = data?.token
        const user = data?.user
        const expiresIn = 3600 * 1000 // 1 hour
        // const expiresIn = 10 * 1000 // 10 seconds
        const expiresAt = new Date().getTime() + expiresIn

        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("expiresAt", expiresAt.toString())

        const userRole = data?.user?.role

        // Redirect based on role
        // setTimeout(() => {
        //   if (userRole === "master") {
        //     navigate("/dashboard/master")
        //   } else if (userRole === "admin") {
        //     navigate("/dashboard/admin")
        //   } else {
        //     navigate("/dashboard/user")
        //   }
        // }, 1500)
        if (userRole === "master") {
          showSuccessToast(data?.message || "Login successful! Redirecting...")
          setTimeout(() => {
            navigate("/dashboard/master")
          }, 1500)
        } else if (userRole === "admin") {
          showSuccessToast(data?.message || "Login successful! Redirecting...")
          setTimeout(() => {
            navigate("/dashboard/admin")
          }, 1500)
        } else {
          // Handle case for "user" role - show error
          showWarningToast(
            data?.message ||
              "Access denied. Only admins and masters are allowed."
          )
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          localStorage.removeItem("expiresAt")
        }

        // Auto logout after token expiry
        setTimeout(() => {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          localStorage.removeItem("expiresAt")

          showWarningToast("Session expired. Please log in again.")
          navigate("/login")
        }, expiresIn)
      }
    } catch (error) {
      console.error("Error:", error?.response?.data?.message)
      showErrorToast("Login failed. Please try again.")
    }
  }
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
                borderRadius: "15px 0 0 15px",
                overflow: "hidden",
                display: { xs: "none", md: "block" },
              }}
            >
              <img
                src="/src/assets/images/login2.jpg"
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

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={12}
              sx={{
                p: 4,
                height: "100%",
                textAlign: "center",
                borderRadius: { xs: "15px", md: "0 15px 15px 0" },
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
                Welcome
              </Typography>
              <Typography variant="body1" gutterBottom color="#FFFFFF">
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
                  sx={textFieldStyles}
                />
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={textFieldStyles}
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
                          {showPassword ? <Visibility /> : <VisibilityOff />}
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
                    mt: 2,
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

                {/* Register link */}
                <Typography variant="body2" sx={{ color: "#fff", mt: 2 }}>
                  Don’t have an account?{" "}
                  <Link
                    href="/register"
                    underline="hover"
                    sx={{ color: "#fff", fontWeight: "bold" }}
                  >
                    Register here.
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

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
}

export default LoginPage
