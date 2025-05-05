import * as React from "react"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import { useEffect, useState } from "react"
import { Box, Typography, IconButton, Button } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import DialogBox from "./DialogBox"
import { useNavigate } from "react-router-dom"
import { navigateToRoleBasedPath } from "../utils/roleNavigator"
import { InventoryColumns } from "../config/tableConfig"
import { showErrorToast, showSuccessToast } from "../utils/toastUtils"

export default function QuickFilteringGrid() {
  const [rows, setRows] = useState([])
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [editValues, setEditValues] = useState({
    componentName: "",
    specification: "",
    quantity: "",
  })

  const navigate = useNavigate()
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL

  const fetchTableData = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await axios.get(`${baseUrl}/inventory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Parse and set data
      const dataWithId = response?.data?.data?.map((item, index) => {
        return {
          id: item.id || index + 1,
          _id: item._id,
          ...item,
          createdAt: new Date(item.createdAt).toLocaleString(),
          updatedAt: new Date(item.updatedAt).toLocaleString(),
        }
      })

      setRows(dataWithId)
    } catch (error) {
      console.log("Error fetching data", error.response?.data || error.message)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetchTableData()
    }
  }, [])

  // Handle Edit (Open Dialog)
  const handleEdit = (row) => {
    setEditRow(row)
    setEditValues({
      componentName: row.componentName,
      specification: row.specification,
      quantity: row.quantity,
    })
    setEditDialogOpen(true)
  }

  // Handle Delete
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this item?")
    if (!confirm) return

    try {
      const token = localStorage.getItem("token")
      const response = await axios.delete(`${baseUrl}/inventory/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

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
    <>
      <Box sx={{ width: "100%", p: 1, mt: 1.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }} mb={2}>
          <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
            Inventory Table
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigateToRoleBasedPath(navigate, "inventory_form")}
            size="small"
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
      <DialogBox
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        editRow={editRow}
        setEditRow={setEditRow}
        editValues={editValues}
        setEditValues={setEditValues}
        fetchTableData={fetchTableData}
      />
    </>
  )
}
