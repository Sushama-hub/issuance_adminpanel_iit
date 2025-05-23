import React from "react";
import CsvUploader from "./CsvUploader";
import { Box, Card } from "@mui/material";
import {
  issueSampleData,
  returnOrConsumedSampleData,
} from "../config/sampleDataConfig";
import { useLocation } from "react-router-dom";

const EntryForm = () => {
  const location = useLocation();
  const pathSegments = location?.pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];

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
            sampleData={
              lastSegment === "issue"
                ? issueSampleData
                : returnOrConsumedSampleData
            }
            title={
              lastSegment === "issue"
                ? "📂 Upload Issue details via CSV"
                : "📂 Upload Returned / Consumed details via CSV"
            }
          />
        </Card>
      </Box>
    </>
  );
};

export default EntryForm;
