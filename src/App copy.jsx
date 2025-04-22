import { Routes, Route, Navigate } from "react-router-dom"
import DashboardAdmin from "./pages/DashboardAdmin"
import DashboardMaster from "./pages/DashboardMaster"
import IssuedTable from "./components/IssuedTable"
import ReturnedAndConsumedTable from "./components/ReturnedAndConsumedTable"
import InventoryForm from "./components/InventoryForm"
import InventoryFormTable from "./components/InventoryFormTable"
import Login from "./components/Login"
import Register from "./components/Register"
import UserForm from "./components/UserForm"
import MiniDrawer from "./layouts/Drawer"

const getUserFromStorage = () => {
  const user = localStorage.getItem("user")
  const expiresAt = localStorage.getItem("expiresAt")
  if (!user || !expiresAt) return null
  // return user ? JSON.parse(user) : null;

  const isExpired = new Date().getTime() > parseInt(expiresAt, 10)
  if (isExpired) {
    localStorage.clear()
    return null
  }

  return JSON.parse(user)
}

const hasTokenExpired = () => {
  const expiresAt = localStorage.getItem("expiresAt")
  return !expiresAt || new Date().getTime() > parseInt(expiresAt, 10)
}

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token")
  const user = getUserFromStorage()

  // (<Navigate to="/login" replace />), (<Navigate to="/register" replace />)
  if (!token || !user || hasTokenExpired()) {
    localStorage.clear()
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children

  // if (!token || !user) return <Navigate to="/login" replace />
  // if (allowedRoles && !allowedRoles.includes(user.role)) {
  //   return <Navigate to="/unauthorized" replace />
  // }

  // return children
}

const AuthRedirect = ({ children }) => {
  const token = localStorage.getItem("token")
  const user = getUserFromStorage()

  // if (token && user)
  if (token && user && !hasTokenExpired()) {
    if (user.role === "master")
      return <Navigate to="/dashboard/master" replace />
    if (user.role === "admin") return <Navigate to="/dashboard/admin" replace />
    return <Navigate to="/dashboard/user" replace />
  }

  return children
}

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
        <Route
          path="/register"
          element={
            <AuthRedirect>
              <Register />
            </AuthRedirect>
          }
        />
        <Route path="/user_form" element={<UserForm />} />
        {/* Role-Based Dashboards */}
        {/* Master Dashboard with nested routes inside MiniDrawer */}
        <Route
          path="/dashboard/master"
          element={
            <ProtectedRoute allowedRoles={["master"]}>
              <MiniDrawer />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardMaster />} />
          <Route path="issued_records" element={<IssuedTable />} />
          <Route
            path="returned_consumed"
            element={<ReturnedAndConsumedTable />}
          />
          <Route path="inventory_form" element={<InventoryForm />} />
          <Route path="inventory_records" element={<InventoryFormTable />} />
        </Route>

        {/* Admin Dashboard with nested routes inside MiniDrawer */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["admin", "master"]}>
              <MiniDrawer />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardAdmin />} />
          <Route path="issued_records" element={<IssuedTable />} />
          <Route
            path="returned_consumed"
            element={<ReturnedAndConsumedTable />}
          />
          <Route path="inventory_form" element={<InventoryForm />} />
          <Route path="inventory_records" element={<InventoryFormTable />} />
        </Route>
        {/* Catch All */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App

// ....................................................................
//add role and department based routing for user dashboard

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

// const getUserFromStorage = () => {
//   const user = localStorage.getItem("user");
//   return user ? JSON.parse(user) : null;
// };

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const token = localStorage.getItem("token");
//   const user = getUserFromStorage();

//   if (!token || !user) return <Navigate to="/login" replace />;
//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// };

// const AuthRedirect = ({ children }) => {
//   const token = localStorage.getItem("token");
//   const user = getUserFromStorage();

//   if (token && user) {
//     if (user.role === "master")
//       return <Navigate to="/dashboard/master" replace />;
//     if (user.role === "admin")
//       return <Navigate to={`/dashboard/admin/${user.department}`} replace />;
//     console.log("user.department", user.department);
//     return <Navigate to={`/dashboard/user/${user.department}`} replace />;
//   }

//   return children;
// };

// function App() {
//   return (
//     <div className="App">
//       <Routes>
//         {/* Public Routes */}
//         <Route
//           path="/login"
//           element={
//             <AuthRedirect>
//               <Login />
//             </AuthRedirect>
//           }
//         />
//         <Route path="/register" element={<Register />} />
//         <Route path="/user_form" element={<UserForm />} />

//         {/* Role-Based Dashboards */}
//         {/* Master Dashboard with Nested Routes */}
//         <Route
//           path="/dashboard/master"
//           element={
//             <ProtectedRoute allowedRoles={["master"]}>
//               <MiniDrawer>
//                 <DashboardMaster />
//               </MiniDrawer>
//             </ProtectedRoute>
//           }
//         >
//           <Route
//             path="issued_records"
//             element={
//               <ProtectedRoute allowedRoles={["master"]}>
//                 <IssuedTable />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="returned_consumed"
//             element={
//               <ProtectedRoute allowedRoles={["master"]}>
//                 <ReturnedAndConsumedTable />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="inventory_form"
//             element={
//               <ProtectedRoute allowedRoles={["master"]}>
//                 <InventoryForm />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="inventory_records"
//             element={
//               <ProtectedRoute allowedRoles={["master"]}>
//                 <InventoryFormTable />
//               </ProtectedRoute>
//             }
//           />
//         </Route>

//         {/* Admin Dashboard with Nested Routes */}
//         <Route
//           path="/dashboard/admin/:department"
//           element={
//             <ProtectedRoute allowedRoles={["admin", "master"]}>
//               <MiniDrawer>
//                 <DashboardAdmin />
//               </MiniDrawer>
//             </ProtectedRoute>
//           }
//         >
//           <Route
//             path="issued_records"
//             element={
//               <ProtectedRoute allowedRoles={["admin", "master"]}>
//                 <IssuedTable />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="returned_consumed"
//             element={
//               <ProtectedRoute allowedRoles={["admin", "master"]}>
//                 <ReturnedAndConsumedTable />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="inventory_form"
//             element={
//               <ProtectedRoute allowedRoles={["admin", "master"]}>
//                 <InventoryForm />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="inventory_records"
//             element={
//               <ProtectedRoute allowedRoles={["admin", "master"]}>
//                 <InventoryFormTable />
//               </ProtectedRoute>
//             }
//           />
//         </Route>

//         {/* User Dashboard with Department Specific Routes */}
//         <Route
//           path="/dashboard/user/:department"
//           element={
//             <ProtectedRoute allowedRoles={["user", "admin", "master"]}>
//               <MiniDrawer>
//                 <DashboardAdmin />{" "}
//                 {/* User can have their own dashboard if needed */}
//               </MiniDrawer>
//             </ProtectedRoute>
//           }
//         />

//         {/* Catch All */}
//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;
