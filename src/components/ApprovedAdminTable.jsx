import * as React from "react"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import { Box, Typography, Switch, IconButton } from "@mui/material"
import { AdminColumns } from "../config/tableConfig"
import DeleteIcon from "@mui/icons-material/Delete"
import { showSuccessToast, showErrorToast } from "../utils/toastUtils"

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL

export default function QuickFilteringGrid({ rows, fetchTableData }) {
  // Toggle active status component (inline)
  const ToggleActiveCell = ({ params }) => {
    const handleToggle = async (event) => {
      const newValue = event.target.checked

      try {
        const token = localStorage.getItem("token")
        await axios.patch(
          `${baseURL}/master/update-active/${params.row._id}`,
          // { active: newValue },
          { active: params.row.active },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        fetchTableData()
      } catch (error) {
        console.error("Error updating active status:", error)
      }
    }
    return (
      <Switch
        checked={params.row.active}
        onChange={handleToggle}
        color="success"
      />
    )
  }

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this admin?",
      id
    )
    if (!confirm) return

    try {
      const token = localStorage.getItem("token")
      const response = await axios.delete(
        `${baseURL}/master/deleteAdmin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response?.data?.success === true) {
        showSuccessToast(response?.data?.message || "Deleted successfully")
        setTimeout(() => {
          fetchTableData()
        }, 1500)
      }
    } catch (error) {
      console.error("Error deleting item", error)
      showErrorToast("Error deleting inventory item. Please try again!")
    }
  }

  const user = JSON.parse(localStorage.getItem("user"))

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
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          autoHeight
          disableRowSelectionOnClick
          disableColumnMenu
          getRowHeight={() => "auto"}
          sx={{
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
          }}
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
  )
}
