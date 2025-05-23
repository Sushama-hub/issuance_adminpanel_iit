import React, { useRef, useState } from "react";
import Papa from "papaparse";
import { Box, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import { apiRequest } from "../utils/api";

const CsvUploader = ({ uploadEndpoint, sampleData, title }) => {
  const [csvData, setCsvData] = useState([]);
  const [isFileSelected, setIsFileSelected] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setIsFileSelected(true);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          // console.log("Parsed Results: ", results?.data);
          setCsvData(results?.data);
        },
      });
    }
  };

  const handleUploadFile = async () => {
    if (!csvData.length) return;
    try {
      const response = await apiRequest.post(uploadEndpoint, { csvData });

      if (response?.data?.success) {
        showSuccessToast(
          response?.data?.message || "Data uploaded successfully!"
        );
        setCsvData([]);
        setIsFileSelected(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = null; // clear file input
        }
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      showErrorToast(" Error File Uploading. Please try again!");
    }
  };

  const handleDownloadSample = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      sampleData.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample_format.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        {/* 📂 Bulk Upload via CSV */}
        {title}
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
    </Box>
  );
};

export default CsvUploader;
