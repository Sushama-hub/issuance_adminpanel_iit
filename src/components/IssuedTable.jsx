import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { IssuedColumns } from "../config/tableConfig";
import { apiRequest } from "../utils/api";
import EntryFormButton from "./EntryFormButton";
import ViewDialog from "./dialog/ViewDialog";

export default function QuickFilteringGrid() {
  const [rows, setRows] = useState([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [allTableData, setAllTableData] = useState([]);

  const fetchTableData = async () => {
    try {
      const response = await apiRequest.get("/user/get-user");

      // const rawData = response?.data?.data?.filter(
      //   (item) => item.status === "Issued"
      // );

      const rawData = response?.data?.data
        ?.map((item) => {
          const issuedComponents = item?.components.filter(
            (comp) => comp.status === "Issued"
          );
          if (issuedComponents.length > 0) {
            return {
              ...item,
              components: issuedComponents,
            };
          }
          return null;
        })
        .filter(Boolean); // remove nulls

      // console.log("Only issued components:", rawData);
      setAllTableData(rawData);

      // Group data by user name
      const groupedData = rawData.reduce((acc, user, index) => {
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
        // --- output --- "Issued, Issued" → "Issued" (no duplicates).
        const componentsStatus = [
          ...new Set(user.components.map((comp) => comp.status)),
        ].join(", ");

        if (existingUser) {
          existingUser.componentName += `, ${componentNames}`;
          existingUser.specification += `, ${specifications}`;
          existingUser.quantity += `, ${quantities}`;
          existingUser.status += `, ${componentsStatus}`;
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
            componentName: componentNames,
            specification: specifications,
            quantity: quantities,
            status: componentsStatus,
            createdAt: new Date(user.createdAt).toLocaleString(),
          });
        }

        return acc;
      }, []);

      setRows(groupedData);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const handleView = (row) => {
    setSelectedRow(row);
    setViewOpen(true);
  };

  return (
    <>
      <Box sx={{ width: "100%", p: 1, mt: 1.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }} mb={2}>
          <Typography variant="h5" color="primary" fontWeight="bold">
            Issued Table
          </Typography>
          <EntryFormButton actionType="issue" />
        </Box>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={IssuedColumns?.map((col) =>
              col.field === "actions"
                ? {
                    ...col,
                    renderCell: (params) => (
                      <Box>
                        <Tooltip title="View Details" placement="right">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleView(params.row)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ),
                  }
                : col
            )}
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

      {/* View Dialog */}
      <ViewDialog
        title="View Details"
        open={viewOpen}
        setOpen={setViewOpen}
        selectedRow={selectedRow}
        allTableData={allTableData}
        fetchTableData={fetchTableData}
      />
    </>
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
