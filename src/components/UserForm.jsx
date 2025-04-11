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
  IconButton,
  Box,
  Autocomplete,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import axios from "axios";
import GoogleLoginButton from "./GoogleLoginButton";
import { auth, signInWithGoogle } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const BATCH_YEARS = ["2022", "2023", "2024", "2025"];
const CATEGORIES = [
  { label: "B.Tech", value: "btech" },
  { label: "M.Tech", value: "mtech" },
  { label: "PhD", value: "phd" },
  { label: "Project Staff", value: "project-staff" },
];

export default function IssuanceForm() {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    batch: "",
    category: "",
    idNumber: "",
    name: "",
    branch: "",
    mobile: "",
    components: [{ componentName: "", specification: "", quantity: "" }],
    // components: "",
    // specification: "",
    // quantity: "",
    status: "Issued",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [componentsList, setComponentsList] = useState([]);
  const [availableQuantities, setAvailableQuantities] = useState([]);
  const [quantityErrors, setQuantityErrors] = useState({});
  const [user, setUser] = useState(null);
  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

  // Track login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        setUserName(user.displayName);
        setFormData((prev) => ({
          ...prev,
          email: user.email,
          name: user.displayName,
        }));
        setIsLoggedIn(true);
      } else {
        setUserEmail("");
        setUserName("");
        setFormData({
          email: "",
          batch: "",
          category: "",
          idNumber: "",
          name: "",
          branch: "",
          mobile: "",
          components: [{ componentName: "", specification: "", quantity: "" }],
          status: "Issued",
        });
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleLogout = async () => {
    // await signOut(auth);
    try {
      await signOut(auth);
      setUser(null);
      setUserEmail("");
      setUserName("");
      setIsLoggedIn(null); // or false if you're using boolean
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };
  // ..............
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
  const handleComponentChange = (index, event, newValue) => {
    let updatedComponents = [...formData.components];
    updatedComponents[index] = {
      ...updatedComponents[index],
      componentName: newValue,
      specification: "",
      quantity: "",
    };
    setFormData({ ...formData, components: updatedComponents });

    const selectedComponent = componentsList.find(
      (comp) => comp.componentName === newValue
    );

    if (selectedComponent) {
      let updatedQuantities = [...availableQuantities];
      updatedQuantities[index] = selectedComponent.specifications;
      setAvailableQuantities(updatedQuantities);
    }
  };

  // Handle specification selection
  const handleSpecificationChange = (index, event) => {
    let updatedComponents = [...formData.components];
    updatedComponents[index] = {
      ...updatedComponents[index],
      specification: event.target.value,
      quantity: "",
    };
    setFormData({ ...formData, components: updatedComponents });
  };

  // Handle adding more component fields
  const handleAddComponent = () => {
    setFormData({
      ...formData,
      components: [
        ...formData.components,
        { componentName: "", specification: "", quantity: "" },
      ],
    });
    setAvailableQuantities([...availableQuantities, []]);
  };

  // Handle removing a component entry
  const handleRemoveComponent = (index) => {
    let updatedComponents = [...formData.components];
    updatedComponents.splice(index, 1);
    setFormData({ ...formData, components: updatedComponents });

    let updatedQuantities = [...availableQuantities];
    updatedQuantities.splice(index, 1);
    setAvailableQuantities(updatedQuantities);
  };

  // Handle input change
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

  const handleQuantityChange = (index, e) => {
    let updatedComponents = [...formData.components];
    let value = Number(e.target.value);

    // Get available quantity for selected specification
    let availableQty =
      availableQuantities[index]?.find(
        (spec) => spec.specification === updatedComponents[index].specification
      )?.quantity || 0;

    // Check if entered quantity exceeds available stock
    if (value > availableQty) {
      setQuantityErrors((prevErrors) => ({
        ...prevErrors,
        [index]: `Only ${availableQty} available!`,
      }));
    } else {
      setQuantityErrors((prevErrors) => {
        let newErrors = { ...prevErrors };
        delete newErrors[index]; // Remove error if quantity is valid
        return newErrors;
      });
    }

    updatedComponents[index].quantity = e.target.value;
    setFormData({ ...formData, components: updatedComponents });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any quantity error exists
    if (Object.keys(quantityErrors).length > 0) {
      alert("Please fix the quantity errors before submitting.");
      return;
    }

    setLoading(true);

    console.log(" Submitting form data:", formData); // Debugging Log

    try {
      const response = await axios.post(`${baseURL}/user/submit`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response?.data?.success) {
        console.log("Form submitted successfully!");

        if (
          !Array.isArray(formData.components) ||
          formData.components.length === 0
        ) {
          console.error(" No components found in formData!");
          alert("Please select at least one component.");
          setLoading(false);
          return;
        }

        // Creating inventory update data
        const inventoryUpdateData = formData.components.map((comp) => ({
          componentName: comp.componentName,
          specification: comp.specification,
          quantity: -Number(comp.quantity),
        }));

        console.log(" Updating inventory with:", inventoryUpdateData);

        try {
          await axios.put(
            `${baseURL}/inventory/update-quantity`,
            inventoryUpdateData,
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          console.log("Inventory updated successfully!");
        } catch (inventoryError) {
          console.error("Inventory update error:", inventoryError);
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
            components: [
              { componentName: "", specification: "", quantity: "" },
            ],
            status: "Issued",
          });
          setAvailableQuantities(0);

          // Sign out user from Firebase
          signOut(auth)
            .then(() => {
              console.log("👋 User logged out after submission.");
            })
            .catch((error) => {
              console.error("Logout failed:", error);
            });
        }, 1500);
      }
    } catch (error) {
      console.error(" Error submitting form:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const isDisabled = !isLoggedIn;

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
                Submission Successful!
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

            {!isLoggedIn ? (
              <Box textAlign="center" mb={4}>
                <GoogleLoginButton
                  onSuccess={async (loggedUser) => {
                    const email = loggedUser.email;

                    if (email.endsWith("@iitbhilai.ac.in")) {
                      setUser(loggedUser);
                      setIsLoggedIn(loggedUser);
                      setUserName(loggedUser.displayName);
                      setUserEmail(loggedUser.email);
                    } else {
                      alert("Only IIT Bhilai emails allowed!");
                      await signOut(auth); // logs out user immediately
                    }
                  }}
                />

                <Typography
                  variant="h6"
                  mb={2}
                  align="center"
                  sx={{ fontSize: "0.8rem" }}
                >
                  Please login with your IIT Bhilai email to continue
                </Typography>
              </Box>
            ) : (
              <Box textAlign="center">
                <Typography variant="h6">
                  Welcome, {userName || "Guest"}!
                </Typography>
                <p className="mb-2">
                  Logged in as: <strong>{userEmail}</strong>
                </p>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{ mt: 2 }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            )}

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
                    disabled
                    error={!!emailError}
                    helperText={emailError}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel disabled={!isLoggedIn}>
                      Batch (Year of Joining)
                    </InputLabel>
                    <Select
                      label="Batch (Year of Joining)"
                      name="batch"
                      value={formData.batch}
                      onChange={handleChange}
                      disabled={!isLoggedIn}
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
                    <InputLabel disabled={!isLoggedIn}>Category</InputLabel>
                    <Select
                      label="Category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      disabled={!isLoggedIn}
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
                      // disabled={name === "name"}
                      disabled={!isLoggedIn || name === "name"}
                    />
                  </Grid>
                ))}

                {/* Components Selection */}
                {formData.components.map((comp, index) => (
                  <Grid
                    container
                    spacing={2}
                    key={index}
                    alignItems="center"
                    margin="1px"
                  >
                    <Grid item xs={4}>
                      <Autocomplete
                        freeSolo
                        options={componentsList.map(
                          (comp) => comp.componentName
                        )}
                        value={comp.componentName}
                        onInputChange={(event, newValue) =>
                          handleComponentChange(index, event, newValue)
                        }
                        disabled={!isLoggedIn}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Component Name"
                            required
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <FormControl fullWidth required>
                        <InputLabel disabled={!isLoggedIn}>
                          Specification
                        </InputLabel>
                        <Select
                          disabled={!isLoggedIn}
                          name="specification"
                          value={comp.specification}
                          onChange={(e) => handleSpecificationChange(index, e)}
                        >
                          {(availableQuantities[index] || []).map(
                            (spec, specIndex) => (
                              <MenuItem
                                key={specIndex}
                                value={spec.specification}
                              >
                                {spec.specification}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        label="Quantity"
                        name="quantity"
                        type="number"
                        value={comp.quantity}
                        onChange={(e) => handleQuantityChange(index, e)}
                        disabled={!isLoggedIn}
                        required
                        error={!!quantityErrors[index]} // Show error if exists
                        helperText={quantityErrors[index] || ""} // Show error message
                      />

                      {comp.specification && availableQuantities[index] && (
                        <Typography
                          color="error"
                          variant="body3"
                          size="0.2rem"
                          sx={{
                            mt: 2,
                          }}
                        >
                          Available Quantity:{" "}
                          {availableQuantities[index].find(
                            (spec) => spec.specification === comp.specification
                          )?.quantity || "N/A"}
                        </Typography>
                      )}
                    </Grid>

                    <Grid
                      item
                      xs={2}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      {index === 0 ? (
                        <IconButton
                          color="primary"
                          onClick={handleAddComponent}
                        >
                          <AddCircle fontSize="large" />
                        </IconButton>
                      ) : (
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveComponent(index)}
                        >
                          <RemoveCircle fontSize="large" />
                        </IconButton>
                      )}
                    </Grid>
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
