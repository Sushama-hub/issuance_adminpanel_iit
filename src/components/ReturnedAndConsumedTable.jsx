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
    // flex: 1,
    editable: false,
    width: 55,
  },
  { field: "email", headerName: "Email", flex: 0, editable: false, width: 130 },
  { field: "batch", headerName: "Batch", flex: 0, editable: false, width: 60 },
  {
    field: "category",
    headerName: "Category",
    flex: 0,
    editable: false,
    width: 100,
  },
  {
    field: "idNumber",
    headerName: "ID Number",
    flex: 0,
    editable: false,
    width: 100,
  },
  { field: "name", headerName: "Name", flex: 0, editable: false, width: 120 },
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
    field: "components",
    headerName: "Components",
    flex: 0,
    editable: false,
    width: 100,
  },
  {
    field: "specification",
    headerName: "specification",
    flex: 0,
    editable: false,
    width: 100,
  },
  {
    field: "quantity",
    headerName: "quantity",
    flex: 0,
    editable: false,
    width: 75,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 0,
    editable: false,
  },
  {
    field: "remark",
    headerName: "Remark",
    flex: 0,
    editable: false,
    width: 120,
  },
  {
    field: "updatedAt",
    headerName: "UpdatedAt At",
    flex: 0,
    editable: false,
    width: 120,
  },
];

// Custom Component for Editable Status Cell

export default function QuickFilteringGrid() {
  const [rows, setRows] = useState([]);

  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

  const fetchTableData = async () => {
    try {
      const response = await axios.get(`${baseURL}/user/get-user`);

      const filteredData = response?.data?.data
        ?.filter(
          (item) => item.status === "Returned" || item.status === "Consumed"
        )
        ?.map((item, index) => {
          const date = new Date(item.createdAt);
          const date2 = new Date(item.updatedAt);
          const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, ${date.toLocaleTimeString()}`;
          const formattedDate2 = `${date2.getDate()}/${date2.getMonth() + 1}/${date2.getFullYear()}, ${date2.toLocaleTimeString()}`;

          return {
            id: index + 1,
            _id: item._id,
            email: item.email,
            batch: item.batch,
            category: item.category,
            idNumber: item.idNumber,
            name: item.name,
            branch: item.branch,
            mobile: item.mobile,
            components: item.components,
            specification: item.specification,
            quantity: item.quantity,
            status: item.status,
            remark: item.remark,
            // createdAt: new Date(item.createdAt).toLocaleString(),
            createdAt: formattedDate,
            updatedAt: formattedDate2,
          };
        });

      setRows(filteredData);
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  return (
    <Box sx={{ width: "100%", height: "100%", p: 1 }}>
      <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
        Returned / Consumed Table
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
    </Box>
  );
}
