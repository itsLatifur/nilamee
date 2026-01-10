import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PaymentProofs from "./Dashboard/sub-components/PaymentProofs";
import {
  getAllPaymentProofs,
  clearAllSuperAdminSliceErrors,
} from "../store/superAdminSlice";
import AdminLayout from "../layout/AdminLayout";

const PaymentProofsPage = () => {
  const dispatch = useDispatch();
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
    } else if (isAuthenticated && hasCheckedAuth) {
      dispatch(getAllPaymentProofs());
      dispatch(clearAllSuperAdminSliceErrors());
    }
  }, [hasCheckedAuth, isAuthenticated, user]);

  return (
    <AdminLayout
      title="Payment Proofs"
      subtitle="Inspect and verify commission payment proofs"
    >
      <PaymentProofs />
    </AdminLayout>
  );
};

export default PaymentProofsPage;
