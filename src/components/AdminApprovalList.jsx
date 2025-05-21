import React from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import { apiRequest } from "../utils/api";

export default function AdminApprovalList({
  users,
  fetchUsers,
  fetchTableData,
}) {
  const handleApproveUser = async (userId) => {
    // console.log("handle ApproveUser called", userId)
    const confirm = window.confirm(
      "Are you sure you want to approve this user as admin?"
    );
    if (!confirm) return;

    try {
      const response = await apiRequest.put(`/master/approve/${userId}`, {});

      if (response?.data?.success) {
        showSuccessToast(
          response?.data?.message || "User successfully approved as admin!"
        );

        fetchUsers();
        fetchTableData();
      }
    } catch (error) {
      console.error("Error approving user:", error);
      showErrorToast("Failed to approve user. Please try again.");
    }
  };

  const handleRemoveUser = async (userId) => {
    // console.log("handle Removed called", userId)
    const confirm = window.confirm("Are you sure, Do You Want To Denied User?");
    if (!confirm) return;
    try {
      const response = await apiRequest.delete(
        `/master/deletePendingUser/${userId}`
      );
      // console.log("response delete....", response?.data);

      if (response?.data?.success) {
        showSuccessToast(
          response?.data?.message || "User deleted successfully!"
        );
        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      showErrorToast(`Failed to delete User. Please try again.`);
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
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
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
                      cancel
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </>
      )}
    </>
  );
}
