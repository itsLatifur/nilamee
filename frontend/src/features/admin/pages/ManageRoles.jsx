import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RoleManagement from "./Dashboard/sub-components/RoleManagement";
import AdminLayout from "../layout/AdminLayout";

const ManageRoles = () => {
  const {
    user,
    isAuthenticated,
    loading: userLoading,
    hasCheckedAuth,
  } = useSelector((state) => state.user);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (
      hasCheckedAuth &&
      !(
        isAuthenticated &&
        (user?.role === "Super Admin" || user?.role === "Admin")
      )
    ) {
      navigateTo("/");
    }
  }, [hasCheckedAuth, isAuthenticated, user]);

  return (
    <AdminLayout
      title="Manage Roles"
      subtitle="Create custom roles and assign permissions"
    >
      <RoleManagement />
    </AdminLayout>
  );
};

export default ManageRoles;
