import {
  clearAllSuperAdminSliceErrors,
  getAllPaymentProofs,
  getAllUsers,
  getMonthlyRevenue,
} from "../../store/superAdminSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// Overview-only dashboard: heavy components moved to dedicated pages
import { Link } from "react-router-dom";
import Spinner from "../../../../shared/components/Spinner";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.superAdmin);
  useEffect(() => {
    dispatch(getMonthlyRevenue());
    dispatch(getAllUsers());
    dispatch(getAllPaymentProofs());
    dispatch(clearAllSuperAdminSliceErrors());
  }, []);

  // Scroll to section if hash present in URL
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(
          () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
          0
        );
      }
    }
  }, []);

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  useEffect(() => {
    if (
      (user.role !== "Super Admin" && user.role !== "Admin") ||
      !isAuthenticated
    ) {
      navigateTo("/");
    }
  }, [isAuthenticated]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col gap-10">
            <h1
              className={`text-golden-500 whitestone:text-gray-900 text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
            >
              Dashboard
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/60 rounded-md border border-golden-400 whitestone:border-gray-300 p-4">
                <h3 className="text-warm-white whitestone:text-gray-900 text-xl font-semibold mb-1">
                  Stats
                </h3>
                <p className="text-golden-300 whitestone:text-gray-700 mb-3">
                  See revenue and user graphs
                </p>
                <Link
                  to="/dashboard/stats"
                  className="bg-gold-gradient text-white font-semibold py-1 px-3 rounded-md border border-golden-400 whitestone:border-gray-400"
                >
                  Open Stats
                </Link>
              </div>
              <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/60 rounded-md border border-golden-400 whitestone:border-gray-300 p-4">
                <h3 className="text-warm-white whitestone:text-gray-900 text-xl font-semibold mb-1">
                  Manage Users
                </h3>
                <p className="text-golden-300 whitestone:text-gray-700 mb-3">
                  Search, review, and control accounts
                </p>
                <Link
                  to="/dashboard/manage-users"
                  className="bg-gold-gradient text-white font-semibold py-1 px-3 rounded-md border border-golden-400 whitestone:border-gray-400"
                >
                  Open Users
                </Link>
              </div>
              <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/60 rounded-md border border-golden-400 whitestone:border-gray-300 p-4">
                <h3 className="text-warm-white whitestone:text-gray-900 text-xl font-semibold mb-1">
                  Payment Proofs
                </h3>
                <p className="text-golden-300 whitestone:text-gray-700 mb-3">
                  Inspect and verify commission proofs
                </p>
                <Link
                  to="/dashboard/payment-proofs"
                  className="bg-gold-gradient text-white font-semibold py-1 px-3 rounded-md border border-golden-400 whitestone:border-gray-400"
                >
                  Open Proofs
                </Link>
              </div>
              <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/60 rounded-md border border-golden-400 whitestone:border-gray-300 p-4">
                <h3 className="text-warm-white whitestone:text-gray-900 text-xl font-semibold mb-1">
                  Manage Auctions
                </h3>
                <p className="text-golden-300 whitestone:text-gray-700 mb-3">
                  Create, update, approve auctions
                </p>
                <Link
                  to="/dashboard/manage-auctions"
                  className="bg-gold-gradient text-white font-semibold py-1 px-3 rounded-md border border-golden-400 whitestone:border-gray-400"
                >
                  Open Auctions
                </Link>
              </div>
              <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/60 rounded-md border border-golden-400 whitestone:border-gray-300 p-4">
                <h3 className="text-warm-white whitestone:text-gray-900 text-xl font-semibold mb-1">
                  Pending Auctions
                </h3>
                <p className="text-golden-300 whitestone:text-gray-700 mb-3">
                  Review submissions awaiting approval
                </p>
                <Link
                  to="/dashboard/pending-auctions"
                  className="bg-gold-gradient text-white font-semibold py-1 px-3 rounded-md border border-golden-400 whitestone:border-gray-400"
                >
                  Open Pending
                </Link>
              </div>
              <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/60 rounded-md border border-golden-400 whitestone:border-gray-300 p-4">
                <h3 className="text-warm-white whitestone:text-gray-900 text-xl font-semibold mb-1">
                  Manage Roles
                </h3>
                <p className="text-golden-300 whitestone:text-gray-700 mb-3">
                  Create or revoke admin accounts
                </p>
                <Link
                  to="/dashboard/manage-roles"
                  className="bg-gold-gradient text-white font-semibold py-1 px-3 rounded-md border border-golden-400 whitestone:border-gray-400"
                >
                  Open Roles
                </Link>
              </div>
              <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/60 rounded-md border border-golden-400 whitestone:border-gray-300 p-4">
                <h3 className="text-warm-white whitestone:text-gray-900 text-xl font-semibold mb-1">
                  Database Control
                </h3>
                <p className="text-golden-300 whitestone:text-gray-700 mb-3">
                  Danger zone: irreversible deletions
                </p>
                <Link
                  to="/dashboard/database-control"
                  className="bg-gold-gradient text-white font-semibold py-1 px-3 rounded-md border border-golden-400 whitestone:border-gray-400"
                >
                  Open Control
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
