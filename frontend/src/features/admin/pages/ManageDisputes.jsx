import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { formatBDT } from "@/shared/utils/currency";

const ManageDisputes = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingDispute, setResolvingDispute] = useState(null);
  const [resolution, setResolution] = useState({
    disputeId: null,
    resolution: "",
    action: "Release",
  });

  useEffect(() => {
    if (!isAuthenticated || user.role !== "Super Admin") {
      navigate("/");
      return;
    }
    fetchDisputes();
  }, [isAuthenticated, user]);

  const fetchDisputes = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/dispute/all`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setDisputes(response.data.disputes);
      }
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load disputes");
      setLoading(false);
    }
  };

  const handleResolveDispute = async (disputeId) => {
    if (!resolution.resolution.trim()) {
      toast.error("Please provide a resolution explanation");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to ${resolution.action} for this dispute?`
      )
    ) {
      return;
    }

    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/dispute/resolve/${disputeId}`,
        {
          resolution: resolution.resolution,
          action: resolution.action,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setResolvingDispute(null);
        setResolution({ disputeId: null, resolution: "", action: "Release" });
        fetchDisputes();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resolve dispute");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Open: "bg-red-100 text-red-800",
      "Under Review": "bg-yellow-100 text-yellow-800",
      Resolved: "bg-green-100 text-green-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading disputes...</div>
      </div>
    );
  }

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-warm-white mb-2">
          Dispute Management
        </h1>
        <p className="text-gray-400">Review and resolve buyer disputes</p>
      </div>

      {disputes.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-12 text-center">
          <p className="text-xl text-gray-500">No disputes to review</p>
        </div>
      ) : (
        <div className="space-y-6">
          {disputes.map((dispute) => (
            <div
              key={dispute._id}
              className="bg-white dark:bg-gray-900 rounded-lg p-6 border-2 border-golden-400 whitestone:border-white/30"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-warm-white mb-1">
                    {dispute.auctionId?.title || "Auction Removed"}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Dispute ID: {dispute._id}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(
                    dispute.status
                  )}`}
                >
                  {dispute.status}
                </span>
              </div>

              {/* Auction Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-semibold text-lg text-golden-500">
                    {formatBDT(dispute.auctionId?.currentBid || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Raised By (Buyer)</p>
                  <p className="font-semibold">
                    {dispute.raisedBy?.userName || "N/A"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {dispute.raisedBy?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Seller</p>
                  <p className="font-semibold">
                    {dispute.auctionId?.createdBy?.userName || "N/A"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {dispute.auctionId?.createdBy?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date Raised</p>
                  <p className="font-semibold">
                    {new Date(dispute.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Dispute Details */}
              <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200">
                <div className="mb-2">
                  <span className="text-sm font-semibold text-orange-900 dark:text-orange-300">
                    Issue Type:
                  </span>
                  <span className="ml-2 px-2 py-1 bg-orange-200 text-orange-900 rounded text-sm">
                    {dispute.type}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-orange-900 dark:text-orange-300 mb-1">
                    Description:
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {dispute.description}
                  </p>
                </div>
              </div>

              {/* Payment/Delivery Status */}
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Payment Status:
                    </p>
                    <p className="font-semibold">
                      {dispute.auctionId?.paymentStatus || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Delivery Status:
                    </p>
                    <p className="font-semibold">
                      {dispute.auctionId?.deliveryStatus || "N/A"}
                    </p>
                  </div>
                  {dispute.auctionId?.trackingNumber && (
                    <div className="col-span-2">
                      <p className="text-gray-600 dark:text-gray-400">
                        Tracking Number:
                      </p>
                      <p className="font-semibold">
                        {dispute.auctionId.trackingNumber}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Resolution Section */}
              {dispute.status === "Resolved" ? (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                  <p className="font-semibold text-green-900 dark:text-green-300 mb-2">
                    ✅ Resolved on{" "}
                    {new Date(dispute.resolvedAt).toLocaleString()}
                  </p>
                  <div className="mb-2">
                    <span className="text-sm font-semibold">Action Taken:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-sm ${
                        dispute.action === "Refund"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {dispute.action}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">Resolution:</p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {dispute.resolution}
                    </p>
                  </div>
                  {dispute.resolvedBy && (
                    <p className="text-xs text-gray-500 mt-2">
                      Resolved by: {dispute.resolvedBy.userName}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  {resolvingDispute === dispute._id ? (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-300">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
                        Resolve Dispute
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Decision
                          </label>
                          <select
                            value={resolution.action}
                            onChange={(e) =>
                              setResolution({
                                ...resolution,
                                action: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                          >
                            <option value="Release">
                              Release Payment to Seller
                            </option>
                            <option value="Refund">Refund Buyer</option>
                            <option value="Partial Refund">
                              Partial Refund
                            </option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Resolution Explanation
                          </label>
                          <textarea
                            value={resolution.resolution}
                            onChange={(e) =>
                              setResolution({
                                ...resolution,
                                resolution: e.target.value,
                              })
                            }
                            placeholder="Explain your decision and what action was taken..."
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleResolveDispute(dispute._id)}
                            disabled={!resolution.resolution.trim()}
                            className={`flex-1 px-4 py-2 rounded-lg text-white font-semibold transition ${
                              !resolution.resolution.trim()
                                ? "bg-gray-400 cursor-not-allowed"
                                : resolution.action === "Refund"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            {resolution.action === "Refund"
                              ? "Confirm Refund"
                              : "Confirm Release"}
                          </button>
                          <button
                            onClick={() => {
                              setResolvingDispute(null);
                              setResolution({
                                disputeId: null,
                                resolution: "",
                                action: "Release",
                              });
                            }}
                            className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setResolvingDispute(dispute._id);
                          setResolution({
                            ...resolution,
                            disputeId: dispute._id,
                          });
                        }}
                        className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                      >
                        Resolve Dispute
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/auction/item/${dispute.auctionId?._id}`)
                        }
                        className="px-6 py-2 rounded-lg border-2 border-gray-300 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      >
                        View Auction
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ManageDisputes;
