import React, { useState } from "react";
import { FiCheck, FiStar, FiZap, FiShield, FiTrendingUp } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

const Premium = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelPassword, setCancelPassword] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const handlePremiumPurchase = async () => {
    console.log("Premium purchase clicked");
    if (!isAuthenticated) {
      toast.error("Please login to purchase premium");
      return;
    }

    if (user?.isPremium) {
      toast.info("You already have premium subscription");
      return;
    }

    try {
      setLoading(true);
      console.log("Sending request to backend...");
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/payment/premium/init",
        {},
        { withCredentials: true }
      );

      console.log("Payment response:", data);
      if (data.success && data.gatewayUrl) {
        console.log("Redirecting to:", data.gatewayUrl);
        // Redirect to payment gateway
        window.location.href = data.gatewayUrl;
      } else {
        console.error("No gateway URL in response");
        toast.error("Payment gateway URL not received");
        setLoading(false);
      }
    } catch (error) {
      console.error("Premium purchase error:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.response?.data?.message);
      console.error("Full error data:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to initiate payment"
      );
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (e) => {
    e.preventDefault();

    if (!cancelPassword) {
      toast.error("Please enter your password");
      return;
    }

    try {
      setCancelling(true);
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/payment/premium/cancel",
        { password: cancelPassword },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Premium subscription cancelled successfully");
        setShowCancelModal(false);
        setCancelPassword("");
        window.location.reload(); // Refresh to update UI
      }
    } catch (error) {
      console.error("Cancel subscription error:", error);
      toast.error(
        error.response?.data?.message || "Failed to cancel subscription"
      );
      setCancelling(false);
    }
  };

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gold-gradient bg-clip-text text-transparent whitestone:text-blue-600 mb-4">
            Nilamee Premium (archived)
          </h1>
          <p className="text-golden-300 whitestone:text-gray-600 text-lg max-w-2xl mx-auto">
            This page has been archived.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Premium;
