import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";

const columns = [
  {
    field: "id",
    headerName: "SNo.",
    flex: 0,
    editable: false,
    width: 100,
  },
  {
    field: "componentName",
    headerName: "Component Name",
    flex: 1,
    editable: false,
  },
  {
    field: "specification",
    headerName: "Specification",
    flex: 1,
    editable: false,
  },
  { field: "quantity", headerName: "Quantity", flex: 1, editable: false },
  { field: "createdAt", headerName: "Created At", flex: 1, editable: false },
];

export default function QuickFilteringGrid() {
  const [rows, setRows] = useState([]);
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

  const fetchTableData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/inventory`);

      console.log("response", response);

      // Ensure each row has a unique id
      const dataWithId = response?.data?.data?.map((item, index) => {
        const date = new Date(item.createdAt);
        const date2 = new Date(item.updatedAt);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, ${date.toLocaleTimeString()}`;
        const formattedDate2 = `${date2.getDate()}/${date2.getMonth() + 1}/${date2.getFullYear()}, ${date2.toLocaleTimeString()}`;

        return {
          id: item.id || index + 1, // Use API id or fallback to index
          ...item,
          createdAt: formattedDate,
          updatedAt: formattedDate2,
        };
      });
      console.log("dataWithId", dataWithId);
      setRows(dataWithId);
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  return (
    <Box sx={{ width: "100%", height: "100vh", p: 1 }}>
      <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
        Inventory Table
      </Typography>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
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
              csvOptions: { disableToolbarButton: false },
              printOptions: { disableToolbarButton: false },
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
        />
      </Box>
    </Box>
  );
}
