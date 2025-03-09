import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
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

const InventoryForm = () => {
  const [formData, setFormData] = useState({
    componentName: "",
    specification: "",
    quantity: 0,
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const baseUrl = "http://localhost:5000/api/v1/inventory";
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL for editing

  useEffect(() => {
    if (id) {
      // Fetch data for editing
      axios.get(`${baseUrl}/${id}`).then((res) => {
        setFormData(res.data);
      });
    }
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`${baseUrl}/${id}`, formData);
        setSnackbarMessage("Inventory item updated successfully!");
      } else {
        console.log("post called");
        await axios.post(baseUrl, formData);
        setSnackbarMessage("Inventory item added successfully!");
      }
      setSnackbarSeverity("success");
      setFormData({ componentName: "", specification: "", quantity: "" });
      setTimeout(() => navigate("/inventory"), 1000); // Redirect after success
    } catch (error) {
      setSnackbarMessage("Error submitting form. Try again!");
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
  };

  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Card elevation={3} sx={{ padding: 3, maxWidth: 500 }}>
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
              {id ? " 🏷️ Edit Inventory Entry" : "🏷️ Inventory Entry"}
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Component Name"
                name="componentName"
                value={formData.componentName}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Specification"
                name="specification"
                value={formData.specification}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                margin="normal"
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#043c5a",
                  color: "#fff",
                  fontWeight: "bold",
                  padding: "12px",
                  borderRadius: "5px",
                  fontSize: "16px",
                  marginTop: "16px",
                  boxShadow: "0px 4px 15px rgba(31, 13, 94, 0.4)",
                  "&:hover": { backgroundColor: "#03283d" },
                }}
              >
                {id ? "🚀 Update" : "🚀 Submit"}
              </Button>
              <Button
                variant="outlined"
                color="black"
                fullWidth
                sx={{ mt: 3, fontSize: "12px" }}
                onClick={() => navigate("/inventory_records")}
              >
                Back to Inventory List
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>

      {/* Snackbar for messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default InventoryForm;
