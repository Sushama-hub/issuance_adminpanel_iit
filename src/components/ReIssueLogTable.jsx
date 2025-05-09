import * as React from "react"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import { useEffect, useState } from "react"
import { Box, Typography } from "@mui/material"
import { ReIssueLogColumns } from "../config/tableConfig"
import ReIssueLogDialog from "./dialog/ReIssueLogDialog"

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL

export default function QuickFilteringGrid() {
  const [rows, setRows] = useState([])

  const fetchTableData = async () => {
    try {
      const response = await axios.get(`${baseURL}/user/get-user`)

      const rawData = response?.data?.data?.filter(
        (item) => item.status === "Returned" || item.status === "Consumed"
      )

      const groupedData = rawData.reduce((acc, user) => {
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

        const createdDate = new Date(user.createdAt)
        const updatedDate = new Date(user.updatedAt)

        const formattedCreatedAt = `${createdDate.getDate()}/${
          createdDate.getMonth() + 1
        }/${createdDate.getFullYear()}, ${createdDate.toLocaleTimeString()}`

        const formattedUpdatedAt = `${updatedDate.getDate()}/${
          updatedDate.getMonth() + 1
        }/${updatedDate.getFullYear()}, ${updatedDate.toLocaleTimeString()}`

        if (existingUser) {
          existingUser.components += `, ${componentNames}`
          existingUser.specification += `, ${specifications}`
          existingUser.quantity += `, ${quantities}`
        } else {
          acc.push({
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
            createdAt: formattedCreatedAt,
            updatedAt: formattedUpdatedAt,
            updatedAtTimestamp: updatedDate.getTime(),
          })
        }

        return acc
      }, [])

      // Sort data by latest updatedAt timestamp
      const sortedData = groupedData
        .sort((a, b) => b.updatedAtTimestamp - a.updatedAtTimestamp)
        .map((item, index) => ({ ...item, id: index + 1 }))

      setRows(sortedData)
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
