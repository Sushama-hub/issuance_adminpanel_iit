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
    editable: false,
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

      const rawData = response?.data?.data?.filter(
        (item) => item.status === "Returned" || item.status === "Consumed"
      );

      const groupedData = rawData.reduce((acc, user) => {
        const existingUser = acc.find((item) => item._id === user._id);

        const componentNames = user.components
          .map((comp) => comp.componentName)
          .join(", ");
        const specifications = user.components
          .map((comp) => comp.specification)
          .join(", ");
        const quantities = user.components
          .map((comp) => comp.quantity)
          .join(", ");

        const createdDate = new Date(user.createdAt);
        const updatedDate = new Date(user.updatedAt);

        const formattedCreatedAt = `${createdDate.getDate()}/${
          createdDate.getMonth() + 1
        }/${createdDate.getFullYear()}, ${createdDate.toLocaleTimeString()}`;

        const formattedUpdatedAt = `${updatedDate.getDate()}/${
          updatedDate.getMonth() + 1
        }/${updatedDate.getFullYear()}, ${updatedDate.toLocaleTimeString()}`;

        if (existingUser) {
          existingUser.components += `, ${componentNames}`;
          existingUser.specification += `, ${specifications}`;
          existingUser.quantity += `, ${quantities}`;
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
            components: componentNames, // Only component names
            specification: specifications, // Separate field for specification
            quantity: quantities, // Separate field for quantity
            status: user.status,
            createdAt: formattedCreatedAt, // Formatted createdAt
            updatedAt: formattedUpdatedAt, // Formatted updatedAt
            updatedAtTimestamp: updatedDate.getTime(), // Timestamp for sorting
          });
        }

        return acc;
      }, []);

      // Sort data by latest updatedAt timestamp
      const sortedData = groupedData
        .sort((a, b) => b.updatedAtTimestamp - a.updatedAtTimestamp)
        .map((item, index) => ({ ...item, id: index + 1 }));

      setRows(sortedData);
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  // const fetchTableData = async () => {
  //   try {
  //     const response = await axios.get(`${baseURL}/user/get-user`);

  //     const rawData = response?.data?.data?.filter(
  //       (item) => item.status === "Returned" || item.status === "Consumed"
  //     );

  //     const groupedData = rawData.reduce((acc, user, index) => {
  //       const existingUser = acc.find((item) => item._id === user._id);

  //       const componentNames = user.components
  //         .map((comp) => comp.componentName)
  //         .join(", ");
  //       const specifications = user.components
  //         .map((comp) => comp.specification)
  //         .join(", ");
  //       const quantities = user.components
  //         .map((comp) => comp.quantity)
  //         .join(", ");

  //       if (existingUser) {
  //         existingUser.components += `, ${componentNames}`;
  //         existingUser.specification += `, ${specifications}`;
  //         existingUser.quantity += `, ${quantities}`;
  //       } else {
  //         acc.push({
  //           id: index + 1,
  //           _id: user._id,
  //           email: user.email,
  //           batch: user.batch,
  //           category: user.category,
  //           idNumber: user.idNumber,
  //           name: user.name,
  //           branch: user.branch,
  //           mobile: user.mobile,
  //           components: componentNames, // Only component names
  //           specification: specifications, // Separate field for specification
  //           quantity: quantities, // Separate field for quantity
  //           status: user.status,
  //           createdAt: new Date(user.createdAt).toLocaleString(),
  //         });
  //       }

  //       return acc;
  //     }, []);

  //     setRows(groupedData);
  //   } catch (error) {
  //     console.log("Error fetching data", error);
  //   }
  // };

  useEffect(() => {
    fetchTableData();
  }, []);

  return (
    <Box sx={{ width: "100%", height: "100%", p: 1, marginTop: 3.5 }}>
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
