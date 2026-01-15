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
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-gold-gradient whitestone:bg-blue-gradient flex items-center justify-center">
              <FiStar className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gold-gradient bg-clip-text text-transparent whitestone:text-blue-600 mb-4">
            Nilamee Premium
          </h1>
          <p className="text-golden-300 whitestone:text-gray-600 text-lg max-w-2xl mx-auto">
            Unlock the full potential of your auction experience with exclusive
            premium features
          </p>
        </div>

        {/* Pricing Card */}
        <div className="mb-12 max-w-md mx-auto">
          <div className="bg-gradient-to-br from-burgundy-950/10 to-golden-950/5 whitestone:from-blue-50 whitestone:to-purple-50 rounded-2xl p-8 border-2 border-golden-400/40 whitestone:border-blue-300 shadow-xl">
            <div className="text-center mb-6">
              <div className="text-warm-white whitestone:text-gray-900 text-5xl font-bold mb-2">
                ৳999<span className="text-2xl font-normal">/month</span>
              </div>
              <p className="text-golden-300 whitestone:text-gray-600">
                Cancel anytime • No commitment
              </p>
            </div>
            <button
              onClick={
                user?.isPremium
                  ? () => setShowCancelModal(true)
                  : handlePremiumPurchase
              }
              disabled={loading}
              className={`block w-full ${
                user?.isPremium
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gold-gradient whitestone:bg-blue-gradient hover:shadow-2xl"
              } text-white font-bold text-xl py-4 px-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 text-center ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading
                ? "Processing..."
                : user?.isPremium
                ? "Cancel Subscription"
                : "Get Premium Now"}
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Priority Bidding */}
          <div className="bg-gradient-to-br from-burgundy-950/10 to-golden-950/5 whitestone:from-blue-50 whitestone:to-purple-50 rounded-xl p-6 border border-golden-400/20 whitestone:border-blue-200 hover:border-golden-400/40 whitestone:hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gold-gradient whitestone:bg-blue-gradient flex items-center justify-center flex-shrink-0">
                <FiZap className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-warm-white whitestone:text-gray-900 text-xl font-bold mb-2">
                  Priority Bidding Access
                </h3>
                <p className="text-golden-300 whitestone:text-gray-600">
                  Get early access to new auctions 24 hours before public
                  release. Be the first to bid on exclusive items and rare
                  collectibles.
                </p>
              </div>
            </div>
          </div>

          {/* Extended Protection */}
          <div className="bg-gradient-to-br from-burgundy-950/10 to-golden-950/5 whitestone:from-blue-50 whitestone:to-purple-50 rounded-xl p-6 border border-golden-400/20 whitestone:border-blue-200 hover:border-golden-400/40 whitestone:hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gold-gradient whitestone:bg-blue-gradient flex items-center justify-center flex-shrink-0">
                <FiShield className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-warm-white whitestone:text-gray-900 text-xl font-bold mb-2">
                  Extended Buyer Protection
                </h3>
                <p className="text-golden-300 whitestone:text-gray-600">
                  Enjoy 60-day money-back guarantee instead of standard 30 days.
                  Premium dispute resolution with dedicated support team.
                </p>
              </div>
            </div>
          </div>

          {/* Lower Fees */}
          <div className="bg-gradient-to-br from-burgundy-950/10 to-golden-950/5 whitestone:from-blue-50 whitestone:to-purple-50 rounded-xl p-6 border border-golden-400/20 whitestone:border-blue-200 hover:border-golden-400/40 whitestone:hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gold-gradient whitestone:bg-blue-gradient flex items-center justify-center flex-shrink-0">
                <FiTrendingUp className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-warm-white whitestone:text-gray-900 text-xl font-bold mb-2">
                  50% Lower Commission Fees
                </h3>
                <p className="text-golden-300 whitestone:text-gray-600">
                  Save significantly on all transaction fees and commissions.
                  Pay only 2.5% instead of the standard 5% fee on all purchases.
                </p>
              </div>
            </div>
          </div>

          {/* Premium Badge */}
          <div className="bg-gradient-to-br from-burgundy-950/10 to-golden-950/5 whitestone:from-blue-50 whitestone:to-purple-50 rounded-xl p-6 border border-golden-400/20 whitestone:border-blue-200 hover:border-golden-400/40 whitestone:hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gold-gradient whitestone:bg-blue-gradient flex items-center justify-center flex-shrink-0">
                <FaCrown className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-warm-white whitestone:text-gray-900 text-xl font-bold mb-2">
                  Verified Premium Badge
                </h3>
                <p className="text-golden-300 whitestone:text-gray-600">
                  Stand out with an exclusive premium badge on your profile.
                  Increase trust and credibility with sellers and buyers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="bg-gradient-to-br from-burgundy-950/10 to-golden-950/5 whitestone:from-blue-50 whitestone:to-purple-50 rounded-xl p-8 border border-golden-400/20 whitestone:border-blue-200 mb-12">
          <h2 className="text-warm-white whitestone:text-gray-900 text-2xl font-bold mb-6">
            What's Included
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Priority customer support (24/7)",
              "Unlimited auction watchlist",
              "Advanced analytics dashboard",
              "Exclusive premium-only auctions",
              "Higher bid increment control",
              "Custom notification preferences",
              "Ad-free browsing experience",
              "Monthly premium newsletter",
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gold-gradient whitestone:bg-blue-gradient flex items-center justify-center flex-shrink-0">
                  <FiCheck className="text-white text-sm" />
                </div>
                <span className="text-warm-white whitestone:text-gray-900">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-warm-white whitestone:text-gray-900 text-2xl font-bold mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-burgundy-950/10 to-golden-950/5 whitestone:from-blue-50 whitestone:to-purple-50 rounded-lg p-6 border border-golden-400/20 whitestone:border-blue-200">
              <h3 className="text-warm-white whitestone:text-gray-900 font-semibold mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-golden-300 whitestone:text-gray-600">
                Yes! You can cancel your premium subscription at any time.
                You'll continue to have access until the end of your current
                billing period.
              </p>
            </div>
            <div className="bg-gradient-to-br from-burgundy-950/10 to-golden-950/5 whitestone:from-blue-50 whitestone:to-purple-50 rounded-lg p-6 border border-golden-400/20 whitestone:border-blue-200">
              <h3 className="text-warm-white whitestone:text-gray-900 font-semibold mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-golden-300 whitestone:text-gray-600">
                We accept all major payment methods including bKash, Nagad,
                Rocket, and all major credit/debit cards through our secure
                payment gateway.
              </p>
            </div>
            <div className="bg-gradient-to-br from-burgundy-950/10 to-golden-950/5 whitestone:from-blue-50 whitestone:to-purple-50 rounded-lg p-6 border border-golden-400/20 whitestone:border-blue-200">
              <h3 className="text-warm-white whitestone:text-gray-900 font-semibold mb-2">
                Do premium benefits apply to existing bids?
              </h3>
              <p className="text-golden-300 whitestone:text-gray-600">
                Yes! Once you upgrade to premium, all benefits including lower
                commission fees apply immediately to all your current and future
                transactions.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <button
            onClick={handlePremiumPurchase}
            disabled={loading || user?.isPremium}
            className={`inline-block bg-gold-gradient whitestone:bg-blue-gradient text-white font-bold text-xl py-4 px-12 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
              loading || user?.isPremium ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading
              ? "Processing..."
              : user?.isPremium
              ? "Already Premium"
              : "Start Your Premium Journey"}
          </button>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gradient-to-br from-burgundy-950/90 to-golden-950/80 whitestone:from-white whitestone:to-gray-50 rounded-2xl p-8 max-w-md w-full border-2 border-red-500 shadow-2xl">
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              Cancel Premium Subscription
            </h2>
            <p className="text-warm-white whitestone:text-gray-700 mb-6">
              Are you sure you want to cancel your premium subscription? You
              will lose access to all premium features immediately.
            </p>
            <form onSubmit={handleCancelSubscription}>
              <div className="mb-6">
                <label className="text-golden-300 whitestone:text-gray-900 font-semibold mb-2 block">
                  Enter your password to confirm
                </label>
                <input
                  type="password"
                  value={cancelPassword}
                  onChange={(e) => setCancelPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-burgundy-950/50 whitestone:bg-gray-100 border border-golden-400 whitestone:border-gray-300 text-warm-white whitestone:text-gray-900 focus:outline-none focus:border-red-500"
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelPassword("");
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
                  disabled={cancelling}
                >
                  Keep Premium
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
                  disabled={cancelling}
                >
                  {cancelling ? "Cancelling..." : "Confirm Cancel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Premium;
