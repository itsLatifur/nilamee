import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "@/config/env";
import Spinner from "@/custom-components/Spinner";
import { formatBDT } from "@/shared/utils/currency";

const SellHistory = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [receivable, setReceivable] = useState(0);
  const [escrows, setEscrows] = useState([]);
  const [lastProcessedId, setLastProcessedId] = useState(null);
  const currentUser = useSelector((state) => state.user.user);
  const escrowsByAuction = useMemo(() => {
    const map = {};
    (escrows || []).forEach((e) => {
      if (e.auctionId && e.auctionId._id) map[e.auctionId._id] = e;
    });
    return map;
  }, [escrows]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [sRes, rRes, eRes] = await Promise.all([
          axios.get(`${API_URL}/profile/my-stats`, { withCredentials: true }),
          axios.get(`${API_URL}/profile/my-receivables`, {
            withCredentials: true,
          }),
          axios.get(`${API_URL}/profile/my-escrows`, { withCredentials: true }),
        ]);
        setStats(sRes.data.stats);
        setReceivable(rRes.data.receivable || 0);
        setEscrows(eRes.data.escrows || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    // refresh on global escrow processed event
    const onProcessed = (e) => {
      // simple refetch
      fetchAll();
      if (e && e.detail && e.detail._id) {
        setLastProcessedId(e.detail._id);
      }
    };
    window.addEventListener("escrowProcessed", onProcessed);
    return () => window.removeEventListener("escrowProcessed", onProcessed);
  }, []);

  if (loading) return <Spinner />;

  // Ensure defaults when no data
  const safeStats = stats || {};

  // If no transaction history, show zero values
  if (!safeStats.transactionHistory) safeStats.transactionHistory = [];

  // Use totalTransactionVolume as total earned (lifetime), and show completed auctions
  const totalEarned = safeStats.totalTransactionVolume || 0;
  const completedCount = safeStats.completedAuctionsCount || 0;
  const sellTransactions = (safeStats.transactionHistory || []).filter(
    (t) => t.role === "Auctioneer",
  );

  return (
    <article className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
      <h1 className="text-golden-500 whitestone:text-gray-900 text-3xl font-bold mb-4">
        Sell History
      </h1>

      <div className="overflow-x-auto bg-white/5 rounded-md p-4">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-gray-300">
              <th className="py-2 px-3">Auction</th>
              <th className="py-2 px-3">Seller Receivable</th>
              <th className="py-2 px-3">Commission</th>
              <th className="py-2 px-3">Completed At</th>
              <th className="py-2 px-3">Outcome</th>
              <th className="py-2 px-3">Escrow Status</th>
            </tr>
          </thead>
          <tbody>
            {escrows.length === 0 ? (
              sellTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-400">
                    No sales yet.
                  </td>
                </tr>
              ) : (
                sellTransactions.map((t) => (
                  <tr key={t._id} className="border-t border-gray-700">
                    <td className="py-3 px-3 text-warm-white">
                      <a href="#" className="text-blue-300 hover:underline">
                        {t.auctionTitle}
                      </a>
                    </td>
                    <td className="py-3 px-3 text-golden-300">
                      {formatBDT(t.amount)}
                    </td>
                    <td className="py-3 px-3 text-gray-300">
                      {t.completedAt
                        ? new Date(t.completedAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="py-3 px-3 text-gray-300">{t.outcome}</td>
                    <td className="py-3 px-3 text-gray-300">-</td>
                  </tr>
                ))
              )
            ) : (
              escrows.map((esc) => (
                <tr
                  key={esc._id}
                  className={`border-t border-gray-700 ${(() => {
                    if (esc._id === lastProcessedId)
                      return "bg-green-900/50 animate-pulse";
                    if (
                      esc.processedAt &&
                      Date.now() - new Date(esc.processedAt).getTime() <
                        5 * 60 * 1000
                    )
                      return "bg-green-900/20";
                    return "";
                  })()}`}
                >
                  <td className="py-3 px-3 text-warm-white">
                    <a
                      href={`/escrow/${esc._id}`}
                      className="text-blue-300 hover:underline"
                    >
                      {esc.auctionId?.title || "(auction)"}
                    </a>
                  </td>
                  <td className="py-3 px-3 text-golden-300">
                    {formatBDT(
                      typeof esc.sellerAmount === "number"
                        ? esc.sellerAmount
                        : esc.totalAmount || 0,
                    )}
                  </td>
                  <td className="py-3 px-3 text-golden-300">
                    {formatBDT(esc.commissionAmount || 0)}
                  </td>
                  <td className="py-3 px-3 text-gray-300">
                    {esc.processedAt
                      ? new Date(esc.processedAt).toLocaleString()
                      : esc.receivedAt
                        ? new Date(esc.receivedAt).toLocaleString()
                        : esc.shippedAt
                          ? new Date(esc.shippedAt).toLocaleString()
                          : esc.createdAt
                            ? new Date(esc.createdAt).toLocaleString()
                            : "-"}
                  </td>
                  <td className="py-3 px-3 text-gray-300">
                    {esc.outcome ||
                      (esc.status === "Refunded" ? "Refunded" : "Sale")}
                  </td>
                  <td className="py-3 px-3 text-gray-300">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {esc.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {esc.processedAt
                            ? `Processed: ${new Date(esc.processedAt).toLocaleString()}`
                            : esc.adminHold
                              ? "On Hold"
                              : esc.status === "Released"
                                ? "Released - awaiting processing"
                                : "Not processed"}
                        </span>
                      </div>
                      {(esc.status === "Released" || esc.status === "Held") &&
                      currentUser &&
                      (currentUser._id ===
                        (esc.sellerId?._id || esc.sellerId) ||
                        currentUser.role === "Admin" ||
                        currentUser.role === "Super Admin") ? (
                        <button
                          onClick={async () => {
                            try {
                              await axios.put(
                                `${API_URL}/profile/escrow/ship/${esc._id}`,
                                {},
                                { withCredentials: true },
                              );
                              // refresh list
                              const [sRes, rRes, eRes] = await Promise.all([
                                axios.get(`${API_URL}/profile/my-stats`, {
                                  withCredentials: true,
                                }),
                                axios.get(`${API_URL}/profile/my-receivables`, {
                                  withCredentials: true,
                                }),
                                axios.get(`${API_URL}/profile/my-escrows`, {
                                  withCredentials: true,
                                }),
                              ]);
                              setStats(sRes.data.stats);
                              setReceivable(rRes.data.receivable || 0);
                              setEscrows(eRes.data.escrows || []);
                            } catch (err) {
                              console.error(err);
                              alert(
                                err?.response?.data?.message ||
                                  "Failed to mark shipped",
                              );
                            }
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                        >
                          Mark Shipped
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
};

export default SellHistory;
