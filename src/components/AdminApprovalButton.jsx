import { Alert, Badge, Box, Button } from "@mui/material";
import React from "react";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { useNavigate } from "react-router-dom";

export default function AdminApprovalButton({ pendingUsers }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      {user?.role === "master" && pendingUsers?.length > 0 && (
        <Box sx={{ display: "flex", gap: 3, mt: 4 }}>
          <Badge
            badgeContent={pendingUsers?.length}
            color="warning"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "1rem",
                padding: "8px",
                minWidth: "28px",
                height: "28px",
                animation: "blinker 1.2s linear infinite",
                // backgroundColor: "#1976D2",
                color: "#fff",
              },
              "@keyframes blinker": {
                "50%": {
                  opacity: 0.6,
                },
              },
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<SupervisorAccountIcon />}
              color="info"
              onClick={() => navigate("/dashboard/master/admin_records")}
              // sx={{
              //   backgroundColor: "#1976D2", // custom blue
              //   color: "#fff",
              //   animation: "blinker 1.2s linear infinite",
              //   "@keyframes blinker": {
              //     "50%": {
              //       opacity: 0.6,
              //     },
              //   },
              //   "&:hover": {
              //     backgroundColor: "#115293",
              //   },
              // }}
            >
              Pending Admin Approval
            </Button>
          </Badge>

          <Alert severity="info">
            New admin requests are pending your approval. Please review.
          </Alert>
        </Box>
      )}
    </>
  );
}
