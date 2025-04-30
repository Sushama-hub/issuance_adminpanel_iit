import TableViewIcon from "@mui/icons-material/TableView"
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn"
import DynamicFormIcon from "@mui/icons-material/DynamicForm"
import InventoryIcon from "@mui/icons-material/Inventory"
import LogoutIcon from "@mui/icons-material/Logout"
import DashboardIcon from "@mui/icons-material/Dashboard"
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount"
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"
import AddBoxIcon from "@mui/icons-material/AddBox"
import Inventory2Icon from "@mui/icons-material/Inventory2"

export const sidebarConfig = {
  items: [
    {
      id: "/",
      label: "Dashboard",
      icon: DashboardIcon,
      iconColor: "#f8fafc",
      path: "/",
    },
    {
      id: "issued_records",
      label: "Issued Records",
      icon: TableViewIcon,
      iconColor: "#f8fafc",
      path: "issued_records",
    },
    {
      id: "returned_consumed",
      label: "Returned & Consumed",
      icon: AssignmentReturnIcon,
      iconColor: "#f8fafc",
      path: "returned_consumed",
    },
    {
      id: "inventory_form",
      label: "Inventory Form",
      // icon: DynamicFormIcon,
      icon: AddBoxIcon,
      iconColor: "#f8fafc",
      path: "inventory_form",
    },
    {
      id: "inventory_records",
      label: "Inventory Records",
      // icon: InventoryIcon,
      icon: Inventory2Icon,
      iconColor: "#f8fafc",
      path: "inventory_records",
    },

    {
      id: "non_consumable_form",
      label: "Non Consumable Form",
      icon: DynamicFormIcon,
      iconColor: "#f8fafc",
      path: "non_consumable_form",
    },
    // {
    //   id: "non_consumable_stock",
    //   label: "Non Consumable Stock",
    //   icon: InventoryIcon,
    //   iconColor: "#f8fafc",
    //   path: "non_consumable_stock",
    // },

    {
      id: "admin_records",
      label: "Admin Records",
      // icon: SupervisorAccountIcon,
      icon: AdminPanelSettingsIcon,
      iconColor: "#f8fafc",
      path: "admin_records",
    },
    {
      id: "logout",
      label: "Logout",
      icon: LogoutIcon,
      iconColor: "#f8fafc",
      path: "login",
    },
  ],
}
