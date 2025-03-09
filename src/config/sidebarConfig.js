import TableViewIcon from "@mui/icons-material/TableView";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
export const sidebarConfig = {
  items: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: DashboardIcon,
      iconColor: "#f8fafc",
    },
    {
      id: "issued_records",
      label: "Issued Records",
      icon: TableViewIcon,
      iconColor: "#f8fafc",
    },
    {
      id: "returned_consumed",
      label: "Returned & Consumed",
      icon: AssignmentReturnIcon,
      iconColor: "#f8fafc",
    },
    {
      id: "inventory_form",
      label: "Inventory Form",
      icon: DynamicFormIcon,
      iconColor: "#f8fafc",
    },
    {
      id: "inventory_records",
      label: "Inventory Records",
      icon: InventoryIcon,
      iconColor: "#f8fafc",
    },
    { id: "logout", label: "Logout", icon: LogoutIcon, iconColor: "#f8fafc" },
  ],
};
