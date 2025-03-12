import { useEffect, useState } from "react";
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
  Divider,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CsvUploader from "./CsvUploader";
import moment from "moment";

const ComponentForm = () => {
  const [formData, setFormData] = useState({
    componentName: "",
    specification: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [lastEntry, setLastEntry] = useState(null);
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
    console.log("formData", formData);

    try {
      const response = await axios.post(`${baseURL}/inventory`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log("response", response?.data);
      if (response?.data?.success === true) {
        const newEntry = response?.data?.data;

        // Save last entry in state and localStorage
        setLastEntry(newEntry);
        localStorage.setItem("lastInventoryEntry", JSON.stringify(newEntry));

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

  // Load last entry from localStorage on mount
  useEffect(() => {
    const storedEntry = localStorage.getItem("lastInventoryEntry");
    if (storedEntry) {
      setLastEntry(JSON.parse(storedEntry));
    }
    // const storedCsvEntry = localStorage.getItem("lastCsvEntry");
    // if (storedCsvEntry) setCsvLastEntry(JSON.parse(storedCsvEntry));
  }, []);

  return (
    <>
      <Box
        sx={{
          minHeight: "100%",
          // display: "flex",
          // alignItems: "center",
          // justifyContent: "center",
          backgroundColor: "#f5f5f5",
          padding: 2,
        }}
      >
        <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
          Inventory Form
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
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
                  {/* 📝Manual Inventory Entry */}
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
                    sx={{ mt: 3, fontSize: "13px" }}
                    onClick={() => navigate("/inventory_records")}
                  >
                    Go to Inventory List
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* CSV Uploader Section */}
          <Grid item xs={12} md={6}>
            {/* Last Entry Card */}
            {lastEntry && (
              <Card
                elevation={3}
                sx={{
                  backdropFilter: "blur(5px)",
                  borderRadius: "10px",
                  padding: "16px",
                  color: "#333",
                  // backgroundColor: "#e0f7fa",
                  backgroundColor: "#E3F2FD",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                  marginBottom: 4,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="#043c5a"
                    align="center"
                    gutterBottom
                  >
                    📦 Last Inventory Entry
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Typography variant="body1">
                    <strong>Component:</strong> {lastEntry.componentName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Specification:</strong> {lastEntry.specification}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Quantity:</strong> {lastEntry.quantity}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    <em>Added On:</em>
                    {/* {new Date(lastEntry.createdAt).toLocaleString()} <br /> */}
                    {moment(lastEntry.createdAt).format(
                      "DD-MM-YYYY hh:mm:ss A"
                    )}
                  </Typography>
                </CardContent>
              </Card>
            )}
            <Card
              elevation={3}
              sx={{
                borderRadius: "15px 5px",
                padding: "20px",
                height: "auto",
              }}
            >
              <CsvUploader />
            </Card>
          </Grid>
        </Grid>

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
    </>
  );
};

export default ComponentForm;
