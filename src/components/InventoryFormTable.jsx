import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DialogBox from "./DialogBox";
import { useNavigate } from "react-router-dom";

export default function QuickFilteringGrid() {
  const [rows, setRows] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editValues, setEditValues] = useState({
    componentName: "",
    specification: "",
    quantity: "",
  });
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    severity: "success", // can be "success", "error", "warning", "info"
  });
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

  const fetchTableData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/inventory`);

      // Ensure each row has a unique id
      const dataWithId = response?.data?.data?.map((item, index) => {
        const date = new Date(item.createdAt);
        const date2 = new Date(item.updatedAt);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, ${date.toLocaleTimeString()}`;
        const formattedDate2 = `${date2.getDate()}/${date2.getMonth() + 1}/${date2.getFullYear()}, ${date2.toLocaleTimeString()}`;

        return {
          id: item.id || index + 1, // Use API id or fallback to index
          ...item,
          createdAt: formattedDate,
          updatedAt: formattedDate2,
        };
      });
      // console.log("dataWithId", dataWithId);
      setRows(dataWithId);
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  // Handle Edit (Open Dialog)
  const handleEdit = (row) => {
    console.log("handleEdit called", row);
    setEditRow(row);
    setEditValues({
      componentName: row.componentName,
      specification: row.specification,
      quantity: row.quantity,
    });
    setEditDialogOpen(true);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    console.log("handleDelete called", id);
    const confirm = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirm) return;

    try {
      const response = await axios.delete(`${baseUrl}/inventory/${id}`);

      if (response?.data?.success === true) {
        setSnackbarData({
          open: true,
          message: `✅ ${response?.data?.message} `,
          severity: "success",
        });
      }
      setTimeout(() => {
        fetchTableData();
      }, 1500);
      fetchTableData();
    } catch (error) {
      console.error("Error deleting item", error);
      setSnackbarData({
        open: true,
        message: "❌ Error Updating inventory. Please try again!",
        severity: "error",
      });
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "SNo.",
      flex: 0,
      editable: false,
      width: 100,
    },
    {
      field: "componentName",
      headerName: "Component Name",
      flex: 1,
      editable: false,
    },
    {
      field: "specification",
      headerName: "Specification",
      flex: 1,
      editable: false,
    },
    { field: "quantity", headerName: "Quantity", flex: 1, editable: false },
    // { field: "createdAt", headerName: "Created At", flex: 1, editable: false },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row._id)}
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ width: "100%", height: "100vh", p: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }} mb={2}>
          <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
            Inventory Table
          </Typography>
          <Button
            variant="outlined"
            // sx={{ backgroundColor: "#075985" }}
            onClick={() => navigate("/inventory_form")}
            size="small"
          >
            Add New Inventory
          </Button>
        </Box>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            autoHeight
            disableRowSelectionOnClick
            disableColumnMenu
            getRowHeight={() => "auto"}
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                textOverflow: "clip",
                whiteSpace: "break-spaces",
                lineHeight: 1.15,
              },
              "& .MuiDataGrid-row": {
                minHeight: "52px !important",
              },
              "& .MuiDataGrid-columnHeader:focus, .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },
              "& .MuiDataGrid-main": {
                overflow: "unset",
              },
              "& .MuiDataGrid-columnHeaders": {
                position: "sticky",
                top: 63,
                backgroundColor: "red",
                zIndex: 1,
              },
            }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                csvOptions: { disableToolbarButton: false },
                printOptions: { disableToolbarButton: false },
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
          />
        </Box>
      </Box>

      {/* Edit Dialog */}
      <DialogBox
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        editRow={editRow}
        setEditRow={setEditRow}
        editValues={editValues}
        setEditValues={setEditValues}
        fetchTableData={fetchTableData}
      />

      {/* Snackbar for Success & Error Messages */}
      <Snackbar
        open={snackbarData.open}
        autoHideDuration={3000}
        onClose={() => setSnackbarData({ ...snackbarData, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarData({ ...snackbarData, open: false })}
          severity={snackbarData.severity}
          sx={{ width: "100%" }}
        >
          {snackbarData.message}
        </Alert>
      </Snackbar>
    </>
  );
}
