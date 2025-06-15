import * as React from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ConfirmDialog from "./ConfirmDialog";
import { useState } from "react";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { apiRequest } from "../../utils/api";

const EditableStatusCell = ({ params, refreshData, closeDialog, useFor }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionData, setActionData] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClick = async (status) => {
    setAnchorEl(null);
    if (status && status !== params.component?.status) {
      setActionData({ status, component: params?.component });
      setConfirmOpen(true);
    }
  };

  const handleConfirmDialogSubmit = async (actionData) => {
    try {
      const response =
        useFor === "issued"
          ? await apiRequest.post(`/user/update-status`, {
              userFormId: params.id,
              status: actionData?.status,
              componentData: actionData?.component,
            })
          : await apiRequest.post(`/user/update-return-status`, {
              returnTableId: params.id,
              newStatus: actionData?.status,
            });

      if (response?.data?.success) {
        showSuccessToast(
          response?.data?.message || "Status updated successfully!"
        );

        // refresh the table
        await refreshData();
        closeDialog();
      }
    } catch (error) {
      console.error("Error updating status", error);
      showErrorToast(`Failed to update status. Please try again.`);
    } finally {
      setConfirmOpen(false);
      setActionData(null);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography color="primary.dark">
          {params?.component?.status}
        </Typography>
        <IconButton onClick={handleMenuOpen} size="small" color="primary">
          <ArrowDropDownIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={() => handleClick(null)}>
          {["Issued", "Returned", "Consumed"].map((option) => {
            const bgColor =
              option === "Issued"
                ? "primary.main"
                : option === "Returned"
                  ? "success.main"
                  : option === "Consumed"
                    ? "warning.main"
                    : "inherit";
            return (
              <MenuItem
                key={option}
                onClick={() => handleClick(option)}
                sx={{
                  backgroundColor: bgColor,
                  color: "white",
                  "&:hover": {
                    backgroundColor: bgColor,
                    opacity: 0.7,
                  },
                }}
              >
                {option}
              </MenuItem>
            );
          })}
        </Menu>
      </Box>

      {/* Confirm Dialog */}
      <ConfirmDialog
        title="Confirm Status Change!"
        text={`Please confirm: change status from "${params?.component?.status}" to "${actionData?.status}"?`}
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onSubmit={handleConfirmDialogSubmit}
        actionData={actionData}
        setActionData={setActionData}
      />
    </>
  );
};

export default function AlertDialog({
  title,
  open,
  setOpen,
  selectedRow,
  allTableData,
  fetchTableData,
  useFor,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  const getComponentArr = allTableData?.filter(
    (item) => item._id === selectedRow?._id
  );

  return (
    <>
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: { p: 3 },
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <DialogTitle variant="h5" color="primary" fontWeight="bold">
            {title}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" color="primary">
              Close
            </Button>
          </DialogActions>
        </Box>
        <DialogContent
          dividers
          sx={{
            borderBottom: "none",
          }}
        >
          {/* Main Details Section */}
          <Box mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Name:{"  "}</strong>
                  <Typography component="span" color="text.secondary">
                    {selectedRow?.name}
                  </Typography>
                </Typography>
                <Typography>
                  <strong>Email:{"  "}</strong>
                  <Typography component="span" color="text.secondary">
                    {selectedRow?.email}
                  </Typography>
                </Typography>
                <Typography>
                  <strong>Mobile:{"  "}</strong>
                  <Typography component="span" color="text.secondary">
                    {selectedRow?.mobile}
                  </Typography>
                </Typography>
                <Typography>
                  <strong>ID Number:{"  "}</strong>
                  <Typography component="span" color="text.secondary">
                    {selectedRow?.idNumber}
                  </Typography>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Batch:{"  "}</strong>
                  <Typography component="span" color="text.secondary">
                    {selectedRow?.batch}
                  </Typography>
                </Typography>
                <Typography>
                  <strong>Branch:{"  "}</strong>
                  <Typography component="span" color="text.secondary">
                    {selectedRow?.branch}
                  </Typography>
                </Typography>
                <Typography>
                  <strong>Category:{"  "}</strong>
                  <Typography component="span" color="text.secondary">
                    {selectedRow?.category}
                  </Typography>
                </Typography>
                <Typography>
                  <strong>Lab Number:{"  "}</strong>
                  <Typography component="span" color="text.secondary">
                    {selectedRow?.labNumber}
                  </Typography>
                </Typography>
              </Grid>
            </Grid>
            <Box>
              <strong>Status:{"  "}</strong>
              <Chip label={selectedRow?.status} color="primary" size="small" />
            </Box>
          </Box>

          {/* Components Table */}
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Components
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>Component Name</TableCell>
                  <TableCell>Specification</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {useFor === "issued" ? (
                  <>
                    {getComponentArr[0]?.components.map((comp) => (
                      <TableRow key={comp._id}>
                        <TableCell>{comp.componentName}</TableCell>
                        <TableCell>{comp.specification}</TableCell>
                        <TableCell>{comp.quantity}</TableCell>
                        {/* <TableCell>{comp?.status}</TableCell> */}
                        <TableCell>
                          <EditableStatusCell
                            params={{
                              id: selectedRow?._id,
                              component: comp,
                            }}
                            refreshData={fetchTableData}
                            closeDialog={handleClose}
                            useFor={useFor}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : (
                  <>
                    <TableRow key={selectedRow._id}>
                      <TableCell>{selectedRow.componentName}</TableCell>
                      <TableCell>{selectedRow.specification}</TableCell>
                      <TableCell>{selectedRow.quantity}</TableCell>
                      {/* <TableCell>{comp?.status}</TableCell> */}
                      <TableCell>
                        <EditableStatusCell
                          params={{
                            id: selectedRow?._id,
                            component: selectedRow,
                          }}
                          refreshData={fetchTableData}
                          closeDialog={handleClose}
                          useFor={useFor}
                        />
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </>
  );
}
