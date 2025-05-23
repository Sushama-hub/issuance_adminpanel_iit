import React from "react";
import { Button } from "@mui/material";
import { navigateToRoleBasedPath } from "../utils/roleNavigator";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useNavigate } from "react-router-dom";

const EntryFormButton = ({ actionType }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={() =>
        navigateToRoleBasedPath(navigate, `entry_form/${actionType}`)
      }
      size="small"
      startIcon={<UploadFileIcon />}
      sx={{ fontWeight: "bold", border: "2px solid" }}
    >
      {actionType === "issue"
        ? "Upload Issued Record"
        : "Upload Return/Consume Record"}
    </Button>
  );
};

export default EntryFormButton;
