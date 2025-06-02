import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { ReturnedAndConsumedColumns } from "../config/tableConfig";
import ReIssueLogDialog from "./dialog/ReIssueLogDialog";
import { apiRequest } from "../utils/api";

export default function QuickFilteringGrid() {
  const [rows, setRows] = useState([]);

  const fetchTableData = async () => {
    try {
      const response = await apiRequest.get("/user/return-component");

      const rowsWithId = response?.data?.data?.map((user, index) => ({
        ...user,
        id: index + 1,
        email: user.userForm_id.email,
        name: user.userForm_id.name,
        batch: user.userForm_id.batch,
        idNumber: user.userForm_id.idNumber,
        category: user.userForm_id.category,
        branch: user.userForm_id.branch,
        mobile: user.userForm_id.mobile,
        labNumber: user.userForm_id.labNumber,
        updatedAt: new Date(user.updatedAt).toLocaleString(),
      }));

      // Sort data by latest updatedAt timestamp
      const sortedData = rowsWithId
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .map((item, index) => ({
          ...item,
          id: index + 1,
        }));

      setRows(sortedData);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  return (
    <Box sx={{ width: "100%", p: 1, mt: 1.5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }} mb={2}>
        <Typography variant="h5" color="primary" fontWeight="bold">
          Returned / Consumed Table
        </Typography>
        <ReIssueLogDialog />
      </Box>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={ReturnedAndConsumedColumns}
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
          sx={dataGridStyles}
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
  );
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
};
