import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserManagement from "./Dashboard/sub-components/UserManagement";
import AdminLayout from "../layout/AdminLayout";

const ManageUsers = () => {
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
      title="Manage Users"
      subtitle="Search, review, and control user accounts"
    >
      <UserManagement />
    </AdminLayout>
  );
};

export default ManageUsers;
