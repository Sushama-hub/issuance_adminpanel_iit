import { Routes, Route, Navigate } from "react-router-dom";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardMaster from "./pages/DashboardMaster";
import IssuedTable from "./components/IssuedTable";
import ReturnedAndConsumedTable from "./components/ReturnedAndConsumedTable";
import InventoryForm from "./components/InventoryForm";
import InventoryFormTable from "./components/InventoryFormTable";
import Login from "./components/Login";
import Register from "./components/Register";
import UserForm from "./components/UserForm";
import MiniDrawer from "./layouts/Drawer";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  console.log("ProtectedRoute token check:", token);
  return token ? children : <Navigate to="/login" replace />;
};

const AuthRedirect = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={
              <AuthRedirect>
                <Login />
              </AuthRedirect>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MiniDrawer />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardMaster />} />
            <Route path="/dashboard" element={<DashboardAdmin />} />
            <Route path="/issued_records" element={<IssuedTable />} />
            <Route
              path="/returned_consumed"
              element={<ReturnedAndConsumedTable />}
            />
            <Route path="/inventory_form" element={<InventoryForm />} />
            <Route path="/inventory_records" element={<InventoryFormTable />} />
          </Route>

          <Route path="/user_form" element={<UserForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
