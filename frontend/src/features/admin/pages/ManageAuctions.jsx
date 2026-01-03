import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuctionManagement from "./Dashboard/sub-components/AuctionManagement";
import AdminLayout from "../layout/AdminLayout";

const ManageAuctions = () => {
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
      title="Manage Auctions"
      subtitle="Create, update, approve, and control auctions"
    >
      <AuctionManagement />
    </AdminLayout>
  );
};

export default ManageAuctions;
