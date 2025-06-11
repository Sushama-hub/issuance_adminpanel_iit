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
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import GoogleLoginButton from "./GoogleLoginButton";
import { initializeFirebase, firebaseSignOut, onAuthChange } from "../firebase";
import {
  BATCH_YEARS,
  CATEGORIES,
  IIT_BRANCHES,
  LAB_NUMBERS,
  STAFFS,
} from "../config/userformConfig";
import { showErrorToast, showWarningToast } from "../utils/toastUtils";
import BannerImg from "../assets/images/banner.jpg";
import { apiRequest } from "../utils/api";

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
    components: [
      { componentName: "", specification: "", quantity: "", status: "Issued" },
    ],
    status: "Issued",
    labNumber: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [componentsList, setComponentsList] = useState([]);
  const [availableQuantities, setAvailableQuantities] = useState([]);
  const [quantityErrors, setQuantityErrors] = useState({});
  const [user, setUser] = useState(null);
  const [otherLabNumber, setOtherLabNumber] = useState("");

  useEffect(() => {
    let unsubscribe;
    const init = async () => {
      await initializeFirebase();
      unsubscribe = onAuthChange((user) => {
        if (user) {
          setUser(user);
          setUserEmail(user.email);
          setUserName(user.displayName);
          setFormData((prev) => ({
            ...prev,
            email: user.email,
            name: user.displayName,
          }));
          setIsLoggedIn(true);
        } else {
          setUser(null);
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
            components: [
              {
                componentName: "",
                specification: "",
                quantity: "",
                status: "Issued",
              },
            ],
            status: "Issued",
          });
          setIsLoggedIn(false);
        }
      });
    };
    init();
    return () => unsubscribe && unsubscribe();
  }, []);

  // Called by GoogleLoginButton on successful popup login
  const handleGoogleSuccess = async (loggedUser) => {
    if (!loggedUser.email.endsWith("@iitbhilai.ac.in")) {
      showErrorToast("Only IIT Bhilai emails allowed!");
      await firebaseSignOut();
      return;
    }

    try {
      const token = await loggedUser.getIdToken();
      const res = await fetch(
        "http://localhost:5000/api/v1/firebase/firebase-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }
      );
      const data = await res.json();

      if (data.success) {
        setUser(loggedUser);
        setIsLoggedIn(true);
        setUserEmail(loggedUser.email);
        setUserName(loggedUser.displayName);
      } else {
        showErrorToast("Login failed: " + data.message);
        await firebaseSignOut();
      }
    } catch (err) {
      console.error("Login flow error:", err);
      showErrorToast("Something went wrong during login.");
    }
  };

  const handleLogout = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    try {
      await firebaseSignOut();
      // console.log(" Successfully signed out");
      // onAuthChange will reset formData & logged-in flags
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const fetchComponents = async () => {
    try {
      const response = await apiRequest.get("/inventory/components");

      if (response?.data?.success) {
        setComponentsList(response.data.components);
      }
    } catch (error) {
      console.error("Error fetching components:", error);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

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
      let updatedQuantities = [...(availableQuantities || [])];
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
        {
          componentName: "",
          specification: "",
          quantity: "",
          status: "Issued",
        },
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

    // Mobile number validation (10 digits, Indian format)
    if (name === "mobile") {
      const mobilePattern = /^[6-9]\d{9}$/;
      if (!mobilePattern.test(value)) {
        setMobileError("Enter a valid 10-digit Indian mobile number");
      } else {
        setMobileError("");
      }
    }

    if (name === "otherLabNumber") {
      setOtherLabNumber(value);
    }

    if (name !== "otherLabNumber") {
      setFormData({ ...formData, [name]: value });
    }
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
        delete newErrors[index];
        return newErrors;
      });
    }

    updatedComponents[index].quantity = e.target.value;
    setFormData({ ...formData, components: updatedComponents });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = {
      ...formData,
      labNumber:
        formData.labNumber === "other" ? otherLabNumber : formData.labNumber,
    };

    const mobilePattern = /^[6-9]\d{9}$/;
    let isValid = true;

    if (!mobilePattern.test(finalData.mobile)) {
      setMobileError("Please Enter a valid 10-digit Indian mobile number");
      isValid = false;
    } else {
      setMobileError("");
    }

    if (!isValid) {
      return; // stop form submission
    }

    // Check if any quantity error exists
    if (Object.keys(quantityErrors).length > 0) {
      showWarningToast("Please fix the quantity errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      const response = await apiRequest.post("/user/submit", finalData);

      if (response?.data?.success) {
        if (
          !Array.isArray(formData.components) ||
          formData.components.length === 0
        ) {
          console.error(" No components found in formData!");
          showWarningToast("Please select at least one component.");
          setLoading(false);
          return;
        }

        // Creating inventory update data
        const inventoryUpdateData = formData.components.map((comp) => ({
          componentName: comp.componentName,
          specification: comp.specification,
          quantity: -Number(comp.quantity),
        }));

        try {
          await apiRequest.put(
            "/inventory/update-quantity",
            inventoryUpdateData
          );
          // console.log("update inventory res,,,", response?.data);
        } catch (inventoryError) {
          console.error("Inventory update error:", inventoryError);
          showErrorToast("Error updating inventory! Please check logs.");
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
              {
                componentName: "",
                specification: "",
                quantity: "",
                status: "Issued",
              },
            ],
            status: "Issued",
          });
          setAvailableQuantities([]);
          fetchComponents();

          // Sign out user from Firebase
          firebaseSignOut()
            .then(() => {
              console.log(" User logged out after submission.");
            })
            .catch((error) => {
              console.error("Logout failed:", error);
            });
        }, 1500);
      }
    } catch (error) {
      console.error(" Error submitting form:", error);
      showErrorToast("Something went wrong. Please try again.");
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
        <Box
          sx={{
            backgroundColor: "#f0f4f8",
            width: "100%",
            minHeight: "100vh",
            py: 5,
          }}
        >
          <Container maxWidth="md" sx={{ my: 0 }}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: "10px",
                border: "2px solid #261FB3",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                mb={2}
                sx={{
                  // backgroundImage: "url('/src/assets/images/banner.jpg')",
                  backgroundImage: `url(${BannerImg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "white",
                  p: 3,
                  borderRadius: "10px 10px 0px 0px",
                  textAlign: "center",
                  textTransform: "uppercase",
                  lineHeight: 1.5,
                }}
              >
                Department Of Electrical Engineer <br /> Issuance Record Form
              </Typography>

              {!isLoggedIn ? (
                <Box textAlign="center" mb={4}>
                  <GoogleLoginButton onSuccess={handleGoogleSuccess} />

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
                  <Typography variant="h6" sx={{ color: "#261FB3" }}>
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
                  <Grid item xs={12} sm={6}>
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
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled
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
                    // { label: "Name", name: "name" },
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
                        error={name === "mobile" ? !!mobileError : ""}
                        helperText={name === "mobile" ? mobileError : ""}
                      />
                    </Grid>
                  ))}

                  <Grid item xs={6} sm={6}>
                    <Autocomplete
                      disablePortal
                      options={
                        formData.category === "staff" ? STAFFS : IIT_BRANCHES
                      }
                      getOptionLabel={(option) => option.label}
                      value={
                        formData.category === "staff"
                          ? STAFFS.find(
                              (branch) => branch.value === formData.branch
                            ) || null
                          : IIT_BRANCHES.find(
                              (branch) => branch.value === formData.branch
                            ) || null
                      }
                      onChange={(event, newValue) => {
                        setFormData((prev) => ({
                          ...prev,
                          branch: newValue ? newValue.value : "",
                        }));
                      }}
                      disabled={!isLoggedIn}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            formData.category === "staff"
                              ? "Staff Type"
                              : "Branch"
                          }
                          required
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel disabled={!isLoggedIn}>Lab Number</InputLabel>
                      <Select
                        label="Lab Number"
                        name="labNumber"
                        // value={formData.labNumber}
                        value={
                          formData.labNumber === "other"
                            ? "other"
                            : formData.labNumber
                        }
                        onChange={handleChange}
                        disabled={!isLoggedIn}
                      >
                        {LAB_NUMBERS.map(({ label, value }) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {formData?.labNumber === "other" && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="specify Other Lab Number"
                        name="otherLabNumber"
                        type="text"
                        value={otherLabNumber}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                  )}

                  {/* Components Selection */}
                  {formData.components.map((comp, index) => (
                    <Grid
                      container
                      spacing={2}
                      key={index}
                      alignItems="center"
                      margin="1px"
                    >
                      <Grid item xs={6} sm={6} md={3.6}>
                        <Autocomplete
                          disablePortal
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

                      <Grid item xs={6} sm={6} md={3.6}>
                        <FormControl fullWidth required disabled={!isLoggedIn}>
                          <InputLabel>Specification</InputLabel>
                          <Select
                            label="Specification"
                            name="specification"
                            value={comp.specification}
                            onChange={(e) =>
                              handleSpecificationChange(index, e)
                            }
                          >
                            {comp.componentName &&
                              (availableQuantities[index] || []).map(
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

                      <Grid item xs={6} sm={6} md={3.6}>
                        <TextField
                          fullWidth
                          label="Quantity"
                          name="quantity"
                          type="number"
                          value={comp.quantity}
                          onChange={(e) => handleQuantityChange(index, e)}
                          disabled={!isLoggedIn}
                          required
                          error={!!quantityErrors[index]}
                          helperText={quantityErrors[index] || ""}
                          InputProps={{
                            inputProps: { min: 1 },
                          }}
                        />
                      </Grid>

                      <Box
                        component="span"
                        sx={{
                          display: { xs: "flex", md: "none" },
                        }}
                      >
                        {comp.specification && availableQuantities[index] && (
                          <Typography
                            color="primary"
                            variant="caption"
                            display="block"
                            fontWeight="bold"
                            sx={{
                              ml: 1,
                              textAlign: "center",
                              width: "120px",
                            }}
                          >
                            Available Quantity:{" "}
                            {availableQuantities[index].find(
                              (spec) =>
                                spec.specification === comp.specification
                            )?.quantity || "N/A"}
                          </Typography>
                        )}
                      </Box>

                      <Grid item xs={1}>
                        {index === 0 ? (
                          <IconButton
                            onClick={handleAddComponent}
                            sx={{ color: "#261FB3" }}
                            disabled={
                              !isLoggedIn ||
                              !formData.components[0].componentName ||
                              !formData.components[0].specification ||
                              !formData.components[0].quantity
                            }
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

                      <Grid
                        item
                        xs={3.6}
                        sx={{
                          display: {
                            xs: "none",
                            sm: "flex",
                          },
                        }}
                      ></Grid>
                      <Grid
                        item
                        xs={3.6}
                        sx={{
                          display: {
                            xs: "none",
                            sm: "flex",
                          },
                        }}
                      ></Grid>
                      <Grid
                        item
                        xs={3.6}
                        sx={{
                          display: { xs: "none", sm: "flex" },
                        }}
                      >
                        {comp.specification && availableQuantities[index] && (
                          <Typography
                            color="primary"
                            variant="caption"
                            display="block"
                            fontWeight="bold"
                            sx={{ ml: 1, mt: -2 }}
                          >
                            Available Quantity:{" "}
                            {availableQuantities[index].find(
                              (spec) =>
                                spec.specification === comp.specification
                            )?.quantity || "N/A"}
                          </Typography>
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
                      disabled={!isLoggedIn || loading}
                      sx={{
                        backgroundColor: loading ? "#B0BEC5" : "#261FB3",
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
        </Box>
      )}
    </>
  );
}
