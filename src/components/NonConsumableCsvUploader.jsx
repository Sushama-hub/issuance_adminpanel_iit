import React, { useRef, useState } from "react";
import Papa from "papaparse";
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import { apiRequest } from "../utils/api";

const NonConsumableCsvUploader = ({ yearData, fetchYearData }) => {
  const [csvData, setCsvData] = useState([]);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setIsFileSelected(true);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          // console.log("Parsed Results: ", results?.data)
          setCsvData(results?.data);
        },
      });
    }
  };

  const handleUploadFile = async () => {
    if (!csvData.length) return;
    try {
      const response = await apiRequest.post("/nonConsumableStock/upload-csv", {
        csvData,
        selectedYear,
      });

      if (response?.data?.success) {
        showSuccessToast(
          response?.data?.message || "Data uploaded successfully!"
        );

        fetchYearData();
        setCsvData([]);
        setSelectedYear("");
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
    const sampleData = [
      [
        "ledgerNo",
        "poRefNoDate",
        "receivedFrom",
        "itemDescription",
        "groundBalance",
        "ledgerBalance",
        "qtyUnit",
        "fundingHead",
        "projectCode",
        "amountInclGST",
        "location",
        "qty",
        "rate",
        "value",
        "capitalizedFinancialYear",
        "remarksStockAuthority",
        "remarksHODHOC",
        "caOrder",
        "assetCode",
        "finalSupplyDate",
        "assetHead",
        "billInvoiceNoDate",
      ],
      [
        "1234",
        "PO/456/2024",
        "ABC Supplier",
        "Oscilloscope",
        "10",
        "10",
        "pcs",
        "Grant A",
        "PJT001",
        "45000",
        "Lab A",
        "5",
        "9000",
        "45000",
        "2024-2025",
        "Initial stock",
        "Approved",
        "CA1234",
        "OSC123",
        "2025-01-10T00:00:00.000",
        "Electronics",
        "INV/789/2024",
      ],
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      sampleData.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "non_consumable_sample_format.csv");
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
        📂 Bulk Upload via CSV
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={2} align="center">
        Note: Only <strong>CSV files</strong> are allowed. Download the sample
        file to see the format.
      </Typography>

      <Box mb={2} sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Autocomplete
          disablePortal
          size="small"
          options={yearData.map((item) => item?.year)}
          value={selectedYear}
          onChange={(event, newValue) => {
            // console.log("Selected Year:", newValue);
            setSelectedYear(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Add Year Data" required />
          )}
          sx={{ width: 250 }}
          disabled={yearData.length === 0}
        />
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
          disabled={!selectedYear}
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

export default NonConsumableCsvUploader;
