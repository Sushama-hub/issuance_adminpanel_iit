// import { Routes, Route, Navigate } from "react-router-dom";
// import DashboardAdmin from "./pages/DashboardAdmin";
// import DashboardMaster from "./pages/DashboardMaster";
// import IssuedTable from "./components/IssuedTable";
// import ReturnedAndConsumedTable from "./components/ReturnedAndConsumedTable";
// import InventoryForm from "./components/InventoryForm";
// import InventoryFormTable from "./components/InventoryFormTable";
// import Login from "./components/Login";
// import Register from "./components/Register";
// import UserForm from "./components/UserForm";
// import MiniDrawer from "./layouts/Drawer";

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   console.log("ProtectedRoute token check:", token);
//   return token ? children : <Navigate to="/login" replace />;
// };

// const AuthRedirect = ({ children }) => {
//   const token = localStorage.getItem("token");
//   return token ? <Navigate to="/dashboard" replace /> : children;
// };

// function App() {
//   return (
//     <>
//       <div className="App">
//         <Routes>
//           <Route
//             path="/login"
//             element={
//               <AuthRedirect>
//                 <Login />
//               </AuthRedirect>
//             }
//           />

//           <Route
//             path="/"
//             element={
//               <ProtectedRoute>
//                 <MiniDrawer />
//               </ProtectedRoute>
//             }
//           >
//             <Route path="/dashboard" element={<DashboardMaster />} />
//             <Route path="/dashboard" element={<DashboardAdmin />} />
//             <Route path="/issued_records" element={<IssuedTable />} />
//             <Route
//               path="/returned_consumed"
//               element={<ReturnedAndConsumedTable />}
//             />
//             <Route path="/inventory_form" element={<InventoryForm />} />
//             <Route path="/inventory_records" element={<InventoryFormTable />} />
//           </Route>

//           <Route path="/user_form" element={<UserForm />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="*" element={<Navigate to="/login" />} />
//         </Routes>
//       </div>
//     </>
//   );
// }

// export default App;

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

const getUserFromStorage = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = getUserFromStorage();

  if (!token || !user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const AuthRedirect = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = getUserFromStorage();

  if (token && user) {
    if (user.role === "master")
      return <Navigate to="/dashboard/master" replace />;
    if (user.role === "admin")
      return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/dashboard/user" replace />;
  }

  return children;
};

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/user_form" element={<UserForm />} />

        {/* Role-Based Dashboards */}
        <Route
          path="/dashboard/master"
          element={
            <ProtectedRoute allowedRoles={["master"]}>
              <MiniDrawer>
                <DashboardMaster />
              </MiniDrawer>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["admin", "master"]}>
              <MiniDrawer>
                <DashboardAdmin />
              </MiniDrawer>
            </ProtectedRoute>
          }
        />

        {/* Protected Routes for Admin & Master */}
        <Route
          path="/issued_records"
          element={
            <ProtectedRoute allowedRoles={["admin", "master"]}>
              <MiniDrawer>
                <IssuedTable />
              </MiniDrawer>
            </ProtectedRoute>
          }
        />
        <Route
          path="/returned_consumed"
          element={
            <ProtectedRoute allowedRoles={["admin", "master"]}>
              <MiniDrawer>
                <ReturnedAndConsumedTable />
              </MiniDrawer>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory_form"
          element={
            <ProtectedRoute allowedRoles={["admin", "master"]}>
              <MiniDrawer>
                <InventoryForm />
              </MiniDrawer>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory_records"
          element={
            <ProtectedRoute allowedRoles={["admin", "master"]}>
              <MiniDrawer>
                <InventoryFormTable />
              </MiniDrawer>
            </ProtectedRoute>
          }
        />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
