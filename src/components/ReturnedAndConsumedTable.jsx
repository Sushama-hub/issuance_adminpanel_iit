import * as React from "react"
import Box from "@mui/material/Box"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import { useEffect, useState } from "react"
import { Typography } from "@mui/material"
import { ReturnedAndConsumedColumns } from "../config/tableConfig"

export default function QuickFilteringGrid() {
  const [rows, setRows] = useState([])

  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL

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
    <Box sx={{ width: "100%", p: 1, mt: 1.5 }}>
      <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
        Returned / Consumed Table
      </Typography>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={ReturnedAndConsumedColumns}
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
                fileName: "Return Inventory Record", //custom file name here
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
