import React from "react";
import AdminApprovalList from "./AdminApprovalList";
import { Box } from "@mui/material";
import ApprovedAdminTable from "./ApprovedAdminTable";

export default function AdminDetails() {
  return (
    <Box
      sx={{
        minHeight: "85vh",
        width: "100%",
        backgroundColor: "#f4f4f4",
        padding: 2,
        mt: 1.5,
      }}
    >
      <AdminApprovalList />
      <ApprovedAdminTable />
    </Box>
  );
}
