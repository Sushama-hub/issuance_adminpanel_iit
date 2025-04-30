import * as React from "react"
import Box from "@mui/material/Box"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import { useEffect, useState } from "react"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { Button, Typography } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"

const columns = [
  {
    field: "id",
    headerName: "SNo.",
    editable: false,
    width: 55,
  },
  {
    field: "ledgerNo",
    headerName: "Ledger No",
    flex: 0,
    editable: false,
    width: 89,
  },
  {
    field: "poRefNoDate",
    headerName: "PO.No./Ref.No. & Date",
    flex: 0,
    editable: false,
    width: 170,
  },
  {
    field: "receivedFrom",
    headerName: "Received From",
    flex: 0,
    editable: false,
    width: 120,
  },
  {
    field: "itemDescription",
    headerName: "Item Description",
    flex: 0,
    editable: false,
    width: 126,
  },
  {
    field: "groundBalance",
    headerName: "Ground Balance",
    flex: 0,
    editable: false,
    width: 126,
  },
  {
    field: "ledgerBalance",
    headerName: "Ledger Balance",
    flex: 0,
    editable: false,
    width: 125,
  },
  {
    field: "qtyUnit",
    headerName: "Qty Unit",
    flex: 0,
    editable: false,
    width: 80,
  },
  {
    field: "fundingHead",
    headerName: "Funding Head",
    flex: 0,
    editable: false,
    width: 112,
  },
  {
    field: "projectCode",
    headerName: "Project Code",
    flex: 0,
    editable: false,
    width: 105,
  },
  {
    field: "amountInclGST",
    headerName: "Amount(Include GST)",
    flex: 0,
    editable: false,
    width: 165,
  },
  {
    field: "location",
    headerName: "location(Room No)",
    flex: 0,
    editable: false,
    width: 145,
  },
  {
    field: "qty",
    headerName: "Qty",
    flex: 0,
    editable: false,
    width: 50,
  },
  {
    field: "rate",
    headerName: "Rate",
    flex: 0,
    editable: false,
    width: 60,
  },
  {
    field: "value",
    headerName: "Value",
    flex: 0,
    editable: false,
    width: 60,
  },
  {
    field: "capitalizedFinancialYear",
    headerName: "Capitalized Financial Year",
    flex: 0,
    editable: false,
    width: 187,
  },
  {
    field: "remarksStockAuthority",
    headerName: "Remarks Stock Authority",
    flex: 0,
    editable: false,
    width: 180,
  },
  {
    field: "remarksHODHOC",
    headerName: "Remarks Of HOD/HOC",
    flex: 0,
    editable: false,
    width: 170,
  },
  {
    field: "caOrder",
    headerName: "Order Of CA",
    flex: 0,
    editable: false,
    width: 115,
  },
  {
    field: "assetCode",
    headerName: "Asset Code",
    flex: 0,
    editable: false,
    width: 100,
  },
  {
    field: "finalSupplyDate",
    headerName: "Final Supply/ Installation Date",
    flex: 0,
    editable: false,
    width: 220,
  },
  {
    field: "assetHead",
    headerName: "Asset Head",
    flex: 0,
    editable: false,
    width: 100,
  },
  {
    field: "billInvoiceNoDate",
    headerName: "Bill/Invoice No. & Date",
    flex: 0,
    editable: false,
    width: 170,
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
  const location = useLocation()
  const navigate = useNavigate()

  const queryParams = new URLSearchParams(location.search)
  const selectedYear = queryParams.get("year")

  const fetchTableData = async (year) => {
    if (!year) return // exit if year is not selected
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(
        `${baseURL}/nonConsumableStock/nonConsumableStockFilter/${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const rowsWithId = response?.data?.data?.map((item, index) => ({
        ...item,
        id: index + 1,
        createdAt: new Date(item.createdAt).toLocaleString(),
        // updatedAt: new Date(user.updatedAt).toLocaleString(),
      }))

      setRows(rowsWithId)
    } catch (error) {
      console.log("Error fetching data", error)
    }
  }

  useEffect(() => {
    if (selectedYear) {
      fetchTableData(selectedYear)
    }
  }, [selectedYear])

  const storedUser = JSON.parse(localStorage.getItem("user"))

  const routeBase =
    storedUser?.role === "master"
      ? "/dashboard/master/non_consumable_form"
      : "/dashboard/admin/non_consumable_form"

  return (
    <Box sx={{ width: "100%", p: 1, mt: 1.5 }}>
      {selectedYear ? (
        <>
          <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
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

          {rows.length === 0 && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography variant="body1" color="text.secondary">
                No data available for this financial year. Please first fill the
                form for this year {selectedYear}. To view data, click the year
                chip.
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
              columns={columns}
              // columns={columns.map((col) =>
              //   col.field === "status"
              //     ? {
              //         ...col,
              //         renderCell: (params) => (
              //           <EditableStatusCell
              //             params={params}
              //             refreshData={fetchTableData}
              //           />
              //         ),
              //       }
              //     : col
              // )}
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
                  csvOptions: { disableToolbarButton: false },
                  printOptions: { disableToolbarButton: false },
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
            Please select a year to view the Non Consumable Stock Table, or fill
            the Non Consumable Form to add new data if needed.
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
  )
}
