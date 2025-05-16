export const navigateToRoleBasedPath = (navigate, subPath) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  let basePath = "/dashboard/user";

  if (role === "master") {
    basePath = "/dashboard/master";
  } else if (role === "admin") {
    basePath = "/dashboard/admin";
  }

  navigate(`${basePath}/${subPath}`);
};
