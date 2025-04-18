import {
  Box,
  Button,
  Card,
  CardContent,
  Snackbar,
  Typography,
} from "@mui/material";
import {
  Inventory,
  AssignmentTurnedIn,
  Storage,
  ListAlt,
  Edit,
  ContentCopy,
} from "@mui/icons-material";
import React, { useState } from "react";

export default function UserIssuanceFom({ isDrawerOpen }) {
  const [copied, setCopied] = useState(false);

  const userFormURL = `${window.location.origin}/user_form`;
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(userFormURL);
      setCopied(true);

      // Change text back after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <>
      <Box
        sx={{
          p: 1,
          width: "100%",
          overflowX: "auto", // avoid horizontal scroll
        }}
      >
        <Card
          sx={{
            textAlign: "center",
            background: "#E3F2FD",
            maxWidth: "100%",

            position: "relative",
            "&:after": {
              content: '""',
              position: "absolute",
              width: 210,
              height: 210,
              background: "#257180",
              borderRadius: "50%",
              top: { xs: -105, sm: -140 },
              right: { xs: -140, sm: -95 },
              opacity: 0.3,
              zIndex: 0,
            },
            "&:before": {
              content: '""',
              position: "absolute",
              width: 210,
              height: 210,
              background: "#257180",
              borderRadius: "50%",
              top: { xs: -155, sm: -160 },
              right: { xs: -70, sm: 0 },
              opacity: 0.4,
              zIndex: 0,
            },

            "& > *": {
              position: "relative",
              zIndex: 1,
            },
          }}
        >
          {isDrawerOpen ? (
            <CardContent>
              <Edit sx={{ fontSize: 30, color: "#1976d2" }} />
              <Typography variant="body2" fontWeight="bold" sx={{ mt: 0 }}>
                Need to Issue a Component?
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{
                  mb: 2,
                  fontSize: "11px",
                }}
              >
                Click below to fill out the issuance form.
              </Typography>
              <Box sx={{ mt: 2, display: "flex", flexDirection: "column" }}>
                <a
                  href="/user_form"
                  target="_blank"
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginRight: 1 }}
                  >
                    📄 Fill Issuance Form
                  </Button>
                </a>

                <Button
                  variant="outlined"
                  color={copied ? "success" : "primary"}
                  onClick={handleCopyLink}
                  startIcon={<ContentCopy />}
                  sx={{ mt: 2 }}
                >
                  {copied ? "Copied!" : "Copy Form Link"}
                </Button>
              </Box>
            </CardContent>
          ) : (
            <CardContent>
              <Box sx={{ height: "45px" }}></Box>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Box sx={{ fontWeight: "bold", color: "#0284c7" }}>Form</Box>
                <a
                  href="/user_form"
                  target="_blank"
                  style={{ textDecoration: "none" }}
                >
                  📄
                </a>
                <Box sx={{ fontWeight: "bold", color: "#0284c7" }}>Link</Box>
                <ContentCopy
                  onClick={handleCopyLink}
                  sx={{ cursor: "pointer", color: copied ? "green" : "" }}
                />
              </Box>
            </CardContent>
          )}
        </Card>
      </Box>
    </>
  );
}
