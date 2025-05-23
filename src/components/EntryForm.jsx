import React from "react";
import CsvUploader from "./CsvUploader";
import { Box, Card } from "@mui/material";
import { entrySampleData } from "../config/sampleDataConfig";

const EntryForm = () => {
  return (
    <>
      <Box
        sx={{
          minHeight: "85vh",
          width: "100%",
          backgroundColor: "#f4f4f4",
          padding: "40px 20px",
          mt: 1.5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          elevation={20}
          sx={{
            borderRadius: "15px 5px",
            padding: "30px",
            height: "auto",
            width: "100%",
            maxWidth: "800px",
          }}
        >
          <CsvUploader
            uploadEndpoint="/user/userForm-csv"
            sampleData={entrySampleData}
            title="📂 Upload Entry details via CSV"
          />
        </Card>
      </Box>
    </>
  );
};

export default EntryForm;
