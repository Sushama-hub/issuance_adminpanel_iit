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
} from "@mui/material";
import axios from "axios";

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
      console.log("email validation");
      // Regex to allow only emails ending with '@iitbhilai.ac.in'
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
      console.log(response?.data);

      if (response?.data?.success === true) {
        setTimeout(() => {
          setSubmitted(true);
          setLoading(false);
          setFormData({
            ...formData,
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
      setLoading(false); // Stop loading on error
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
              // backgroundColor: "#E6F4EA",
              backgroundColor: "#DFF2BF",
              borderRadius: 2,
              borderLeft: "6px solid green",
              borderRight: "6px solid green",
              // borderLeft: "6px solid #1E40AF",
              // borderRight: "6px solid #1E40AF",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="success"
                // sx={{ color: "#043c5a" }}
              >
                🎉 Submission Successful!
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Your form has been successfully submitted.
              </Typography>
              <Button
                variant="contained"
                onClick={() => setSubmitted(false)} // Reset form view
                sx={{ mt: 3, backgroundColor: "#043c5a" }}
              >
                Submit Another
              </Button>
            </CardContent>
          </Card>
        </Container>
      ) : (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
          <Paper
            elevation={3}
            sx={{ p: 4, borderTop: "8px solid #1E40AF", borderRadius: 2 }}
          >
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Electrical Engineering Department Issuance Record Form
            </Typography>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                error={!!emailError} // Show error state if email is invalid
                helperText={emailError} // Display error message
              />
              <FormControl fullWidth required>
                <InputLabel>Batch (Year of Joining)</InputLabel>
                <Select
                  label="Batch (Year of Joining)"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                >
                  <MenuItem value="">Choose</MenuItem>
                  <MenuItem value="2023">2022</MenuItem>
                  <MenuItem value="2023">2023</MenuItem>
                  <MenuItem value="2023">2024</MenuItem>
                  <MenuItem value="2022">2025</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <MenuItem value="">Choose</MenuItem>
                  <MenuItem value="btech">B.Tech</MenuItem>
                  <MenuItem value="mtech">M. Tech</MenuItem>
                  <MenuItem value="phd">PHD</MenuItem>
                  <MenuItem value="project-staff">project Staff</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="ID Number"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Components"
                name="components"
                value={formData.components}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="specification"
                name="specification"
                value={formData.specification}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                sx={{ display: "none" }}
              />
              <TextField
                fullWidth
                label="Remark"
                name="remark"
                value={formData.remark}
                onChange={handleChange}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                // color="primary"
                disabled={loading}
                sx={{
                  boxShadow: "0px 4px 15px rgba(31, 13, 94, 0.4)",
                  backgroundColor: loading ? "#B0BEC5" : "#043c5a",
                  "&:hover": {
                    backgroundColor: loading ? "#B0BEC5" : "#03283d",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Paper>
        </Container>
      )}
    </>
  );
}
