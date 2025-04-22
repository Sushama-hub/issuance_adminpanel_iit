import React, { useRef, useState } from "react"
import Papa from "papaparse"
import axios from "axios"
import { Alert, Box, Button, Snackbar, Typography } from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import FileDownloadIcon from "@mui/icons-material/FileDownload"

const CsvUploader = () => {
  const [csvData, setCsvData] = useState([])
  const [isFileSelected, setIsFileSelected] = useState(false)
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    severity: "success", // can be "success", "error", "warning", "info"
  })

  const fileInputRef = useRef(null)

  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL

  const handleFileChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      setIsFileSelected(true)
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          // console.log("Parsed Results: ", results?.data)
          setCsvData(results?.data)
        },
      })
    }
  }

  const handleUploadFile = async () => {
    if (!csvData.length) return
    try {
      const response = await axios.post(
        `${baseURL}/inventory/csv`,
        { csvData },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      if (response?.data?.success) {
        setSnackbarData({
          open: true,
          // message: "Data uploaded successfully!",
          message: response?.data?.message,
          severity: "success",
        })
        setCsvData([])
        setIsFileSelected(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = null // clear file input
        }
      }
    } catch (error) {
      console.error("Error uploading data:", error)
      // alert("Failed to upload data.");
      setSnackbarData({
        open: true,
        message: " Error File Uploading. Please try again!",
        severity: "error",
      })
    }
  }
  const handleDownloadSample = () => {
    const sampleData = [
      ["components", "specification", "quantity"],
      ["Resistor", "10kΩ", "5"],
      ["Capacitor", "100μF", "3"],
    ]
    const csvContent =
      "data:text/csv;charset=utf-8," +
      sampleData.map((e) => e.join(",")).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "sample_inventory_format.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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
        Note: Only <strong>CSV files</strong> are allowed. Download the sample
        file to see the format.
      </Typography>

      <Box mb={2} sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={handleDownloadSample}
        >
          Download Sample CSV
        </Button>
      </Box>

      <Box mb={0} sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
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
  )
}

export default CsvUploader
