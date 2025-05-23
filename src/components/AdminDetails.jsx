import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import AdminApprovalList from "./AdminApprovalList";
import ApprovedAdminTable from "./ApprovedAdminTable";
import { apiRequest } from "../utils/api";

export default function AdminDetails() {
  const [users, setUsers] = useState([]);
  const [rows, setRows] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await apiRequest.get("/master/pending-approvals");
      setUsers(response?.data?.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchTableData = async () => {
    try {
      const response = await apiRequest.get("/master/allAdmins");

      const rowsWithId = response?.data?.users?.map((user, index) => ({
        ...user,
        id: index + 1,
        // createdAt: new Date(user.createdAt).toLocaleString(),
        updatedAt: new Date(user.updatedAt).toLocaleString(),
        updatedAtRaw: new Date(user.updatedAt), // raw date for sorting
      }));
      // .sort((a, b) => b.updatedAtRaw - a.updatedAtRaw) // sort latest first

      setRows(rowsWithId);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTableData();
  }, []);

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
      <AdminApprovalList
        users={users}
        fetchUsers={fetchUsers}
        fetchTableData={fetchTableData}
      />
      <ApprovedAdminTable rows={rows} fetchTableData={fetchTableData} />
    </Box>
  );
}
