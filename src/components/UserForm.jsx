import { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Box,
} from "@mui/material";
import axios from "axios";

const BATCH_YEARS = ["2022", "2023", "2024", "2025"];
const CATEGORIES = [
  { label: "B.Tech", value: "btech" },
  { label: "M.Tech", value: "mtech" },
  { label: "PhD", value: "phd" },
  { label: "Project Staff", value: "project-staff" },
];

export default function IssuanceForm() {
  const [formData, setFormData] = useState({
    email: "",
    batch: "",
    category: "",
    idNumber: "",
    name: "",
    branch: "",
    mobile: "",
    components: "",
    specification: "",
    quantity: "",
    status: "Issued",
    remark: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@iitbhilai\.ac\.in$/;
      if (!emailPattern.test(value)) {
        setEmailError(
          "Only IIT Bhilai emails are allowed (e.g., user@iitbhilai.ac.in)"
        );
      } else {
        setEmailError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}/user/submit`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response?.data?.success) {
        setTimeout(() => {
          setSubmitted(true);
          setLoading(false);
          setFormData({
            email: "",
            batch: "",
            category: "",
            idNumber: "",
            name: "",
            branch: "",
            mobile: "",
            components: "",
            specification: "",
            quantity: "",
            status: "Issued",
            remark: "",
          });
        }, 1500);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      {submitted ? (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
          <Card
            sx={{
              p: 4,
              textAlign: "center",
              backgroundColor: "#DFF2BF",
              borderRadius: 2,
              borderLeft: "6px solid green",
              borderRight: "6px solid green",
            }}
          >
            <CardContent>
              <Typography variant="h5" fontWeight="bold" color="success">
                🎉 Submission Successful!
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Your form has been successfully submitted.
              </Typography>
              <Button
                variant="contained"
                onClick={() => setSubmitted(false)}
                sx={{ mt: 3, backgroundColor: "#043c5a" }}
              >
                Submit Another
              </Button>
            </CardContent>
          </Card>
        </Container>
      ) : (
        <Container maxWidth="md" sx={{ my: 5 }}>
          <Paper
            elevation={3}
            sx={{
              // p: 4,
              // borderTop: "8px solid #1E40AF",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
              sx={{
                backgroundColor: "#604CC3",
                color: "white",
                p: 3,
                borderRadius: "10px 10px 0px 0px",
                textAlign: "center",
              }}
            >
              Electrical Engineering Department Issuance Record Form
            </Typography>
            <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    error={!!emailError}
                    helperText={emailError}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Batch (Year of Joining)</InputLabel>
                    <Select
                      label="Batch (Year of Joining)"
                      name="batch"
                      value={formData.batch}
                      onChange={handleChange}
                    >
                      {BATCH_YEARS.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      label="Category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      {CATEGORIES.map(({ label, value }) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {[
                  { label: "ID Number", name: "idNumber" },
                  { label: "Name", name: "name" },
                  { label: "Branch", name: "branch" },
                  { label: "Mobile Number", name: "mobile", type: "tel" },
                  { label: "Components", name: "components" },
                  { label: "Specification", name: "specification" },
                  { label: "Quantity", name: "quantity" },
                  { label: "Remark", name: "remark" },
                ].map(({ label, name, type }, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <TextField
                      fullWidth
                      label={label}
                      name={name}
                      type={type || "text"}
                      value={formData[name]}
                      onChange={handleChange}
                      required={name !== "remark"}
                    />
                  </Grid>
                ))}

                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                >
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      backgroundColor: loading ? "#B0BEC5" : "#604CC3",
                      width: { xs: "100%", md: "20%" },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      )}
    </>
  );
}
