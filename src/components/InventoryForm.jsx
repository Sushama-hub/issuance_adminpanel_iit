import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CsvUploader from "./CsvUploader";
import moment from "moment";
import { navigateToRoleBasedPath } from "../utils/roleNavigator";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import { inventorySampleData } from "../config/sampleDataConfig";
import { apiRequest } from "../utils/api";

const ComponentForm = () => {
  const [formData, setFormData] = useState({
    componentName: "",
    specification: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [lastEntry, setLastEntry] = useState(null);

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiRequest.post("/inventory", formData);

      if (response?.data?.success === true) {
        const newEntry = response?.data?.data;

        // Save last entry in state and localStorage
        setLastEntry(newEntry);
        localStorage.setItem("lastInventoryEntry", JSON.stringify(newEntry));

        showSuccessToast(
          response?.data?.message || "Inventory entry submitted successfully!"
        );
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
      showErrorToast(" Error submitting inventory. Please try again!");
      setLoading(false);
    }
  };

  // Load last entry from localStorage on mount
  useEffect(() => {
    const storedEntry = localStorage.getItem("lastInventoryEntry");
    if (storedEntry) {
      setLastEntry(JSON.parse(storedEntry));
    }
  }, []);

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
                    // onClick={() => navigate("/inventory_records")}
                    onClick={() =>
                      navigateToRoleBasedPath(navigate, "inventory_records")
                    }
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
              <CsvUploader
                uploadEndpoint="/inventory/csv"
                sampleData={inventorySampleData}
                title="📂 Upload Inventory via CSV"
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ComponentForm;
