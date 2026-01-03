import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreateAdmin from "./Dashboard/sub-components/CreateAdmin";
import AdminLayout from "../layout/AdminLayout";

const ManageRoles = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (
      !(
        isAuthenticated &&
        (user?.role === "Super Admin" || user?.role === "Admin")
      )
    ) {
      navigateTo("/");
    }
  }, [isAuthenticated, user]);

  return (
    <AdminLayout
      title="Manage Roles"
      subtitle="Assign and revoke admin privileges"
    >
      <CreateAdmin />
    </AdminLayout>
  );
};

export default ManageRoles;
