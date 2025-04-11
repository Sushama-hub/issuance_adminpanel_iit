import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./pages/DashboardLayout";
import IssuedTable from "./components/IssuedTable";
import ReturnedAndConsumedTable from "./components/ReturnedAndConsumedTable";
import InventoryForm from "./components/InventoryForm";
import InventoryFormTable from "./components/InventoryFormTable";
import Login from "./components/Login";
import UserForm from "./components/UserForm";
import MiniDrawer from "./layouts/Drawer";

// ProtectedRoute: Blocks access to routes unless logged in
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  console.log("ProtectedRoute token check:", token); // Debug
  return token ? children : <Navigate to="/login" replace />;
};

// AuthRedirect: Redirects to dashboard if already logged in
const AuthRedirect = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          {/* Public Route: Login page */}
          {/* <Route
            path="/login"
            element={
              <AuthRedirect>
                <Login />
              </AuthRedirect>
            }
          /> */}

          {/* Protected Routes: Only accessible when token exists */}
          {/* <Route
            path="/"
            element={
              <ProtectedRoute>
                <MiniDrawer />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardLayout />} />
            <Route path="/issued_records" element={<IssuedTable />} />
            <Route
              path="/returned_consumed"
              element={<ReturnedAndConsumedTable />}
            />
            <Route path="/inventory_form" element={<InventoryForm />} />
            <Route path="/inventory_records" element={<InventoryFormTable />} />
          </Route> */}

          {/* Optional Public Route */}
          {/* <Route path="/user_form" element={<UserForm />} /> */}

          {/* Catch-all Route: Redirect to login */}
          {/* <Route path="*" element={<Navigate to="/login" />} /> */}

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
