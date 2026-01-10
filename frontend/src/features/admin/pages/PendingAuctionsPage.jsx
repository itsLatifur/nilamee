import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PendingAuctions from "./Dashboard/sub-components/PendingAuctions";
import AdminLayout from "../layout/AdminLayout";

const PendingAuctionsPage = () => {
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
      title="Pending Auctions"
      subtitle="Review and approve new auction submissions"
    >
      <PendingAuctions />
    </AdminLayout>
  );
};

export default PendingAuctionsPage;
