import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config/env";
import Spinner from "@/custom-components/Spinner";
import { formatBDT } from "@/shared/utils/currency";

const SellHistory = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [receivable, setReceivable] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [sRes, rRes] = await Promise.all([
          axios.get(`${API_URL}/profile/my-stats`, { withCredentials: true }),
          axios.get(`${API_URL}/profile/my-receivables`, {
            withCredentials: true,
          }),
        ]);
        setStats(sRes.data.stats);
        setReceivable(rRes.data.receivable || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
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
    (t) => t.role === "Auctioneer"
  );

  return (
    <article className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
      <h1 className="text-golden-500 whitestone:text-gray-900 text-3xl font-bold mb-4">
        Sell History
      </h1>
      <div className="mb-6 flex items-center gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-5 rounded-md">
          <p className="text-sm text-white" style={{ color: "#FFFFFF" }}>
            Total Earned
          </p>
          <p
            className="text-2xl text-white font-bold"
            style={{ color: "#FFFFFF" }}
          >
            {formatBDT(totalEarned)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-5 rounded-md">
          <p className="text-sm text-white" style={{ color: "#FFFFFF" }}>
            Completed Auctions
          </p>
          <p
            className="text-2xl text-white font-bold"
            style={{ color: "#FFFFFF" }}
          >
            {completedCount}
          </p>
        </div>
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-5 rounded-md">
          <p className="text-sm text-white" style={{ color: "#FFFFFF" }}>
            Receivable{receivable > 0 ? " (On hold)" : ""}
          </p>
          <p
            className="text-2xl text-white font-bold"
            style={{ color: "#FFFFFF" }}
          >
            {formatBDT(receivable || 0)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white/5 rounded-md p-4">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-gray-300">
              <th className="py-2 px-3">Auction</th>
              <th className="py-2 px-3">Amount</th>
              <th className="py-2 px-3">Completed At</th>
              <th className="py-2 px-3">Outcome</th>
            </tr>
          </thead>
          <tbody>
            {sellTransactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-400">
                  No sales yet.
                </td>
              </tr>
            ) : (
              sellTransactions.map((t) => (
                <tr key={t._id} className="border-t border-gray-700">
                  <td className="py-3 px-3 text-warm-white">
                    {t.auctionTitle}
                  </td>
                  <td className="py-3 px-3 text-golden-300">
                    {formatBDT(t.amount)}
                  </td>
                  <td className="py-3 px-3 text-gray-300">
                    {new Date(t.completedAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-gray-300">{t.outcome}</td>
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
