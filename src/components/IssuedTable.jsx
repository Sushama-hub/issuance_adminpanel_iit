import * as React from "react"
import Box from "@mui/material/Box"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import { useEffect, useState } from "react"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { Typography } from "@mui/material"

const columns = [
  {
    field: "id",
    headerName: "SNo.",
    editable: false,
    width: 55,
  },
  { field: "email", headerName: "Email", flex: 0, editable: false, width: 130 },
  { field: "name", headerName: "Name", flex: 0, editable: false, width: 120 },
  { field: "batch", headerName: "Batch", flex: 0, editable: false, width: 60 },
  {
    field: "idNumber",
    headerName: "ID Number",
    flex: 0,
    editable: false,
    width: 100,
  },
  {
    field: "category",
    headerName: "Category",
    flex: 0,
    editable: false,
    width: 100,
  },
  {
    field: "branch",
    headerName: "Branch",
    flex: 0,
    editable: false,
    width: 100,
  },
  {
    field: "mobile",
    headerName: "Mobile",
    flex: 0,
    editable: false,
    width: 100,
  },
  {
    field: "labNumber",
    headerName: "Lab Number",
    flex: 0,
    editable: false,
    width: 105,
  },
  {
    field: "components",
    headerName: "Components",
    flex: 0,
    editable: false,
    width: 170,
  },
  {
    field: "specification",
    headerName: "specification",
    flex: 0,
    editable: false,
    width: 160,
  },
  {
    field: "quantity",
    headerName: "quantity",
    flex: 0,
    editable: false,
    width: 120,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 0,
    editable: true,
    renderCell: (params) => <EditableStatusCell params={params} />,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    flex: 0,
    editable: false,
    width: 120,
  },
]

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL

const EditableStatusCell = ({ params, refreshData }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = async (status) => {
    setAnchorEl(null)
    if (status && status !== params.value) {
      try {
        const response = await axios.put(
          `${baseURL}/user/update-status/${params.row._id}`,
          {
            status: status,
          }
        )

        // refresh the table
        refreshData()
      } catch (error) {
        console.error("Error updating status", error)
      }
    }
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <span>{params.value}</span>
      <IconButton onClick={handleClick} size="small">
        <ArrowDropDownIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={() => handleClose(null)}>
        {["Issued", "Returned", "Consumed"].map((option) => (
          <MenuItem key={option} onClick={() => handleClose(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default function QuickFilteringGrid() {
  const [rows, setRows] = useState([])

  const fetchTableData = async () => {
    try {
      const response = await axios.get(`${baseURL}/user/get-user`)
      const rawData = response?.data?.data?.filter(
        (item) => item.status === "Issued"
      )

      // Group data by user name
      const groupedData = rawData.reduce((acc, user, index) => {
        const existingUser = acc.find((item) => item._id === user._id)

        const componentNames = user.components
          .map((comp) => comp.componentName)
          .join(", ")
        const specifications = user.components
          .map((comp) => comp.specification)
          .join(", ")
        const quantities = user.components
          .map((comp) => comp.quantity)
          .join(", ")

        if (existingUser) {
          existingUser.components += `, ${componentNames}`
          existingUser.specification += `, ${specifications}`
          existingUser.quantity += `, ${quantities}`
        } else {
          acc.push({
            id: index + 1,
            _id: user._id,
            email: user.email,
            batch: user.batch,
            category: user.category,
            idNumber: user.idNumber,
            name: user.name,
            branch: user.branch,
            mobile: user.mobile,
            labNumber: user.labNumber,
            components: componentNames,
            specification: specifications,
            quantity: quantities,
            status: user.status,
            createdAt: new Date(user.createdAt).toLocaleString(),
          })
        }

        return acc
      }, [])

      setRows(groupedData)
    } catch (error) {
      console.log("Error fetching data", error)
    }
  }

  useEffect(() => {
    fetchTableData()
  }, [])

  return (
    <Box sx={{ width: "100%", p: 1, mt: 1.5 }}>
      <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
        Issued Table
      </Typography>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          // columns={columns}
          columns={columns.map((col) =>
            col.field === "status"
              ? {
                  ...col,
                  renderCell: (params) => (
                    <EditableStatusCell
                      params={params}
                      refreshData={fetchTableData}
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
                fileName: "Issued Inventory Record", //custom file name here
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
