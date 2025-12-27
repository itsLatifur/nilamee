import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideDrawer from "./shared/layouts/SideDrawer";
import Home from "./shared/components/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "./features/auth/pages/SignUp";
import Login from "./features/auth/pages/Login";
import SubmitCommission from "./features/commissions/pages/SubmitCommission";
import { useDispatch } from "react-redux";
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
import Contact from "./shared/components/Contact";
import UserProfile from "./features/profile/pages/UserProfile";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(getAllAuctionItems());
    dispatch(fetchLeaderboard());
  }, []);
  return (
    <Router>
      <SideDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/submit-commission" element={<SubmitCommission />} />
        <Route path="/how-it-works-info" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/auction/item/:id" element={<AuctionItem />} />
        <Route path="/create-auction" element={<CreateAuction />} />
        <Route path="/view-my-auctions" element={<ViewMyAuctions />} />
        <Route path="/auction/details/:id" element={<ViewAuctionDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/me" element={<UserProfile />} />
      </Routes>
      <ToastContainer position="top-right" />
    </Router>
  );
};

export default App;
















