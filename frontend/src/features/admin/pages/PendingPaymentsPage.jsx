import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@/shared/components/Spinner";
import { formatBDT } from "@/shared/utils/currency";
import {
  getPendingPayments,
  getPendingPaymentsPage,
  approvePendingPayment,
  holdPendingPayment,
  unholdPendingPayment,
  addEscrowNote,
} from "@/store/slices/superAdminSlice";

const PendingPaymentsPage = () => {
  const dispatch = useDispatch();
  const { pendingPayments, loading, pendingPages } = useSelector(
    (state) => state.superAdmin,
  );
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [processedFilter, setProcessedFilter] = useState("All");
  const [holdFilter, setHoldFilter] = useState("All");

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: null,
    escrowId: null,
    note: "",
  });
  const [noteModal, setNoteModal] = useState({
    open: false,
    escrowId: null,
    note: "",
  });

  const openNoteModal = (id) =>
    setNoteModal({ open: true, escrowId: id, note: "" });
  const closeNoteModal = () =>
    setNoteModal({ open: false, escrowId: null, note: "" });

  const openConfirm = (type, id, prefill = "") =>
    setConfirmModal({ open: true, type, escrowId: id, note: prefill });
  const closeConfirm = () =>
    setConfirmModal({ open: false, type: null, escrowId: null, note: "" });

  useEffect(() => {
    const fetch = async () => {
      const status = statusFilter === "All" ? "All" : statusFilter;
      const processed =
        processedFilter === "All"
          ? "All"
          : processedFilter === "Processed"
            ? "Processed"
            : "NotProcessed";
      const hold =
        holdFilter === "All"
          ? "All"
          : holdFilter === "On Hold"
            ? "OnHold"
            : "NotOnHold";
      await dispatch(
        getPendingPaymentsPage({ page, limit, status, processed, hold }),
      );
    };
    fetch();
  }, [dispatch, page, limit, statusFilter, processedFilter, holdFilter]);

  useEffect(() => {
    setTotalPages(pendingPages || 1);
  }, [pendingPages]);

  if (loading) return <Spinner />;

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px]">
      <h1 className="text-3xl font-bold text-golden-500 mb-4">
        Pending Payments
      </h1>
      <p className="text-gray-400 mb-6">
        Escrowed payments awaiting admin approval.
      </p>

      {(!pendingPayments || pendingPayments.length === 0) && (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-8 text-center">
          <p className="text-gray-500">No pending payouts.</p>
        </div>
      )}

      {/* Filters */}
      {pendingPayments && pendingPayments.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <div>
            <label className="text-sm text-gray-400 mr-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-800 text-gray-200 px-2 py-1 rounded"
            >
              <option>All</option>
              <option>Held</option>
              <option>Pending</option>
              <option>Released</option>
              <option>Refunded</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mr-2">Processed</label>
            <select
              value={processedFilter}
              onChange={(e) => setProcessedFilter(e.target.value)}
              className="bg-gray-800 text-gray-200 px-2 py-1 rounded"
            >
              <option>All</option>
              <option>Processed</option>
              <option>Not Processed</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mr-2">Hold</label>
            <select
              value={holdFilter}
              onChange={(e) => setHoldFilter(e.target.value)}
              className="bg-gray-800 text-gray-200 px-2 py-1 rounded"
            >
              <option>All</option>
              <option>On Hold</option>
              <option>Not On Hold</option>
            </select>
          </div>
        </div>
      )}

      {/* Filtered table */}
      {pendingPayments && pendingPayments.length > 0 && (
        <div className="overflow-x-auto bg-white/5 rounded-md p-4">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-gray-300">
                <th className="py-2 px-3">Auction</th>
                <th className="py-2 px-3">Buyer</th>
                <th className="py-2 px-3">Seller</th>
                <th className="py-2 px-3">Total</th>
                <th className="py-2 px-3">Commission (7%)</th>
                <th className="py-2 px-3">Seller Receivable</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Processed</th>
                <th className="py-2 px-3">Hold</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingPayments.map((p) => (
                <tr key={p._id} className="border-t border-gray-700">
                  <td className="py-3 px-3 text-warm-white">
                    {p.auctionId?.title}
                  </td>
                  <td className="py-3 px-3 text-gray-300">
                    {p.buyerId?.userName} ({p.buyerId?.email})
                  </td>
                  <td className="py-3 px-3 text-gray-300">
                    {p.sellerId?.userName} ({p.sellerId?.email})
                  </td>
                  <td className="py-3 px-3 text-golden-300">
                    {formatBDT(p.totalAmount)}
                  </td>
                  <td className="py-3 px-3 text-golden-300">
                    {formatBDT(p.commissionAmount)}
                  </td>
                  <td className="py-3 px-3 text-golden-300">
                    {formatBDT(p.sellerAmount)}
                  </td>
                  <td className="py-3 px-3 text-gray-200">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        p.status === "Released"
                          ? "bg-emerald-800 text-emerald-300"
                          : p.status === "Held"
                            ? "bg-yellow-900 text-yellow-300"
                            : p.status === "Pending"
                              ? "bg-sky-900 text-sky-300"
                              : p.status === "Refunded"
                                ? "bg-red-900 text-red-300"
                                : "bg-gray-800 text-gray-200"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-200">
                    {p.processedAt
                      ? new Date(p.processedAt).toLocaleString()
                      : "Not processed"}
                  </td>
                  <td className="py-3 px-3 text-gray-200">
                    {p.adminHold ? (
                      <span className="text-red-400 font-semibold">
                        On Hold
                      </span>
                    ) : (
                      <span className="text-green-400 font-semibold">No</span>
                    )}
                  </td>
                  <td className="py-3 px-3 flex gap-2">
                    <button
                      onClick={() => openNoteModal(p._id)}
                      className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800"
                    >
                      Notes
                    </button>
                    {p.adminHold ? (
                      <button
                        onClick={() => openConfirm("unhold", p._id)}
                        className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                      >
                        Remove Hold
                      </button>
                    ) : (
                      <button
                        onClick={() => openConfirm("hold", p._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Place Hold
                      </button>
                    )}

                    <button
                      onClick={() => openConfirm("approve", p._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Approve Payout
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Notes Modal */}
      {noteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Admin Notes</h3>
            <div className="mb-4 max-h-40 overflow-y-auto">
              {(() => {
                const esc = pendingPayments.find(
                  (pp) => pp._id === noteModal.escrowId,
                );
                if (!esc || !esc.adminNotes || esc.adminNotes.length === 0)
                  return <p className="text-gray-500">No notes yet.</p>;
                return esc.adminNotes.map((n, i) => (
                  <div key={i} className="bg-gray-100 p-3 rounded mb-2">
                    <div className="text-sm text-gray-800">{n.note}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      By:{" "}
                      {n.addedByName ||
                        (n.addedBy ? n.addedBy.toString() : "Admin")}{" "}
                      • {new Date(n.addedAt).toLocaleString()}
                    </div>
                  </div>
                ));
              })()}
            </div>
            <div className="mb-4">
              <label className="text-sm text-gray-600">Add note</label>
              <textarea
                value={noteModal.note}
                onChange={(e) =>
                  setNoteModal((s) => ({ ...s, note: e.target.value }))
                }
                className="w-full bg-gray-50 border rounded p-2 mt-1"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeNoteModal}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!noteModal.note || noteModal.note.trim().length === 0)
                    return;
                  await dispatch(
                    addEscrowNote(noteModal.escrowId, noteModal.note),
                  );
                  const status = statusFilter === "All" ? "All" : statusFilter;
                  const processed =
                    processedFilter === "All"
                      ? "All"
                      : processedFilter === "Processed"
                        ? "Processed"
                        : "NotProcessed";
                  const hold =
                    holdFilter === "All"
                      ? "All"
                      : holdFilter === "On Hold"
                        ? "OnHold"
                        : "NotOnHold";
                  await dispatch(
                    getPendingPaymentsPage({
                      page,
                      limit,
                      status,
                      processed,
                      hold,
                    }),
                  );
                  closeNoteModal();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-gray-400">
          Page {page} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((s) => Math.max(1, s - 1))}
            disabled={page <= 1}
            className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((s) => Math.min(totalPages, s + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Confirm action</h3>
            <p className="text-gray-700 mb-6">
              {confirmModal.type === "hold" &&
                "Place a manual hold on this payout? Admin will review before release."}
              {confirmModal.type === "unhold" &&
                "Remove the manual hold and allow payout processing?"}
              {confirmModal.type === "approve" &&
                "Approve and process this payout now? This will record commission and snapshot seller payout info."}
            </p>
            {(confirmModal.type === "hold" ||
              confirmModal.type === "unhold") && (
              <div className="mb-4">
                <label className="text-sm text-gray-600">
                  Optional note (audit)
                </label>
                <textarea
                  value={confirmModal.note}
                  onChange={(e) =>
                    setConfirmModal((s) => ({ ...s, note: e.target.value }))
                  }
                  className="w-full bg-gray-50 border rounded p-2 mt-1"
                  rows={3}
                  placeholder="Add a brief reason or context for this action (optional)"
                />
              </div>
            )}
            {confirmModal.type === "hold" && (
              <div className="text-sm text-red-500 mb-3">
                Note is required when placing a hold.
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={closeConfirm}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const id = confirmModal.escrowId;
                  const note =
                    confirmModal.note && confirmModal.note.trim()
                      ? confirmModal.note.trim()
                      : "";
                  const status = statusFilter === "All" ? "All" : statusFilter;
                  const processed =
                    processedFilter === "All"
                      ? "All"
                      : processedFilter === "Processed"
                        ? "Processed"
                        : "NotProcessed";
                  const hold =
                    holdFilter === "All"
                      ? "All"
                      : holdFilter === "On Hold"
                        ? "OnHold"
                        : "NotOnHold";
                  if (confirmModal.type === "hold")
                    await dispatch(holdPendingPayment(id, note));
                  if (confirmModal.type === "unhold")
                    await dispatch(unholdPendingPayment(id, note));
                  if (confirmModal.type === "approve")
                    await dispatch(approvePendingPayment(id));
                  // Refresh current page with filters
                  await dispatch(
                    getPendingPaymentsPage({
                      page,
                      limit,
                      status,
                      processed,
                      hold,
                    }),
                  );
                  closeConfirm();
                }}
                disabled={
                  confirmModal.type === "hold" &&
                  (!confirmModal.note || confirmModal.note.trim().length === 0)
                }
                className={`px-4 py-2 rounded text-white ${confirmModal.type === "hold" && (!confirmModal.note || confirmModal.note.trim().length === 0) ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PendingPaymentsPage;
