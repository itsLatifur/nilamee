import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { formatBDT } from "@/shared/utils/currency";
import FeedbackForm from "@/shared/components/FeedbackForm";

const MyPurchases = () => {
  const { isAuthenticated, user, hasCheckedAuth } = useSelector(
    (state) => state.user,
  );
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingDelivery, setConfirmingDelivery] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(null);
  const [raisingDispute, setRaisingDispute] = useState(null);
  const [leavingFeedback, setLeavingFeedback] = useState(null);
  const [disputeForm, setDisputeForm] = useState({
    type: "Not Received",
    description: "",
  });

  useEffect(() => {
    // Wait until we've checked auth status to avoid premature redirects
    if (!hasCheckedAuth) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchMyPurchases();
  }, [isAuthenticated, hasCheckedAuth]);

  const fetchMyPurchases = async () => {
    try {
      // Determine backend base URL (fall back to localhost:5000 if env not set)
      const BACKEND =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

      // Use server-side endpoint to retrieve auctions the user won
      const response = await axios.get(`${BACKEND}/api/v1/auctions/my-wins`, {
        withCredentials: true,
      });

      let wonAuctions = response.data.items || [];

      // If backend returned no items, try debug endpoint as a fallback to surface candidates
      if (!wonAuctions || wonAuctions.length === 0) {
        try {
          const dbg = await axios.get(
            `${BACKEND}/api/v1/auctions/my-wins/debug`,
            {
              withCredentials: true,
            },
          );
          if (dbg.data && dbg.data.matched > 0) {
            wonAuctions = dbg.data.sampleMatched || [];
          } else if (dbg.data && dbg.data.totalMatches > 0) {
            // Show candidates if filters excluded them
            wonAuctions = dbg.data.sampleAll || [];
            toast.info(
              "Showing candidate wins (debug) — backend filters excluded them.",
            );
          }
        } catch (err) {
          // swallow debug errors
          console.debug("Debug fetch failed", err?.message || err);
        }
      }

      setPurchases(wonAuctions);
      // Also fetch any escrows where current user is the buyer so we can show escrow status
      try {
        const escRes = await axios.get(
          `${BACKEND}/api/v1/profile/my-escrows/buyer`,
          { withCredentials: true },
        );
        setEscrows(escRes.data.escrows || []);
      } catch (err) {
        console.debug("Failed to fetch buyer escrows", err?.message || err);
      }

      setLoading(false);
    } catch (error) {
      toast.error("Failed to load purchases");
      setLoading(false);
    }
  };

  const handlePayNow = async (auctionId) => {
    setPaymentProcessing(auctionId);
    try {
      const BACKEND =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

      // In development allow demo-pay fallback
      const endpoint =
        import.meta.env.NODE_ENV !== "production"
          ? `${BACKEND}/api/v1/payment/auction/demo-pay/${auctionId}`
          : `${BACKEND}/api/v1/payment/auction/init/${auctionId}`;

      const response = await axios.post(
        endpoint,
        {},
        { withCredentials: true },
      );

      if (response.data && response.data.success) {
        // If demo endpoint used, just refresh purchases to reflect Paid state
        if (endpoint.includes("demo-pay")) {
          toast.success("Demo payment completed");
          fetchMyPurchases();
        } else if (response.data.gatewayUrl) {
          window.location.href = response.data.gatewayUrl;
        } else {
          toast.error(response.data.message || "Failed to start payment");
        }
      } else {
        toast.error(response.data?.message || "Failed to start payment");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to start payment");
    } finally {
      setPaymentProcessing(null);
    }
  };

  const handleConfirmDelivery = async (auctionId) => {
    if (
      !window.confirm(
        "Are you sure you want to confirm delivery? This will release payment to the seller.",
      )
    ) {
      return;
    }

    setConfirmingDelivery(auctionId);
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/auctionitem/confirm-delivery/${auctionId}`,
        {},
        { withCredentials: true },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchMyPurchases();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to confirm delivery",
      );
    } finally {
      setConfirmingDelivery(null);
    }
  };

  const handleRaiseDispute = async (auctionId) => {
    if (!disputeForm.description.trim()) {
      toast.error("Please describe the issue");
      return;
    }

    setRaisingDispute(auctionId);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/dispute/raise`,
        {
          auctionId,
          type: disputeForm.type,
          description: disputeForm.description,
        },
        { withCredentials: true },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setDisputeForm({ type: "Not Received", description: "" });
        setRaisingDispute(null);
        fetchMyPurchases();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to raise dispute");
      setRaisingDispute(null);
    }
  };

  const getStatusBadge = (auction) => {
    if (auction.overallStatus === "Completed") {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
          Completed
        </span>
      );
    }
    if (auction.overallStatus === "Cancelled") {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
          Cancelled
        </span>
      );
    }
    if (auction.overallStatus === "Disputed") {
      return (
        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
          Disputed
        </span>
      );
    }
    if (auction.paymentStatus === "Unpaid") {
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
          Payment Pending
        </span>
      );
    }
    if (auction.deliveryStatus === "Shipped") {
      return (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
          In Transit
        </span>
      );
    }
    if (auction.paymentStatus === "Paid") {
      return (
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
          Awaiting Shipment
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
        {auction.overallStatus}
      </span>
    );
  };

  const getTimeLeft = (deadline) => {
    if (!deadline) return null;
    const now = new Date().getTime();
    const deadlineTime = new Date(deadline).getTime();
    const diff = deadlineTime - now;

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your purchases...</div>
      </div>
    );
  }

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-warm-white mb-2">
          My Purchases
        </h1>
        <p className="text-gray-400">Track your won auctions and orders</p>
      </div>

      {purchases.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-12 text-center">
          <p className="text-xl text-gray-500">
            You haven't won any auctions yet
          </p>
          <button
            onClick={() => navigate("/auctions")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Auctions
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {purchases.map((auction) => {
            const timeLeft = getTimeLeft(auction.paymentDeadline);
            const isPaymentUrgent =
              timeLeft && !timeLeft.startsWith("0h") && timeLeft !== "Expired";

            return (
              <div
                key={auction._id}
                className="bg-white dark:bg-gray-900 rounded-lg p-6 border-2 border-golden-400 whitestone:border-white/30"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Image */}
                  <div className="lg:w-48 lg:h-48 flex-shrink-0">
                    <img
                      src={auction.images?.[0]?.url || "/placeholder.png"}
                      alt={auction.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-warm-white mb-2">
                          {auction.title}
                        </h3>
                        <p className="text-xl font-semibold text-golden-500">
                          {formatBDT(auction.currentBid)}
                        </p>
                      </div>
                      {getStatusBadge(auction)}
                    </div>

                    {/* Payment Deadline Warning */}
                    {auction.paymentStatus === "Unpaid" &&
                      timeLeft &&
                      timeLeft !== "Expired" && (
                        <div
                          className={`p-3 rounded-lg mb-4 ${
                            isPaymentUrgent
                              ? "bg-red-50 border border-red-200"
                              : "bg-yellow-50 border border-yellow-200"
                          }`}
                        >
                          <p
                            className={`font-semibold ${
                              isPaymentUrgent
                                ? "text-red-800"
                                : "text-yellow-800"
                            }`}
                          >
                            {isPaymentUrgent ? "⚠️ URGENT: " : "⏰ "}Payment
                            deadline: {timeLeft} remaining
                          </p>
                          <p
                            className={`text-sm ${
                              isPaymentUrgent
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            Payment must be completed by{" "}
                            {new Date(auction.paymentDeadline).toLocaleString()}
                          </p>
                        </div>
                      )}

                    {/* Tracking Info */}
                    {auction.trackingNumber && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-900">
                          <strong>Tracking Number:</strong>{" "}
                          {auction.trackingNumber}
                        </p>
                      </div>
                    )}

                    {/* Seller Info */}
                    <div className="text-sm text-gray-400 mb-4">
                      <p>Seller: {auction.createdBy?.userName || "N/A"}</p>
                      {auction.paidAt && (
                        <p>
                          Paid on:{" "}
                          {new Date(auction.paidAt).toLocaleDateString()}
                        </p>
                      )}
                      {auction.shippedAt && (
                        <p>
                          Shipped on:{" "}
                          {new Date(auction.shippedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Escrow summary for buyers */}
                    {(() => {
                      const map = {};
                      (escrows || []).forEach((e) => {
                        if (e.auctionId && e.auctionId._id)
                          map[e.auctionId._id] = e;
                      });
                      const esc = map[auction._id];
                      if (!esc) return null;
                      return (
                        <div className="mb-4 p-3 bg-gray-800 rounded text-sm">
                          <div className="text-gray-200 font-medium">
                            Escrow Status:{" "}
                            <span className="text-white">{esc.status}</span>
                          </div>
                          <div className="text-gray-400 text-xs mt-1">
                            {esc.adminHold
                              ? "On Hold by Admin"
                              : esc.status === "Released"
                                ? "Released - awaiting processing"
                                : "Not processed yet"}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {esc.processedAt
                              ? `Processed: ${new Date(esc.processedAt).toLocaleString()}`
                              : ""}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {/* Pay Now Button */}
                      {auction.paymentStatus === "Unpaid" &&
                        timeLeft &&
                        timeLeft !== "Expired" && (
                          <button
                            onClick={() => handlePayNow(auction._id)}
                            className={`px-6 py-2 rounded-lg text-white font-semibold transition ${
                              isPaymentUrgent
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                          >
                            Pay Now
                          </button>
                        )}

                      {/* Confirm Delivery Button */}
                      {auction.paymentStatus === "Paid" &&
                        auction.deliveryStatus === "Shipped" &&
                        auction.overallStatus !== "Disputed" && (
                          <button
                            onClick={() => handleConfirmDelivery(auction._id)}
                            disabled={confirmingDelivery === auction._id}
                            className={`px-6 py-2 rounded-lg text-white font-semibold transition ${
                              confirmingDelivery === auction._id
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            {confirmingDelivery === auction._id
                              ? "Confirming..."
                              : "Confirm Delivery"}
                          </button>
                        )}

                      {/* Raise Dispute Button */}
                      {auction.paymentStatus === "Paid" &&
                        auction.overallStatus !== "Disputed" &&
                        auction.overallStatus !== "Completed" && (
                          <button
                            onClick={() => setRaisingDispute(auction._id)}
                            className="px-6 py-2 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700 transition"
                          >
                            Report Issue
                          </button>
                        )}

                      {/* View Details */}
                      <button
                        onClick={() => navigate(`/auction/item/${auction._id}`)}
                        className="px-6 py-2 rounded-lg border-2 border-gray-300 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      >
                        View Details
                      </button>

                      {/* Leave Feedback Button (for completed auctions only) */}
                      {auction.overallStatus === "Completed" && (
                        <button
                          onClick={() => setLeavingFeedback(auction._id)}
                          className="px-6 py-2 rounded-lg bg-golden-600 text-white font-semibold hover:bg-golden-700 transition"
                        >
                          Leave Feedback
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Feedback Form */}
                {leavingFeedback === auction._id && (
                  <div className="mt-6 p-4 bg-golden-50 rounded-lg border-2 border-golden-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">
                        Leave Feedback for Seller
                      </h4>
                      <button
                        onClick={() => setLeavingFeedback(null)}
                        className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                      >
                        ×
                      </button>
                    </div>
                    <FeedbackForm
                      auctionId={auction._id}
                      onSuccess={() => {
                        setLeavingFeedback(null);
                        toast.success("Thank you for your feedback!");
                      }}
                    />
                  </div>
                )}

                {/* Dispute Form Modal */}
                {raisingDispute === auction._id && (
                  <div className="mt-6 p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                    <h4 className="font-semibold text-orange-900 mb-3">
                      Report an Issue
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Issue Type
                        </label>
                        <select
                          value={disputeForm.type}
                          onChange={(e) =>
                            setDisputeForm({
                              ...disputeForm,
                              type: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                        >
                          <option value="Not Received">
                            Item Not Received
                          </option>
                          <option value="Damaged">Item Damaged</option>
                          <option value="Not As Described">
                            Not As Described
                          </option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={disputeForm.description}
                          onChange={(e) =>
                            setDisputeForm({
                              ...disputeForm,
                              description: e.target.value,
                            })
                          }
                          placeholder="Please describe the issue in detail..."
                          rows="4"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleRaiseDispute(auction._id)}
                          disabled={!disputeForm.description.trim()}
                          className={`flex-1 px-4 py-2 rounded-lg text-white font-semibold transition ${
                            !disputeForm.description.trim()
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-orange-600 hover:bg-orange-700"
                          }`}
                        >
                          Submit Dispute
                        </button>
                        <button
                          onClick={() => {
                            setRaisingDispute(null);
                            setDisputeForm({
                              type: "Not Received",
                              description: "",
                            });
                          }}
                          className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MyPurchases;
