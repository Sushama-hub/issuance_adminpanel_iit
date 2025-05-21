import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Typography, Switch, IconButton } from "@mui/material";
import { AdminColumns } from "../config/tableConfig";
import DeleteIcon from "@mui/icons-material/Delete";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import { apiRequest } from "../utils/api";

export default function QuickFilteringGrid({ rows, fetchTableData }) {
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
    const confirm = window.confirm(
      "Are you sure you want to delete this admin?",
      id
    );
    if (!confirm) return;

    try {
      const response = await apiRequest.delete(`/master/deleteAdmin/${id}`);

      if (response?.data?.success === true) {
        showSuccessToast(response?.data?.message || "Deleted successfully");
        setTimeout(() => {
          fetchTableData();
        }, 1500);
      }
    } catch (error) {
      console.error("Error deleting item", error);
      showErrorToast("Error deleting inventory item. Please try again!");
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
