import { useEffect, useState } from "react"
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Snackbar,
  Alert,
  Divider,
  Grid,
} from "@mui/material"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import NonConsumableCsvUploader from "./NonConsumableCsvUploader"
import moment from "moment"
import { navigateToRoleBasedPath } from "../utils/roleNavigator"
import YearTagList from "./YearTagList"
import { showSuccessToast, showErrorToast } from "../utils/toastUtils"

const NonConsumableForm = () => {
  const [formData, setFormData] = useState({
    componentName: "",
    specification: "",
    quantity: "",
  })
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post(`${baseURL}/inventory`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      if (response?.data?.success === true) {
        showSuccessToast("Inventory entry submitted successfully!")

        setTimeout(() => {
          setFormData({
            ...formData,
            componentName: "",
            specification: "",
            quantity: "",
          })
          setLoading(false)
        }, 1500)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      showErrorToast("Error submitting inventory. Please try again!")
      setLoading(false)
    }
  }

  return (
    <>
      <Box
        sx={{
          minHeight: "85vh",
          width: "100%",
          backgroundColor: "#f5f5f5",
          padding: 2,
          mt: 1.5,
        }}
      >
        <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
          Non Consumable Stock Form
        </Typography>

        <Grid container spacing={4}>
          {/* <Grid item xs={12} md={6}>
            <Card
              elevation={3}
              sx={{
                backdropFilter: "blur(10px)",
                borderRadius: "15px 5px",
                padding: "20px",
                color: "#fff",
                boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  align="center"
                  sx={{
                    color: "#075985",
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  🏷️Manual Inventory Entry
                </Typography>

                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <TextField
                    fullWidth
                    label="Component Name"
                    name="componentName"
                    value={formData.componentName}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    InputProps={{ style: { color: "#075985" } }}
                    InputLabelProps={{ style: { color: "#075985" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#075985" },
                        "&:hover fieldset": { borderColor: "#075985" },
                        "&.Mui-focused fieldset": { borderColor: "#075985" },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Specification"
                    name="specification"
                    value={formData.specification}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    InputProps={{ style: { color: "#075985" } }}
                    InputLabelProps={{ style: { color: "#075985" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#075985" },
                        "&:hover fieldset": { borderColor: "#075985" },
                        "&.Mui-focused fieldset": { borderColor: "#075985" },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    InputProps={{
                      style: { color: "#075985" },
                      inputProps: { min: 1 },
                    }}
                    InputLabelProps={{ style: { color: "#075985" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#075985" },
                        "&:hover fieldset": { borderColor: "#075985" },
                        "&.Mui-focused fieldset": { borderColor: "#075985" },
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                      backgroundColor: loading ? "#B0BEC5" : "#043c5a",
                      "&:hover": {
                        backgroundColor: loading ? "#B0BEC5" : "#03283d",
                      },
                      color: "#fff",
                      fontWeight: "bold",
                      padding: "12px",
                      borderRadius: "10px",
                      fontSize: "16px",
                      boxShadow: "0px 4px 15px rgba(31, 13, 94, 0.4)",
                    }}
                  >
                    🚀 Submit
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 3, fontSize: "13px" }}
                    onClick={() =>
                      navigateToRoleBasedPath(navigate, "inventory_records")
                    }
                  >
                    Go to Inventory List
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid> */}

          {/* CSV Uploader Section */}
          <Grid item xs={12} md={12}>
            <Card
              elevation={3}
              sx={{
                borderRadius: "15px 5px",
                padding: "20px",
                height: "auto",
              }}
            >
              <NonConsumableCsvUploader />
            </Card>
          </Grid>
        </Grid>
        <YearTagList />
      </Box>
    </>
  )
}

export default NonConsumableForm
