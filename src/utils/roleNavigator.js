// export const navigateToInventoryForm = (navigate) => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const role = user?.role;

//   if (role === "master") {
//     navigate("/dashboard/master/inventory_form");
//   } else if (role === "admin") {
//     navigate("/dashboard/admin/inventory_form");
//   } else {
//     navigate("/dashboard/user/inventory_form");
//   }
// };

// utils/roleNavigator.js

export const navigateToRoleBasedPath = (navigate, subPath) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  let basePath = "/dashboard/user"; // default

  if (role === "master") {
    basePath = "/dashboard/master";
  } else if (role === "admin") {
    basePath = "/dashboard/admin";
  }

  navigate(`${basePath}/${subPath}`);
};
