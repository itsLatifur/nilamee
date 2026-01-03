import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuctionItemDelete from "./Dashboard/sub-components/AuctionItemDelete";
import AdminLayout from "../layout/AdminLayout";

const DatabaseControl = () => {
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
      title="Database Control"
      subtitle="Danger zone: irreversible deletions and data management"
    >
      <AuctionItemDelete />
    </AdminLayout>
  );
};

export default DatabaseControl;
