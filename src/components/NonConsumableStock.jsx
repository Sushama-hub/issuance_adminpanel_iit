import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { NonConsumableColumns } from "../config/tableConfig";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import EditDialogBox from "./dialog/EditDialogBox";
import { nonConsumableConfig } from "../config/nonConsumableConfig";
import { formatDateToDDMMYYYY } from "../utils/date";
import { apiRequest } from "../utils/api";

export default function QuickFilteringGrid() {
  const [rows, setRows] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEditRow, setSelectedEditRow] = useState(null);
  const [stockId, setStockId] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const selectedYear = queryParams.get("year");

  const fetchTableData = async (year) => {
    if (!year) return; // exit if year is not selected
    try {
      const response = await apiRequest.get(
        `/nonConsumableStock/nonConsumableStockFilter/${year}`
      );

      const rowsWithId = response?.data?.yearData?.data?.map((item, index) => ({
        ...item,
        id: index + 1,
        finalSupplyDate: formatDateToDDMMYYYY(item.finalSupplyDate),
      }));

      setRows(rowsWithId || []);
      setStockId(response?.data?.yearData?._id);
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  useEffect(() => {
    if (selectedYear) {
      fetchTableData(selectedYear);
    }
  }, [selectedYear]);

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const routeBase =
    storedUser?.role === "master"
      ? "/dashboard/master/non_consumable_form"
      : "/dashboard/admin/non_consumable_form";

  const handleEdit = (row) => {
    // console.log("handle edit called", row)
    setSelectedEditRow(row);
    setEditDialogOpen(true);
  };

  // Handle Delete
  const handleDelete = async (rowId, stockId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this stock?"
    );
    if (!confirm) return;

    try {
      const response = await apiRequest.delete(
        `/nonConsumableStock/deleteStockData/${stockId}/${rowId}`
      );

      if (response?.data?.success) {
        showSuccessToast(response?.data?.message || "Deleted successfully");
        fetchTableData(selectedYear);
      }
    } catch (error) {
      console.error("Error deleting item", error);
      showErrorToast("Error deleting inventory item. Please try again!");
    }
  };

  const handleDialogSubmit = async () => {
    try {
      const response = await apiRequest.put(
        `/nonConsumableStock/editStockData/${stockId}/${selectedEditRow?._id}`,
        selectedEditRow
      );

      if (response?.data?.success) {
        showSuccessToast(
          response?.data?.message || "Item Updated successfully!"
        );
        setEditDialogOpen(false);
        setSelectedEditRow(null);
        fetchTableData(selectedYear); // Reload table with updated data
      }
    } catch (error) {
      console.error("Error updating item", error);
      showErrorToast("Something went wrong while updating!");
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Box sx={{ width: "100%", p: 1, mt: 1.5 }}>
        {selectedYear ? (
          <>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h5" color="primary" fontWeight="bold">
                Non Consumable Stock Table{" "}
                {selectedYear && (
                  <Typography
                    component="span"
                    variant="h5"
                    color="warning"
                    fontWeight="bold"
                  >
                    {selectedYear}
                  </Typography>
                )}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate(routeBase)}
                size="small"
                startIcon={<AddIcon />}
                sx={{ fontWeight: "bold", border: "2px solid" }}
              >
                Add New Year Data
              </Button>
            </Box>

            {rows.length === 0 && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Typography variant="body1" color="text.secondary">
                  No data available for this financial year. Please first fill
                  the form for this year {selectedYear}. To view data, click the
                  year chip.
                </Typography>
                <Typography
                  component="a"
                  variant="body1"
                  color="primary.main"
                  fontWeight="bold"
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                  onClick={() => navigate(routeBase)}
                >
                  Add Data for This Year
                </Typography>
              </Box>
            )}
            <Box sx={{ width: "100%" }}>
              <DataGrid
                rows={rows}
                // columns={NonConsumableColumns}
                columns={NonConsumableColumns?.map((col) =>
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
                                onClick={() =>
                                  handleDelete(params.row._id, stockId)
                                }
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
                      fileName: "Non Consumable Stock",
                    },
                    printOptions: { disableToolbarButton: true },
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
              />
            </Box>
          </>
        ) : selectedYear === null ? (
          <Box
            sx={{
              width: "100%",
              minHeight: "83vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f5f5f5",
              textAlign: "center",
              px: 2,
            }}
          >
            <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
              No Year Selected
            </Typography>
            <Typography variant="body1" mb={3}>
              Please select a year to view the Non Consumable Stock Table, or
              fill the Non Consumable Form to add new data if needed.
              {/* To view the Non Consumable Stock Table, please select a year.
            Alternatively, you can fill the Non Consumable Form to add new data */}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(routeBase)}
            >
              Go to Year Selection
            </Button>
          </Box>
        ) : (
          ""
        )}
      </Box>

      {/* Edit Dialog */}
      <EditDialogBox
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        selectedEditRow={selectedEditRow}
        setSelectedEditRow={setSelectedEditRow}
        fields={nonConsumableConfig}
        onSubmit={handleDialogSubmit}
        heading="Edit Non Consumable Stock"
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
