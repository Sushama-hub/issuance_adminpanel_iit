import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"; // Import Dropdown Icon
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
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
    editable: true,
    renderCell: (params) => <EditableStatusCell params={params} />,
  },
  {
    field: "remark",
    headerName: "Remark",
    flex: 0,
    editable: false,
    width: 120,
  },
  { field: "createdAt", headerName: "Created At", flex: 1, editable: false },
];

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

// Custom Component for Editable Status Cell
const EditableStatusCell = ({ params, refreshData }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = async (status) => {
    console.log("status--->", status);
    setAnchorEl(null);
    if (status && status !== params.value) {
      try {
        const response = await axios.put(
          `${baseURL}/user/update-status/${params.row._id}`,
          {
            status: status,
          }
        );
        console.log("response", response);

        // refresh the table
        refreshData();
      } catch (error) {
        console.error("Error updating status", error);
      }
    }
  };

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
  );
};

export default function QuickFilteringGrid() {
  const [rows, setRows] = useState([]);

  const fetchTableData = async () => {
    try {
      const response = await axios.get(`${baseURL}/user/get-user`);

      const filteredData = response?.data?.data
        ?.filter((item) => item.status === "Issued")
        ?.map((item, index) => {
          const date = new Date(item.createdAt);
          const date2 = new Date(item.updatedAt);
          const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, ${date.toLocaleTimeString()}`;
          const formattedDate2 = `${date2.getDate()}/${date2.getMonth() + 1}/${date2.getFullYear()}, ${date2.toLocaleTimeString()}`;

          return {
            id: index + 1, // Ensure unique id
            _id: item._id,
            email: item.email,
            batch: item.batch,
            category: item.category,
            idNumber: item.idNumber,
            name: item.name,
            branch: item.branch,
            mobile: item.mobile,
            components: item.components, // ✅ Fix property name
            specification: item.specification,
            quantity: item.quantity,
            status: item.status,
            remark: item.remark,
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
        Issued Table
      </Typography>
      <Box sx={{ height: 400, width: "100%" }}>
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
