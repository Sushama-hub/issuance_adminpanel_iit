import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import EditDialogBox from "./dialog/EditDialogBox";
import { useNavigate } from "react-router-dom";
import { navigateToRoleBasedPath } from "../utils/roleNavigator";
import { InventoryColumns } from "../config/tableConfig";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import { inventoryConfig } from "../config/inventoryConfig";
import { apiRequest } from "../utils/api";
import ConfirmDialog from "./dialog/ConfirmDialog";

export default function QuickFilteringGrid() {
  const [rows, setRows] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEditRow, setSelectedEditRow] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionData, setActionData] = useState(null);

  const navigate = useNavigate();

  const fetchTableData = async () => {
    try {
      const response = await apiRequest.get("/inventory");

      // Parse and set data
      const dataWithId = response?.data?.data?.map((item, index) => {
        return {
          id: item.id || index + 1,
          _id: item._id,
          ...item,
          createdAt: new Date(item.createdAt).toLocaleString(),
          updatedAt: new Date(item.updatedAt).toLocaleString(),
        };
      });

      setRows(dataWithId);
    } catch (error) {
      console.log("Error fetching data", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  // Handle Edit (Open Dialog)
  const handleEdit = (row) => {
    setSelectedEditRow(row);
    setEditDialogOpen(true);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    setActionData(id);
    setConfirmOpen(true);
  };

  const handleEditDialogSubmit = async () => {
    try {
      const response = await apiRequest.put(
        `/inventory/${selectedEditRow._id}`,
        selectedEditRow
      );

      if (response?.data?.success) {
        showSuccessToast(
          response?.data?.message || "Inventory item updated successfully!"
        );

        await fetchTableData(); // Refresh Table data
      }
    } catch (error) {
      console.error("Error updating item", error);
      showErrorToast("Something went wrong while updating!");
    } finally {
      setEditDialogOpen(false);
      setSelectedEditRow(null);
    }
  };

  const handleConfirmDialogSubmit = async (id) => {
    try {
      const response = await apiRequest.delete(`/inventory/${id}`);

      if (response?.data?.success) {
        showSuccessToast(response?.data?.message || "Deleted successfully");
        await fetchTableData();
      }
    } catch (error) {
      console.error("Error deleting item", error);
      showErrorToast("Error deleting inventory item. Please try again!");
    } finally {
      setConfirmOpen(false);
      setActionData(null);
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Box sx={{ width: "100%", p: 1, mt: 1.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }} mb={2}>
          <Typography variant="h5" color="primary" fontWeight="bold">
            Inventory Table
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigateToRoleBasedPath(navigate, "inventory_form")}
            size="small"
            startIcon={<AddIcon />}
            sx={{ fontWeight: "bold", border: "2px solid" }}
          >
            Add New Inventory
          </Button>
        </Box>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            // columns={columns}
            columns={InventoryColumns?.map((col) =>
              col.field === "actions"
                ? {
                    ...col,
                    renderCell: (params) => (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(params.row)}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        {user && user?.role === "master" && (
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(params.row._id)}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    ),
                  }
                : col
            )}
            pageSizeOptions={[10, 25, 50, 100]} // Optional: dropdown options
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                  page: 0,
                },
              },
            }}
            pagination
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            autoHeight
            disableRowSelectionOnClick
            disableColumnMenu
            getRowHeight={() => "auto"}
            sx={dataGridStyles}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                csvOptions: {
                  disableToolbarButton: false,
                  fileName: "Inventory Record",
                },
                printOptions: { disableToolbarButton: true },
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
          />
        </Box>
      </Box>

      {/* Edit Dialog */}
      <EditDialogBox
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        selectedEditRow={selectedEditRow}
        setSelectedEditRow={setSelectedEditRow}
        fields={inventoryConfig}
        onSubmit={handleEditDialogSubmit}
        heading="Edit Inventory Item"
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        title="Delete Inventory Item?"
        text="Are you sure you want to delete this inventory item?"
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onSubmit={handleConfirmDialogSubmit}
        actionData={actionData}
        setActionData={setActionData}
      />
    </>
  );
}

const dataGridStyles = {
  "& .MuiDataGrid-columnHeaderTitle": {
    textOverflow: "clip",
    whiteSpace: "break-spaces",
    lineHeight: 1.15,
  },
  "& .MuiDataGrid-row": {
    minHeight: "30px !important",
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
};
