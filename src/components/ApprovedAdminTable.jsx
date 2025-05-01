import * as React from "react"
import Box from "@mui/material/Box"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import { useEffect, useState } from "react"
import { Typography, Switch } from "@mui/material"
import { AdminColumns } from "../config/tableConfig"

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL

export default function QuickFilteringGrid() {
  const [rows, setRows] = useState([])

  const fetchTableData = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${baseURL}/admin/allAdmins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const rowsWithId = response?.data?.users
        ?.map((user, index) => ({
          ...user,
          id: index + 1,
          // createdAt: new Date(user.createdAt).toLocaleString(),
          updatedAt: new Date(user.updatedAt).toLocaleString(),
          updatedAtRaw: new Date(user.updatedAt), // raw date for sorting
        }))
        .sort((a, b) => b.updatedAtRaw - a.updatedAtRaw) // sort latest first

      setRows(rowsWithId)
    } catch (error) {
      console.log("Error fetching data", error)
    }
  }

  useEffect(() => {
    fetchTableData()
  }, [])

  // Toggle active status component (inline)
  const ToggleActiveCell = ({ params }) => {
    const handleToggle = async (event) => {
      const newValue = event.target.checked
      try {
        const token = localStorage.getItem("token")
        await axios.patch(
          `${baseURL}/admin/update-active/${params.row._id}`,
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
