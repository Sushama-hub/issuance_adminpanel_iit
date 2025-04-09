// import React, { useState } from "react";
// import Papa from "papaparse";
// import axios from "axios"; // for API call
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Divider,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// const CsvUploader = () => {
//   const [csvData, setCsvData] = useState([]);
//   const [isFileSelected, setIsFileSelected] = useState(false);

//   const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];

//     if (file) {
//       setIsFileSelected(true);
//       Papa.parse(file, {
//         header: true, // Treat the first row as header
//         skipEmptyLines: true,
//         complete: function (results) {
//           console.log("Parsed Results: ", results.data);
//           setCsvData(results.data);

//           // Optionally call the function to send data to your backend
//           // handleUploadFile(results.data);
//         },
//       });
//     }
//   };

//   // const handleUploadFile = async (data) => {
//   const handleUploadFile = async () => {
//     console.log("handleUploadFile called", csvData);
//     if (!csvData.length) return;

//     try {
//       const response = await axios.post(
//         `${baseURL}/inventory/csv`,
//         { csvData },
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );
//       console.log("Upload successful", response.data);
//       alert("Data uploaded successfully!");
//       setCsvData([]);
//       setIsFileSelected(false);
//       console.log("csvData", csvData);
//     } catch (error) {
//       console.error("Error uploading data:", error);
//       alert("Failed to upload data.");
//     }
//   };

//   return (
//     <Box sx={{ padding: 2 }}>
//       <Typography
//         variant="h5"
//         color="primary"
//         fontWeight="bold"
//         mb={2}
//         align="center"
//         sx={{
//           color: "#075985",
//           marginBottom: 4,
//           textTransform: "uppercase",
//           letterSpacing: "1px",
//         }}
//       >
//         📂 Bulk Upload via CSV
//       </Typography>
//       <Typography variant="body2" color="textSecondary" mb={2} align="center">
//         Note: Only <strong>CSV files</strong> are allowed.
//       </Typography>

//       <Box mb={0} sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
//         <input
//           type="file"
//           accept=".csv"
//           // hidden
//           onChange={handleFileChange}
//           style={{
//             border: "1px solid #ccc",
//             padding: "8px 12px",
//             borderRadius: "6px",
//             outline: "none",
//             width: "250px",
//             cursor: "pointer",
//             fontSize: "14px",
//             transition: "border-color 0.3s",
//           }}
//           onFocus={(e) => (e.target.style.borderColor = "#1976d2")}
//           onBlur={(e) => (e.target.style.borderColor = "#ccc")}
//         />
//         <Button
//           variant="contained"
//           startIcon={<CloudUploadIcon />}
//           onClick={handleUploadFile}
//           disabled={!isFileSelected}
//         >
//           Upload files
//         </Button>
//       </Box>
//       {/* {csvData.length > 0 && (
//         <>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" mb={2}>
//                 Current Uploaded Data:
//               </Typography>
//               <Divider />
//               <TableContainer component={Paper}>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Component</TableCell>
//                       <TableCell>Specification</TableCell>
//                       <TableCell>Quantity</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {csvData.map((item, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{item.components}</TableCell>
//                         <TableCell>{item.specification}</TableCell>
//                         <TableCell>{item.quantity}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </CardContent>
//           </Card>
//         </>
//       )} */}
//     </Box>
//   );
// };

// export default CsvUploader;

import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const CsvUploader = () => {
  const [csvData, setCsvData] = useState([]);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setIsFileSelected(true);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          console.log("Parsed Results: ", results.data);
          setCsvData(results.data);
        },
      });
    }
  };

  const handleUploadFile = async () => {
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
      console.log("Upload successful", response.data);
      alert("Data uploaded successfully!");
      setCsvData([]);
      setIsFileSelected(false);
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("Failed to upload data.");
    }
  };

  const handleDownloadSample = () => {
    const sampleData = [
      ["components", "specification", "quantity"],
      ["Resistor", "10kΩ", "5"],
      ["Capacitor", "100μF", "3"],
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      sampleData.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample_inventory_format.csv");
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
