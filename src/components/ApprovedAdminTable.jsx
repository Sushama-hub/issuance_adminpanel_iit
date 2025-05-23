import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Typography, Switch, IconButton } from "@mui/material";
import { AdminColumns } from "../config/tableConfig";
import DeleteIcon from "@mui/icons-material/Delete";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import { apiRequest } from "../utils/api";
import ConfirmDialog from "./dialog/ConfirmDialog";
import { useState } from "react";

export default function QuickFilteringGrid({ rows, fetchTableData }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionData, setActionData] = useState(null);

  // Toggle active status component (inline)
  const ToggleActiveCell = ({ params }) => {
    const handleToggle = async (event) => {
      const newValue = event.target.checked;

      try {
        await apiRequest.patch(`/master/update-active/${params.row._id}`, {
          active: params.row.active,
        });

        fetchTableData();
      } catch (error) {
        console.error("Error updating active status:", error);
      }
    };
    return (
      <Switch
        checked={params.row.active}
        onChange={handleToggle}
        color="success"
      />
    );
  };

  const handleDelete = async (id) => {
    setActionData(id);
    setConfirmOpen(true);
  };

  const handleConfirmDialogSubmit = async (id) => {
    try {
      const response = await apiRequest.delete(`/master/deleteAdmin/${id}`);

      if (response?.data?.success) {
        showSuccessToast(response?.data?.message || "Deleted successfully");
        await fetchTableData();
      }
    } catch (error) {
      console.error("Error deleting item", error);
      showErrorToast("Error deleting inventory item. Please try again!");
    } finally {
      // Ensure cleanup happens even if there's an error
      setConfirmOpen(false);
      setActionData(null);
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Box sx={{ width: "100%", p: 1, mt: 1.5 }}>
      <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
        Approved Admin Table
      </Typography>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={AdminColumns?.map((col) =>
            col.field === "active"
              ? {
                  ...col,
                  renderCell: (params) => (
                    <ToggleActiveCell
                      params={params}
                      // refreshData={fetchTableData}
                    />
                  ),
                }
              : col.field === "actions"
                ? {
                    ...col,
                    renderCell: (params) => (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {user && user?.role === "master" && (
                          <IconButton
                            color="error"
                            // onClick={() => handleDelete(params.row._id)}
                            onClick={() => {
                              handleDelete(params.row._id),
                                setActionData(params.row._id);
                              setConfirmOpen(true);
                            }}
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
          // sx={{
          //   "& .MuiDataGrid-cell:focus-within": {
          //     outline: "none",
          //   },
          // }}
          sx={dataGridStyles}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              csvOptions: {
                disableToolbarButton: false,
                fileName: "Admin List",
              },
              printOptions: { disableToolbarButton: true },
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
        />
      </Box>

      {/* Confirm Dialog */}
      <ConfirmDialog
        title="Admin Delete?"
        text="Are you sure you want to delete this admin?"
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onSubmit={handleConfirmDialogSubmit}
        actionData={actionData}
        setActionData={setActionData}
      />
    </Box>
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
