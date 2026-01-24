import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../../../config/env";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AuctionManagement = () => {
  const { user: currentUser } = useSelector((state) => state.user);
  const [auctions, setAuctions] = useState([]);
  const [rawAuctions, setRawAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermanentDeleteModal, setShowPermanentDeleteModal] =
    useState(false);
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");

  const fetchAuctions = async () => {
    setLoading(true);
    try {
      if (showDeleted) {
        const { data } = await axios.get(
          `${API_ENDPOINTS.ADMIN.SOFT_DELETED}?type=auctions`,
          { withCredentials: true },
        );
        setRawAuctions(data.items);
        applyFilters(data.items, statusFilter);
      } else {
        const { data } = await axios.get(API_ENDPOINTS.AUCTION.ALL, {
          withCredentials: true,
        });
        const items = data.items || data.allAuctions || [];
        setRawAuctions(items);
        applyFilters(items, statusFilter);
      }
    } catch (error) {
      toast.error("Failed to fetch auctions");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (items = rawAuctions, status = statusFilter) => {
    if (!items) return setAuctions([]);
    if (!status || status === "All") return setAuctions(items);
    const filtered = items.filter((a) => getAuctionStatusLabel(a) === status);
    setAuctions(filtered);
  };

  const getAuctionStatusLabel = (auction) => {
    if (!auction) return "Unknown";
    if (auction.isDeleted) return "Deleted";
    if (
      auction.overallStatus === "Cancelled" ||
      auction.overallStatus === "Cancelled"
    )
      return "Cancelled";
    if (auction.adminHold) return "On Hold";

    // Consider Sold when auction completed or payment/delivery completed
    if (
      auction.overallStatus === "Completed" ||
      auction.deliveryStatus === "Delivered" ||
      auction.paymentStatus === "Paid"
    ) {
      return "Sold";
    }

    // Determine if auction has ended based on endTime or overallStatus
    const now = new Date();
    let ended = false;
    if (auction.endTime) {
      const endDt = new Date(auction.endTime);
      if (!isNaN(endDt.getTime()) && endDt <= now) ended = true;
    }
    if (!ended && auction.overallStatus && /Ended/i.test(auction.overallStatus))
      ended = true;

    if (ended) {
      // If ended and has highestBidder -> In Escrow (winner exists but not fully completed)
      if (auction.highestBidder) return "In Escrow";
      // Ended with no winner
      return "Ended";
    }

    return "Active";
  };

  const getStatusBadgeClass = (label) => {
    switch (label) {
      case "Deleted":
        return "px-2 py-1 bg-gray-500 text-white rounded text-xs";
      case "Cancelled":
        return "px-2 py-1 bg-red-500 text-white rounded text-xs";
      case "On Hold":
        return "px-2 py-1 bg-yellow-500 text-white rounded text-xs";
      case "Sold":
        return "px-2 py-1 bg-emerald-600 text-white rounded text-xs";
      case "In Escrow":
        return "px-2 py-1 bg-purple-600 text-white rounded text-xs";
      case "Ended":
        return "px-2 py-1 bg-gray-500 text-white rounded text-xs";
      case "Active":
      default:
        return "px-2 py-1 bg-green-500 text-white rounded text-xs";
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [showDeleted]);

  // Re-apply filters when statusFilter changes
  useEffect(() => {
    applyFilters();
  }, [statusFilter]);

  const handleSoftDelete = async () => {
    if (!deleteReason.trim()) {
      toast.error("Please provide a reason for deletion");
      return;
    }

    try {
      await axios.delete(
        API_ENDPOINTS.ADMIN.DELETE_AUCTION(selectedAuction._id),
        {
          data: { reason: deleteReason },
          withCredentials: true,
        },
      );
      toast.success("Auction soft-deleted successfully");
      setShowDeleteModal(false);
      setDeleteReason("");
      fetchAuctions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete auction");
    }
  };

  const handlePermanentDelete = async () => {
    try {
      await axios.delete(
        API_ENDPOINTS.ADMIN.PERMANENT_DELETE_AUCTION(selectedAuction._id),
        { withCredentials: true },
      );
      toast.success("Auction permanently deleted from database");
      setShowPermanentDeleteModal(false);
      fetchAuctions();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to permanently delete auction",
      );
    }
  };

  const handleConfirmHold = async () => {
    if (!adminNote.trim()) {
      toast.error("Please provide a note for placing a hold");
      return;
    }

    try {
      await axios.post(
        API_ENDPOINTS.ADMIN.HOLD_AUCTION(selectedAuction._id),
        { note: adminNote },
        { withCredentials: true },
      );
      toast.success("Auction placed on hold");
      setShowHoldModal(false);
      setAdminNote("");
      fetchAuctions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place hold");
    }
  };

  const handleConfirmCancel = async () => {
    if (!adminNote.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    try {
      await axios.post(
        API_ENDPOINTS.ADMIN.CANCEL_AUCTION(selectedAuction._id),
        { note: adminNote },
        { withCredentials: true },
      );
      toast.success("Auction cancelled");
      setShowCancelModal(false);
      setAdminNote("");
      fetchAuctions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel auction");
    }
  };

  return (
    <div className="w-full">
      {/* Filter Toggle */}
      <div className="mb-4 flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => setShowDeleted(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-white whitestone:text-gray-900">
            Show Soft-Deleted Auctions
          </span>
        </label>

        <div className="ml-4">
          <label className="text-sm text-gray-300 mr-2">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800 text-white px-2 py-1 rounded"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Deleted">Deleted</option>
            <option value="Cancelled">Cancelled</option>
            <option value="On Hold">On Hold</option>
            <option value="Ended">Ended</option>
            <option value="In Escrow">In Escrow</option>
            <option value="Sold">Sold</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/30 backdrop-blur-sm border-2 border-golden-400 whitestone:border-white/30 rounded-lg">
            <thead className="whitestone:bg-gray-200 text-white whitestone:text-black">
              <tr>
                <th className="py-2 px-4 text-left">Image</th>
                <th className="py-2 px-4 text-left">Title</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-warm-white whitestone:text-gray-900">
              {auctions.length > 0 ? (
                auctions.map((auction) => (
                  <tr key={auction._id}>
                    <td className="py-2 px-4">
                      <img
                        src={auction.images?.[0]?.url || auction.image?.url}
                        alt={auction.title}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </td>
                    <td className="py-2 px-4">{auction.title}</td>
                    <td className="py-2 px-4">
                      {(() => {
                        const label = getAuctionStatusLabel(auction);
                        const cls = getStatusBadgeClass(label);
                        return (
                          <div className="flex items-center gap-2">
                            <span className={cls}>{label}</span>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="py-2 px-4 flex flex-wrap gap-2">
                      <Link
                        to={`/auction/details/${auction._id}`}
                        className="bg-gold-gradient whitestone:bg-amber-600 btn-hover text-warm-white whitestone:text-white py-1 px-3 rounded-md border-2 border-golden-400 whitestone:border-amber-500 shadow-lg transition-all duration-300 inline-flex items-center justify-center"
                      >
                        View
                      </Link>
                      {!auction.isDeleted ? (
                        <>
                          {!auction.adminHold ? (
                            <button
                              onClick={() => {
                                setSelectedAuction(auction);
                                setAdminNote("");
                                setShowHoldModal(true);
                              }}
                              className="bg-yellow-600 text-black py-1 px-3 rounded-md border-2 border-golden-400 whitestone:border-white/30 shadow-lg transition-all duration-300"
                            >
                              Hold
                            </button>
                          ) : (
                            <button
                              onClick={async () => {
                                try {
                                  await axios.post(
                                    API_ENDPOINTS.ADMIN.UNHOLD_AUCTION(
                                      auction._id,
                                    ),
                                    { note: "" },
                                    { withCredentials: true },
                                  );
                                  toast.success("Auction unheld successfully");
                                  fetchAuctions();
                                } catch (error) {
                                  toast.error(
                                    error.response?.data?.message ||
                                      "Failed to unhold auction",
                                  );
                                }
                              }}
                              className="bg-emerald-500 text-white py-1 px-3 rounded-md border-2 border-golden-400 whitestone:border-white/30 shadow-lg transition-all duration-300"
                            >
                              Unhold
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedAuction(auction);
                              setAdminNote("");
                              setShowCancelModal(true);
                            }}
                            className="bg-red-600 text-white py-1 px-3 rounded-md border-2 border-golden-400 whitestone:border-white/30 shadow-lg transition-all duration-300"
                          >
                            Cancel
                          </button>

                          <button
                            onClick={() => {
                              setSelectedAuction(auction);
                              setShowNotesModal(true);
                            }}
                            className="bg-blue-600 text-white py-1 px-3 rounded-md border-2 border-golden-400 whitestone:border-white/30 shadow-lg transition-all duration-300"
                          >
                            Notes ({(auction.adminNotes || []).length})
                          </button>

                          <button
                            onClick={() => {
                              setSelectedAuction(auction);
                              setShowDeleteModal(true);
                            }}
                            className="bg-burgundy-gradient btn-hover shadow-lg border-2 border-golden-400 whitestone:border-white/30 text-warm-white whitestone:!text-white py-1 px-3 rounded-md transition-all duration-300"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        currentUser.role === "Super Admin" && (
                          <button
                            onClick={() => {
                              setSelectedAuction(auction);
                              setShowPermanentDeleteModal(true);
                            }}
                            className="bg-black py-1 px-3 rounded-md hover:bg-gray-800 border-2 border-red-500 whitestone:text-white"
                          >
                            Permanent Delete
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No auctions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Soft Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Auction</h3>
            <p className="mb-4">
              Auction: <strong>{selectedAuction?.title}</strong>
            </p>
            <div className="mb-4">
              <label className="block mb-2">Reason for deletion</label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                rows="3"
                placeholder="Enter reason..."
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteReason("");
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 whitestone:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSoftDelete}
                className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 whitestone:text-white"
              >
                Soft Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Modal */}
      {showPermanentDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-red-600">
              ⚠️ Permanent Delete Warning
            </h3>
            <p className="mb-4">
              Auction: <strong>{selectedAuction?.title}</strong>
            </p>
            <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded">
              <p className="text-red-700 font-semibold mb-2">
                This action cannot be undone!
              </p>
              <p className="text-red-600 text-sm">
                The auction will be permanently deleted from the database. All
                associated data will be lost forever.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowPermanentDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 whitestone:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handlePermanentDelete}
                className="px-4 py-2 bg-black rounded hover:bg-gray-800 whitestone:text-white"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h3 className="text-xl font-bold mb-4">Admin Notes for Auction</h3>
            <p className="mb-4">
              Auction: <strong>{selectedAuction?.title}</strong>
            </p>
            <div className="max-h-72 overflow-auto border p-3 rounded mb-4">
              {selectedAuction?.adminNotes &&
              selectedAuction.adminNotes.length > 0 ? (
                <ul className="space-y-3">
                  {selectedAuction.adminNotes.map((n, idx) => (
                    <li key={idx} className="p-3 bg-gray-50 rounded">
                      <div className="text-sm text-gray-700 mb-1">{n.note}</div>
                      <div className="text-xs text-gray-500">
                        Added by: {n.addedByName || n.addedBy || "Admin"} —{" "}
                        {n.addedAt
                          ? new Date(n.addedAt).toLocaleString()
                          : "Unknown"}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-sm text-gray-500">
                  No admin notes available for this auction.
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowNotesModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 whitestone:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Hold Auction Modal */}
      {showHoldModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Place Hold on Auction</h3>
            <p className="mb-4">
              Auction: <strong>{selectedAuction?.title}</strong>
            </p>
            <div className="mb-4">
              <label className="block mb-2">Reason / Note (required)</label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                rows="4"
                placeholder="Enter note explaining why this auction is being held"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowHoldModal(false);
                  setAdminNote("");
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 whitestone:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmHold}
                className="px-4 py-2 bg-yellow-600 text-black rounded hover:bg-yellow-700"
              >
                Place Hold
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Auction Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-red-600">
              Cancel Auction
            </h3>
            <p className="mb-4">
              Auction: <strong>{selectedAuction?.title}</strong>
            </p>
            <div className="mb-4">
              <label className="block mb-2">
                Reason for cancellation (required)
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                rows="4"
                placeholder="Enter reason for cancelling this auction"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setAdminNote("");
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 whitestone:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionManagement;
