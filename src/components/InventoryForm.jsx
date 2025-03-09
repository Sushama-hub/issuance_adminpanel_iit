import { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ComponentForm = () => {
  const [formData, setFormData] = useState({
    componentName: "",
    specification: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    severity: "success", // can be "success", "error", "warning", "info"
  });

  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${baseURL}/inventory`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (response?.data?.success === true) {
        setSnackbarData({
          open: true,
          message: "✅ Inventory entry submitted successfully!",
          severity: "success",
        });
        setTimeout(() => {
          setFormData({
            ...formData,
            componentName: "",
            specification: "",
            quantity: "",
          });
          setLoading(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      setSnackbarData({
        open: true,
        message: "❌ Error submitting inventory. Please try again!",
        severity: "error",
      });

      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        // alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        padding: 3,
      }}
    >
      <Container maxWidth="sm">
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
              🏷️ Inventory Entry
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {/* Component Name */}
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

              {/* Specification */}
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

              {/* Quantity */}
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

              {/* Submit Button */}
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
                sx={{ mt: 3, fontSize: "12px" }}
                onClick={() => navigate("/inventory_records")}
              >
                Go to Inventory List
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Snackbar for Success & Error Messages */}
      <Snackbar
        open={snackbarData.open}
        autoHideDuration={3000}
        onClose={() => setSnackbarData({ ...snackbarData, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarData({ ...snackbarData, open: false })}
          severity={snackbarData.severity}
          sx={{ width: "100%" }}
        >
          {snackbarData.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ComponentForm;
