import * as React from "react"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import { useEffect, useState } from "react"
import { Box, Typography } from "@mui/material"
import { ReIssueLogColumns } from "../config/tableConfig"

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL

export default function QuickFilteringGrid() {
  const [rows, setRows] = useState([])

  const fetchTableData = async () => {
    try {
      const response = await axios.get(`${baseURL}/user/reissue-logs`)

      const rowsWithId = response?.data?.data?.map((user, index) => ({
        ...user,
        id: index + 1,
        createdAt: new Date(user.createdAt).toLocaleString(),
      }))

      setRows(rowsWithId || [])
    } catch (error) {
      console.log("Error fetching data", error)
    }
  }

  useEffect(() => {
    fetchTableData()
  }, [])

  return (
    <Box sx={{ width: "100%", p: 0 }}>
      <Typography
        variant="h5"
        color="primary"
        textAlign="center"
        fontWeight="bold"
        textTransform="uppercase"
        sx={{ textDecoration: "underline" }}
        mb={5}
      >
        Re-Issue Log Details
      </Typography>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={ReIssueLogColumns}
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
                fileName: "Re-Issue Log Details", //custom file name here
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
}
