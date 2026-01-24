import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideDrawer from "./shared/layouts/SideDrawer";
import Home from "./shared/components/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "./features/auth/pages/SignUp";
import Login from "./features/auth/pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaderboard, fetchUser } from "./features/auth/store/userSlice";
import HowItWorks from "./shared/components/HowItWorks";
import About from "./shared/components/About";
import { getAllAuctionItems } from "./features/auctions/store/auctionSlice";
import Leaderboard from "./features/leaderboard/pages/Leaderboard";
import Auctions from "./features/auctions/pages/Auctions";
import AuctionItem from "./features/auctions/pages/AuctionItem";
import CreateAuction from "./features/auctions/pages/CreateAuction";
import ViewMyAuctions from "./features/auctions/pages/ViewMyAuctions";
import ViewAuctionDetails from "./features/auctions/pages/ViewAuctionDetails";
import Dashboard from "./features/admin/pages/Dashboard/Dashboard";
import ManageUsers from "./features/admin/pages/ManageUsers";
import ManageAuctions from "./features/admin/pages/ManageAuctions";
import PendingAuctionsPage from "./features/admin/pages/PendingAuctionsPage";
import PaymentProofsPage from "./features/admin/pages/PaymentProofsPage";
import PendingPaymentsPage from "./features/admin/pages/PendingPaymentsPage";
import StatsPage from "./features/admin/pages/StatsPage";
import ManageRoles from "./features/admin/pages/ManageRoles";
import DatabaseControl from "./features/admin/pages/DatabaseControl";
const AdminActivityLog = lazy(
  () =>
    import("./features/admin/pages/Dashboard/sub-components/AdminActivityLog.jsx"),
);
import Contact from "./shared/components/Contact";
import UserProfile from "./features/profile/pages/UserProfile";
import PaymentInfo from "./features/profile/pages/PaymentInfo";
import PaymentSuccess from "./features/payments/pages/PaymentSuccess";
import PaymentFailed from "./features/payments/pages/PaymentFailed";
import PaymentCancelled from "./features/payments/pages/PaymentCancelled";
import AuctionPayment from "./features/auctions/pages/AuctionPayment";
import MyPurchases from "./features/auctions/pages/MyPurchases";
import SellHistory from "./features/auctions/pages/SellHistory";
import EscrowDetail from "./features/auctions/pages/EscrowDetail";
import ManageDisputes from "./features/admin/pages/ManageDisputes";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
// Premium page and modal removed per request
import { useTheme, THEMES } from "./contexts/ThemeContext";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { currentTheme } = useTheme();
  // premium modal disabled

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(getAllAuctionItems());
    dispatch(fetchLeaderboard());
  }, []);

  // premium modal suppressed

  // Custom toast styles based on theme
  const toastClassName =
    currentTheme === THEMES.WHITESTONE
      ? "!bg-white !text-gray-900 !border !border-gray-200 !shadow-lg"
      : "!bg-white !text-gray-900 !border !border-gray-200 !shadow-lg";

  return (
    <Router>
      <SideDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        {/* Submit Commission route removed */}
        <Route path="/how-it-works-info" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/auction/item/:id" element={<AuctionItem />} />
        <Route path="/auction/:id/payment" element={<AuctionPayment />} />
        {/* alias: backend endpoint path -> show purchases UI */}
        <Route path="/auctions/my-wins" element={<MyPurchases />} />
        <Route path="/my-purchases" element={<MyPurchases />} />
        <Route path="/create-auction" element={<CreateAuction />} />
        <Route path="/view-my-auctions" element={<ViewMyAuctions />} />
        <Route path="/sell-history" element={<SellHistory />} />
        <Route path="/escrow/:id" element={<EscrowDetail />} />
        <Route path="/auction/details/:id" element={<ViewAuctionDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/manage-users" element={<ManageUsers />} />
        <Route path="/dashboard/manage-auctions" element={<ManageAuctions />} />
        <Route
          path="/dashboard/pending-auctions"
          element={<PendingAuctionsPage />}
        />
        <Route
          path="/dashboard/payment-proofs"
          element={<PaymentProofsPage />}
        />
        <Route
          path="/dashboard/pending-payments"
          element={<PendingPaymentsPage />}
        />
        <Route path="/dashboard/stats" element={<StatsPage />} />
        <Route path="/dashboard/manage-roles" element={<ManageRoles />} />
        <Route
          path="/dashboard/activity-log"
          element={
            <Suspense fallback={<div className="p-8">Loading...</div>}>
              <AdminActivityLog />
            </Suspense>
          }
        />
        <Route path="/dashboard/manage-disputes" element={<ManageDisputes />} />
        <Route
          path="/dashboard/database-control"
          element={<DatabaseControl />}
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/me" element={<UserProfile />} />
        <Route path="/payment-info" element={<PaymentInfo />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/payment-cancelled" element={<PaymentCancelled />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        {/* Premium page removed */}
      </Routes>
      <ToastContainer
        position="top-right"
        toastClassName={toastClassName}
        bodyClassName="!text-gray-900"
      />
      {/* Premium modal disabled */}
    </Router>
  );
};

export default App;
