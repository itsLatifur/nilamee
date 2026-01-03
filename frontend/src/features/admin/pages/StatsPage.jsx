import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PaymentGraph from "./Dashboard/sub-components/PaymentGraph";
import BiddersAuctioneersGraph from "./Dashboard/sub-components/BiddersAuctioneersGraph";
import { getMonthlyRevenue } from "../store/superAdminSlice";
import AdminLayout from "../layout/AdminLayout";

const StatsPage = () => {
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
      dispatch(getMonthlyRevenue());
    }
  }, [isAuthenticated, user]);

  return (
    <AdminLayout
      title="Stats"
      subtitle="Overview of revenue and user distribution"
    >
      <div className="flex flex-col gap-8">
        <div>
          <h3 className="text-warm-white whitestone:text-gray-900 text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">
            Monthly Total Payments Received
          </h3>
          <PaymentGraph />
        </div>
        <div>
          <h3 className="text-warm-white whitestone:text-gray-900 text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">
            Users
          </h3>
          <BiddersAuctioneersGraph />
        </div>
      </div>
    </AdminLayout>
  );
};

export default StatsPage;
