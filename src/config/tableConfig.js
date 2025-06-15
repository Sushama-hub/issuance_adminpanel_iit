export const IssuedColumns = [
  {
    field: "id",
    headerName: "SNo.",
    editable: false,
    width: 55,
  },
  { field: "email", headerName: "Email", flex: 0, editable: false, width: 130 },
  { field: "name", headerName: "Name", flex: 0, editable: false, width: 120 },
  { field: "batch", headerName: "Batch", flex: 0, editable: false, width: 60 },
  {
    field: "idNumber",
    headerName: "ID Number",
    flex: 0,
    editable: false,
    width: 100,
  },
  {
    field: "category",
    headerName: "Category",
    flex: 0,
    editable: false,
    width: 100,
  },
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
    field: "labNumber",
    headerName: "Lab Number",
    flex: 0,
    editable: false,
    width: 105,
  },
  {
    field: "componentName",
    headerName: "Component Name",
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
    // renderCell: (params) => <EditableStatusCell params={params} />,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    flex: 0,
    editable: false,
    width: 120,
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 0,
    editable: false,
    width: 100,
  },
];

export const ReturnedAndConsumedColumns = [
  {
    field: "id",
    headerName: "SNo.",
    editable: false,
    width: 55,
  },
  { field: "email", headerName: "Email", flex: 0, editable: false, width: 130 },
  { field: "name", headerName: "Name", flex: 0, editable: false, width: 120 },
  { field: "batch", headerName: "Batch", flex: 0, editable: false, width: 60 },
  {
    field: "idNumber",
    headerName: "ID Number",
    flex: 0,
    editable: false,
    width: 100,
  },
  {
    field: "category",
    headerName: "Category",
    flex: 0,
    editable: false,
    width: 100,
  },
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
    field: "labNumber",
    headerName: "Lab Number",
    flex: 0,
    editable: false,
    width: 105,
  },
  {
    field: "componentName",
    headerName: "component Name",
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
  {
    field: "actions",
    headerName: "Actions",
    flex: 0,
    editable: false,
    width: 100,
  },
];

export const InventoryColumns = [
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
  {
    field: "actions",
    headerName: "Actions",
    flex: 0.5,
    sortable: false,
    filterable: false,
    // renderCell: (params) => (
    //   <Box sx={{ display: "flex", gap: 1 }}>
    //     <IconButton
    //       color="primary"
    //       onClick={() => handleEdit(params.row)}
    //       size="small"
    //     >
    //       <EditIcon fontSize="small" />
    //     </IconButton>
    //     {user && user?.role === "master" && (
    //       <IconButton
    //         color="error"
    //         onClick={() => handleDelete(params.row._id)}
    //         size="small"
    //       >
    //         <DeleteIcon fontSize="small" />
    //       </IconButton>
    //     )}
    //   </Box>
    // ),
  },
];

export const NonConsumableColumns = [
  {
    field: "id",
    headerName: "SNo.",
    editable: false,
    width: 55,
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 0,
    sortable: false,
    filterable: false,
    width: 80,
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
];

export const AdminColumns = [
  {
    field: "id",
    headerName: "SNo.",
    editable: false,
    width: 55,
  },
  { field: "name", headerName: "Name", flex: 0, editable: false, width: 130 },
  {
    field: "email",
    headerName: "Email",
    flex: 0,
    editable: false,
    width: 200,
  },
  {
    field: "mobile",
    headerName: "Mobile",
    flex: 0,
    editable: false,
    width: 120,
  },
  { field: "role", headerName: "Role", flex: 0, editable: false, width: 80 },
  {
    field: "department",
    headerName: "Department",
    flex: 0,
    editable: false,
    width: 120,
  },
  {
    field: "active",
    headerName: "Active",
    flex: 0,
    editable: false,
    width: 100,
    // renderCell: (params) => <ToggleActiveCell params={params} />,
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 0,
    sortable: false,
    filterable: false,
    width: 70,
  },
  // {
  //   field: "createdAt",
  //   headerName: "Created At",
  //   flex: 1,
  //   editable: false,
  // },
  {
    field: "updatedAt",
    headerName: "Updated At",
    flex: 1,
    editable: false,
  },
];

export const ReIssueLogColumns = [
  {
    field: "id",
    headerName: "SNo.",
    editable: false,
    width: 55,
  },
  {
    field: "changed_by_name",
    headerName: "Changed By (Name)",
    flex: 0,
    editable: false,
    width: 120,
  },
  {
    field: "changed_by_email",
    headerName: "Changed By (Email)",
    flex: 0,
    editable: false,
    width: 230,
  },
  {
    field: "changed_by_role",
    headerName: "Role of User",
    flex: 0,
    editable: false,
    width: 80,
  },
  {
    field: "component_name",
    headerName: "Component Name",
    flex: 0,
    editable: false,
    width: 200,
  },
  {
    field: "specification",
    headerName: "specification",
    flex: 0,
    editable: false,
    width: 200,
  },
  {
    field: "previous_status",
    headerName: "Previous Status",
    flex: 0,
    editable: false,
    width: 100,
  },
  {
    field: "new_status",
    headerName: "New Status",
    flex: 0,
    sortable: false,
    filterable: false,
    width: 100,
  },
  {
    field: "createdAt",
    headerName: "Log Created At",
    flex: 1,
    editable: false,
  },
];
