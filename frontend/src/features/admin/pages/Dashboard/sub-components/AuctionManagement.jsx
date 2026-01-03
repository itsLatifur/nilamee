import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../../../config/env";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AuctionManagement = () => {
  const { user: currentUser } = useSelector((state) => state.user);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermanentDeleteModal, setShowPermanentDeleteModal] =
    useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");

  const fetchAuctions = async () => {
    setLoading(true);
    try {
      if (showDeleted) {
        const { data } = await axios.get(
          `${API_ENDPOINTS.ADMIN.SOFT_DELETED}?type=auctions`,
          { withCredentials: true }
        );
        setAuctions(data.items);
      } else {
        const { data } = await axios.get(API_ENDPOINTS.AUCTION.ALL, {
          withCredentials: true,
        });
        setAuctions(data.items || data.allAuctions || []);
      }
    } catch (error) {
      toast.error("Failed to fetch auctions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [showDeleted]);

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
        }
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
        { withCredentials: true }
      );
      toast.success("Auction permanently deleted from database");
      setShowPermanentDeleteModal(false);
      fetchAuctions();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to permanently delete auction"
      );
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
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/30 backdrop-blur-sm border-2 border-golden-400 whitestone:border-white/30 rounded-lg">
            <thead className="bg-burgundy-700 dark:bg-gray-900 whitestone:bg-gray-200 text-white whitestone:text-black">
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
                      {auction.isDeleted ? (
                        <span className="px-2 py-1 bg-red-500 text-white rounded text-xs">
                          Deleted
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-500 text-white rounded text-xs">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 flex flex-wrap gap-2">
                      <Link
                        to={`/auction/details/${auction._id}`}
                        className="bg-gold-gradient whitestone:bg-amber-600 btn-hover text-warm-white whitestone:text-white py-1 px-3 rounded-md border-2 border-golden-400 whitestone:border-amber-500 shadow-lg transition-all duration-300"
                      >
                        View
                      </Link>
                      {!auction.isDeleted ? (
                        <button
                          onClick={() => {
                            setSelectedAuction(auction);
                            setShowDeleteModal(true);
                          }}
                          className="bg-burgundy-gradient btn-hover shadow-lg border-2 border-golden-400 whitestone:border-white/30 text-warm-white whitestone:!text-white py-1 px-3 rounded-md transition-all duration-300"
                        >
                          Delete
                        </button>
                      ) : (
                        currentUser.role === "Super Admin" && (
                          <button
                            onClick={() => {
                              setSelectedAuction(auction);
                              setShowPermanentDeleteModal(true);
                            }}
                            className="bg-black text-white py-1 px-3 rounded-md hover:bg-gray-800 border-2 border-red-500"
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
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSoftDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handlePermanentDelete}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionManagement;
