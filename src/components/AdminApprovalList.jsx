import React from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import { apiRequest } from "../utils/api";
import ConfirmDialog from "./dialog/ConfirmDialog";
import { useState } from "react";

export default function AdminApprovalList({
  users,
  fetchUsers,
  fetchTableData,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionData, setActionData] = useState(null);
  const [actionType, setActionType] = useState("");

  const handleApproveUser = async (userId) => {
    setActionData(userId);
    setActionType("approve");
    setConfirmOpen(true);
  };

  const handleRemoveUser = async (userId) => {
    setActionData(userId);
    setActionType("delete");
    setConfirmOpen(true);
  };

  const handleConfirmDialogSubmit = async (userId) => {
    try {
      if (actionType === "approve") {
        const response = await apiRequest.put(`/master/approve/${userId}`, {});

        if (response?.data?.success) {
          showSuccessToast(
            response?.data?.message || "User successfully approved as admin!"
          );

          await fetchUsers();
          await fetchTableData();
        }
      } else if (actionType === "delete") {
        const response = await apiRequest.delete(
          `/master/deletePendingUser/${userId}`
        );

        if (response?.data?.success) {
          showSuccessToast(
            response?.data?.message || "User deleted successfully!"
          );
          await fetchUsers();
        }
      }
    } catch (error) {
      console.error("Error:", error);
      showErrorToast(`Operation failed. Please try again.`);
    } finally {
      setConfirmOpen(false);
      setActionData(null);
      setActionType("");
    }
  };

  return (
    <>
      {users.length > 0 && (
        <>
          <Typography
            variant="h5"
            gutterBottom
            fontWeight="bold"
            color="primary"
          >
            Pending Admin Approvals Requests
          </Typography>

          <Box
            sx={{
              maxHeight: 300,
              //   overflowY: users.length > 5 ? "scroll" : "auto",
              overflowY: "auto",
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 1,
            }}
          >
            {users.map((user) => (
              <Card key={user._id} sx={{ mb: 1, borderRadius: 2 }}>
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 0, // Less vertical padding
                    px: 2, // Optional: a little horizontal padding
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {user?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      onClick={() => handleApproveUser(user?._id)}
                      sx={{ whiteSpace: "nowrap", mt: 2 }} //prevents line break inside button
                    >
                      Approve as Admin
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleRemoveUser(user?._id)}
                      sx={{ whiteSpace: "nowrap", mt: 2 }} //prevents line break inside button
                    >
                      Deny
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        title={actionType === "approve" ? "Approve as Admin?" : "Deny User?"}
        text={
          actionType === "approve"
            ? "Are you sure you want to approve this user as admin?"
            : "Are you sure you want to deny this user?"
        }
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onSubmit={handleConfirmDialogSubmit}
        actionData={actionData}
        setActionData={setActionData}
      />
    </>
  );
}
