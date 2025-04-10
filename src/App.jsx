import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./pages/DashboardLayout";
import IssuedTable from "./components/IssuedTable";
import ReturnedAndConsumedTable from "./components/ReturnedAndConsumedTable";
import InventoryForm from "./components/InventoryForm";
import InventoryFormTable from "./components/InventoryFormTable";
import Login from "./components/Login";
import UserForm from "./components/UserForm";
import MiniDrawer from "./layouts/Drawer";

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/user_form" element={<UserForm />} />
          <Route path="/" element={<MiniDrawer />}>
            <Route path="/dashboard" element={<DashboardLayout />} />
            <Route path="/issued_records" element={<IssuedTable />} />
            <Route
              path="/returned_consumed"
              element={<ReturnedAndConsumedTable />}
            />
            <Route path="/inventory_form" element={<InventoryForm />} />
            <Route path="/inventory_records" element={<InventoryFormTable />} />
          </Route>
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
