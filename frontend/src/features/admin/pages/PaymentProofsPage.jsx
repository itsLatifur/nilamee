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
    } else {
      dispatch(getAllPaymentProofs());
      dispatch(clearAllSuperAdminSliceErrors());
    }
  }, [isAuthenticated, user]);

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
