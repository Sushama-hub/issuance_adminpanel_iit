import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios"; // for API call
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const CsvUploader = () => {
  const [csvData, setCsvData] = useState([]);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    severity: "success", // can be "success", "error", "warning", "info"
  });

  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setIsFileSelected(true);
      Papa.parse(file, {
        header: true, // Treat the first row as header
        skipEmptyLines: true,
        complete: function (results) {
          console.log("Parsed Results: ", results.data);
          setCsvData(results.data);

          // Optionally call the function to send data to your backend
          // handleUploadFile(results.data);
        },
      });
    }
  };

  // const handleUploadFile = async (data) => {
  const handleUploadFile = async () => {
    console.log("handleUploadFile called", csvData);
    if (!csvData.length) return;

    try {
      const response = await axios.post(
        `${baseURL}/inventory/csv`,
        { csvData },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("Upload successful", response.data.success);
      if (response?.data?.success === true) {
        setSnackbarData({
          open: true,
          message: "✅ File Upload submitted successfully!",
          severity: "success",
        });
        // alert("Data uploaded successfully!");
        setCsvData([]);
        setIsFileSelected(false);
      }
      console.log("csvData", csvData);
    } catch (error) {
      console.error("Error uploading data:", error);
      // alert("Failed to upload data.");
      setSnackbarData({
        open: true,
        message: "❌ Error File Uploading. Please try again!",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        variant="h5"
        color="primary"
        fontWeight="bold"
        mb={2}
        align="center"
        sx={{
          color: "#075985",
          marginBottom: 4,
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        📂 Bulk Upload via CSV
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={2} align="center">
        Note: Only <strong>CSV files</strong> are allowed.
      </Typography>

      <Box mb={0} sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <input
          type="file"
          accept=".csv"
          // hidden
          onChange={handleFileChange}
          style={{
            border: "1px solid #ccc",
            padding: "8px 12px",
            borderRadius: "6px",
            outline: "none",
            width: "250px",
            cursor: "pointer",
            fontSize: "14px",
            transition: "border-color 0.3s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#1976d2")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={handleUploadFile}
          disabled={!isFileSelected}
        >
          Upload files
        </Button>
      </Box>
      {/* {csvData.length > 0 && (
        <>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Current Uploaded Data:
              </Typography>
              <Divider />
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Component</TableCell>
                      <TableCell>Specification</TableCell>
                      <TableCell>Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {csvData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.components}</TableCell>
                        <TableCell>{item.specification}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )} */}

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

export default CsvUploader;
