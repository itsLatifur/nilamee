import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { formatBDT } from "@/shared/utils/currency";

const AuctionPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchAuctionDetails();
  }, [id, isAuthenticated]);

  // Countdown timer
  useEffect(() => {
    if (!auction || !auction.paymentDeadline) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const deadline = new Date(auction.paymentDeadline).getTime();
      const difference = deadline - now;

      if (difference <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  const fetchAuctionDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auctionitem/auction/${id}`,
        { withCredentials: true }
      );
      setAuction(response.data.auction);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load auction details");
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!auction) return;

    // Verify user is the winner
    if (auction.highestBidder?._id !== user._id) {
      setError("You are not the winner of this auction.");
      return;
    }

    // Check if already paid
    if (auction.paymentStatus === "Paid") {
      setError("This auction has already been paid.");
      return;
    }

    // Check deadline
    if (timeLeft === "Expired") {
      setError("Payment deadline has expired.");
      return;
    }

    setPaymentLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/payment/auction/init/${id}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success && response.data.gatewayUrl) {
        // Redirect to SSLCommerz payment gateway
        window.location.href = response.data.gatewayUrl;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to initialize payment");
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading auction details...</div>
      </div>
    );
  }

  if (error && !auction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Auction not found</div>
      </div>
    );
  }

  const isWinner = auction.highestBidder?._id === user._id;
  const isPaid = auction.paymentStatus === "Paid";
  const isExpired = timeLeft === "Expired";
  const isCritical = timeLeft && !isExpired && timeLeft.startsWith("0h");

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
            <p className="text-blue-100">Auction Item: {auction.title}</p>
          </div>

          {/* Auction Image */}
          {auction.images && auction.images.length > 0 && (
            <div className="px-6 py-4">
              <img
                src={auction.images[0].url}
                alt={auction.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Payment Details */}
          <div className="px-6 py-6 space-y-6">
            {/* Status Messages */}
            {!isWinner && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold">
                  ⚠️ You are not the winner of this auction.
                </p>
              </div>
            )}

            {isPaid && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-semibold">
                  ✅ Payment completed successfully!
                </p>
                <p className="text-green-700 text-sm mt-2">
                  The seller will ship your item soon. You'll receive tracking
                  information.
                </p>
              </div>
            )}

            {isExpired && !isPaid && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold">
                  ⏰ Payment deadline has expired. This auction has been
                  cancelled.
                </p>
              </div>
            )}

            {/* Countdown Timer */}
            {!isPaid && !isExpired && timeLeft && (
              <div
                className={`${
                  isCritical
                    ? "bg-red-50 border-red-200"
                    : "bg-yellow-50 border-yellow-200"
                } border rounded-lg p-4`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`${
                      isCritical ? "text-red-800" : "text-yellow-800"
                    } font-semibold`}
                  >
                    {isCritical ? "⚠️ URGENT: " : "⏰ "}Payment Deadline
                  </span>
                  <span
                    className={`${
                      isCritical ? "text-red-700" : "text-yellow-700"
                    } text-2xl font-bold`}
                  >
                    {timeLeft}
                  </span>
                </div>
                {isCritical && (
                  <p className="text-red-600 text-sm mt-2">
                    Payment must be completed within 1 hour or the auction will
                    be cancelled!
                  </p>
                )}
              </div>
            )}

            {/* Payment Amount */}
            <div className="border rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-medium">
                  Final Bid Amount:
                </span>
                <span className="text-3xl font-bold text-blue-600">
                  {formatBDT(auction.currentBid)}
                </span>
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <p>• Payment will be held in escrow for your protection</p>
                <p>• Seller receives funds after you confirm delivery</p>
                <p>• Platform commission: 7% (deducted from seller's share)</p>
              </div>
            </div>

            {/* Seller Information */}
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3">Seller Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">
                    {auction.createdBy?.userName || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">
                    {auction.createdBy?.email || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">
                    {auction.createdBy?.phone || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            {!isPaid && !isExpired && isWinner && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Payment Instructions:
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
                  <li>Click "Pay Now" to proceed to secure payment gateway</li>
                  <li>
                    Complete payment using SSLCommerz (Card/Mobile
                    Banking/Internet Banking)
                  </li>
                  <li>
                    After successful payment, wait for seller to ship the item
                  </li>
                  <li>Confirm delivery when you receive the item</li>
                  <li>Funds will be released to seller after confirmation</li>
                </ol>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/auctions")}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Back to Auctions
              </button>

              {!isPaid && !isExpired && isWinner && (
                <button
                  onClick={handlePayment}
                  disabled={paymentLoading}
                  className={`flex-1 px-6 py-3 rounded-lg text-white font-semibold transition ${
                    paymentLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : isCritical
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {paymentLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Pay Now with SSLCommerz"
                  )}
                </button>
              )}
            </div>

            {/* Security Notice */}
            <div className="text-center text-xs text-gray-500 pt-4 border-t">
              <p>🔒 Secure payment powered by SSLCommerz</p>
              <p className="mt-1">
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionPayment;
