import { useEffect, useState } from "react";
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
  Autocomplete,
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
  const [componentsList, setComponentsList] = useState([]); // Component names + specifications
  const [specificationsList, setSpecificationsList] = useState([]); // Specifications for selected component
  const [availableQuantity, setAvailableQuantity] = useState(0); // Quantity of selected specification
  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await axios.get(`${baseURL}/inventory/components`);
        if (response?.data?.success) {
          setComponentsList(response.data.components);
        }
      } catch (error) {
        console.error("Error fetching components:", error);
      }
    };
    fetchComponents();
  }, [baseURL]);

  // Handle component selection
  const handleComponentChange = (event, newValue) => {
    setFormData({
      ...formData,
      components: newValue,
      specification: "",
      quantity: "",
    });
    setAvailableQuantity(0);

    if (!newValue) {
      setSpecificationsList([]);
      return;
    }

    const selectedComponent = componentsList.find(
      (comp) => comp.componentName === newValue
    );

    if (selectedComponent) {
      setSpecificationsList(selectedComponent.specifications);
    } else {
      setSpecificationsList([]);
    }
  };

  // Handle specification selection and update available quantity
  const handleSpecificationChange = (event) => {
    const selectedSpec = event.target.value;
    setFormData({ ...formData, specification: selectedSpec, quantity: "" });

    const specData = specificationsList.find(
      (spec) => spec.specification === selectedSpec
    );
    setAvailableQuantity(specData ? specData.quantity : 0);
  };

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
        console.log("✅ Form submitted successfully, updating inventory...");
        // Inventory quantity update request
        try {
          await axios.put(
            `${baseURL}/inventory/update-quantity`,
            {
              componentName:
                typeof formData.components === "object"
                  ? formData.components.value
                  : formData.components,
              specification: formData.specification,
              quantity: -Number(formData.quantity), // Reduce the quantity
            },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          // console.log("🔹 Inventory Update Response:", inventoryResponse.data);
        } catch (inventoryError) {
          console.error("❌ Error updating inventory:", inventoryError);
          alert("Error updating inventory! Please check logs.");
        }

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
          setAvailableQuantity(0);
        }, 1500);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const response = await axios.post(`${baseURL}/user/submit`, formData, {
  //       headers: { "Content-Type": "application/json" },
  //       withCredentials: true,
  //     });

  //     if (response?.data?.success) {
  //       setTimeout(() => {
  //         setSubmitted(true);
  //         setLoading(false);
  //         setFormData({
  //           email: "",
  //           batch: "",
  //           category: "",
  //           idNumber: "",
  //           name: "",
  //           branch: "",
  //           mobile: "",
  //           components: "",
  //           specification: "",
  //           quantity: "",
  //           status: "Issued",
  //           remark: "",
  //         });
  //         setAvailableQuantity(0);
  //       }, 1500);
  //     }
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     alert("Something went wrong. Please try again.");
  //     setLoading(false);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   if (!formData.components) {
  //     alert("Please select a component.");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     // Submit form data to backend
  //     const response = await axios.post(`${baseURL}/user/submit`, formData, {
  //       headers: { "Content-Type": "application/json" },
  //       withCredentials: true,
  //     });

  //     if (response?.data?.success) {
  //       console.log(
  //         "✅ Form submitted successfully, now updating inventory..."
  //       );

  //       // Inventory quantity update request
  //       try {
  //         const inventoryResponse = await axios.put(
  //           `${baseURL}/inventory/update-quantity`,
  //           {
  //             componentName:
  //               typeof formData.components === "object"
  //                 ? formData.components.value
  //                 : formData.components,
  //             specification: formData.specification,
  //             quantity: -Number(formData.quantity), // Reduce the quantity
  //           },
  //           {
  //             headers: { "Content-Type": "application/json" },
  //             withCredentials: true,
  //           }
  //         );

  //         console.log("🔹 Inventory Update Response:", inventoryResponse.data);

  //         if (inventoryResponse?.data?.success) {
  //           setTimeout(() => {
  //             setSubmitted(true);
  //             setLoading(false);
  //             setFormData({
  //               email: "",
  //               batch: "",
  //               category: "",
  //               idNumber: "",
  //               name: "",
  //               branch: "",
  //               mobile: "",
  //               components: "",
  //               specification: "",
  //               quantity: "",
  //               status: "Issued",
  //               remark: "",
  //             });
  //             setAvailableQuantity(0);
  //           }, 1500);
  //         } else {
  //           console.error(
  //             "❌ Inventory update failed:",
  //             inventoryResponse.data
  //           );
  //           alert(
  //             inventoryResponse.data.message ||
  //               "Error updating inventory quantity!"
  //           );
  //         }
  //       } catch (inventoryError) {
  //         console.error("❌ Error updating inventory:", inventoryError);
  //         alert("Error updating inventory! Please check logs.");
  //       }
  //     } else {
  //       console.error("❌ Error submitting form:", response.data);
  //       alert(response.data.message || "Error submitting form!");
  //     }
  //   } catch (error) {
  //     console.error("❌ API Error:", error);
  //     alert("Something went wrong. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
                  // { label: "Components", name: "components" },
                  // { label: "Specification", name: "specification" },
                  // { label: "Quantity", name: "quantity" },
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
                {/* Components Dropdown */}
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    freeSolo
                    options={componentsList.map((comp) => comp.componentName)}
                    value={formData.components}
                    onInputChange={handleComponentChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Components"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                {/* Specification Dropdown */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Specification</InputLabel>
                    <Select
                      name="specification"
                      value={formData.specification}
                      onChange={handleSpecificationChange}
                      disabled={specificationsList.length === 0}
                    >
                      {specificationsList.map((spec, index) => (
                        <MenuItem key={index} value={spec.specification}>
                          {spec.specification}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* Quantity show */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    required
                  />
                  {formData.specification && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                      Available Quantity: {availableQuantity}
                    </Typography>
                  )}
                </Grid>

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
