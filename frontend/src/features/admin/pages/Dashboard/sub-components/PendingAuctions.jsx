import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../../../../config/env";

const PendingAuctions = () => {
  const [pendingAuctions, setPendingAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchPendingAuctions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.ADMIN.BASE}/auctions/pending`,
        { withCredentials: true }
      );
      setPendingAuctions(response.data.pendingAuctions);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch auctions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAuctions();
  }, []);

  const handleApprove = async (id) => {
    try {
      const response = await axios.put(
        `${API_ENDPOINTS.ADMIN.BASE}/auction/approve/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success(response.data.message);
      fetchPendingAuctions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve auction");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    try {
      const response = await axios.put(
        `${API_ENDPOINTS.ADMIN.BASE}/auction/reject/${selectedAuction}`,
        { reason: rejectReason },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedAuction(null);
      fetchPendingAuctions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject auction");
    }
  };

  const openRejectModal = (id) => {
    setSelectedAuction(id);
    setShowRejectModal(true);
  };

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <p className="text-center text-warm-white">Loading...</p>
      ) : pendingAuctions.length === 0 ? (
        <p className="text-center text-warm-white py-4">
          No pending auctions to review
        </p>
      ) : (
        <table className="min-w-full bg-white dark:bg-gray-900 border border-golden-300 whitestone:border-white/40 shadow-md">
          <thead className="bg-luxury-gradient text-white whitestone:text-black">
            <tr>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Starting Bid</th>
              <th className="py-3 px-4 text-left">Auctioneer</th>
              <th className="py-3 px-4 text-left">Start Time</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingAuctions.map((auction) => (
              <tr
                key={auction._id}
                className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="py-3 px-4">
                  <img
                    src={auction.images?.[0]?.url}
                    alt={auction.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="py-3 px-4 text-warm-white">{auction.title}</td>
                <td className="py-3 px-4 text-warm-white">
                  {auction.category}
                </td>
                <td className="py-3 px-4 text-warm-white">
                  Rs. {auction.startingBid}
                </td>
                <td className="py-3 px-4 text-warm-white">
                  {auction.createdBy?.userName || "N/A"}
                </td>
                <td className="py-3 px-4 text-warm-white text-sm">
                  {new Date(auction.startTime).toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleApprove(auction._id)}
                      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-all"
                      title="Approve"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => openRejectModal(auction._id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-all"
                      title="Reject"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-warm-white mb-4">
              Reject Auction
            </h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-transparent text-warm-white resize-none"
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleReject}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-all"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedAuction(null);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingAuctions;
