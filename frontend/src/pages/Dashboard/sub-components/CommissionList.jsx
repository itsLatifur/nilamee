import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/custom-components/Spinner";
import { formatBDT } from "@/shared/utils/currency";

const CommissionList = () => {
  const [loading, setLoading] = useState(true);
  const [monthly, setMonthly] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const base =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const m = await axios.get(`${base}/api/v1/superadmin/monthlyincome`, {
          withCredentials: true,
        });
        setMonthly(m.data.totalMonthlyRevenue || []);
        const r = await axios.get(
          `${base}/api/v1/superadmin/recent-commissions`,
          { withCredentials: true },
        );
        setItems(r.data.items || []);
      } catch (err) {
        console.error("CommissionList fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Spinner />;

  const totalYTD = (monthly || []).reduce((s, v) => s + (v || 0), 0);
  const latestMonth =
    monthly && monthly.length ? monthly[monthly.length - 1] : 0;

  const [debug, setDebug] = useState(null);
  useEffect(() => {
    const fetchDebug = async () => {
      if (totalYTD === 0 && items.length === 0) {
        try {
          const base =
            import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
          const d = await axios.get(
            `${base}/api/v1/superadmin/debug/commissions`,
            { withCredentials: true },
          );
          setDebug(d.data);
        } catch (err) {
          console.error("CommissionList debug fetch failed:", err);
        }
      }
    };
    fetchDebug();
  }, [totalYTD, items.length]);

  return (
    <div className="bg-white/5 p-4 rounded-md">
      <h4 className="text-white font-semibold mb-2">Platform Revenue</h4>
      <div className="flex gap-4 items-center mb-4">
        <div>
          <div className="text-sm text-gray-300">YTD Commission</div>
          <div className="text-2xl text-white font-bold">
            {formatBDT(totalYTD)}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-300">Latest Month</div>
          <div className="text-xl text-white">{formatBDT(latestMonth)}</div>
        </div>
      </div>

      <h5 className="text-white text-sm mb-2">Recent Processed Sales</h5>
      <div className="space-y-2">
        {items.length === 0 && !debug ? (
          <div className="text-gray-400">No processed sales yet.</div>
        ) : (
          (items.length > 0
            ? items.slice(0, 10)
            : debug?.escrow?.sample || []
          ).map((it) => {
            const display =
              items.length > 0
                ? it
                : {
                    escrowId: it._id,
                    auctionTitle: it.auctionId?.title || "(auction)",
                    commissionAmount: it.commissionAmount || it.commission || 0,
                    sellerAmount: it.sellerAmount || 0,
                    seller: it.sellerId
                      ? { userName: it.sellerId.userName }
                      : null,
                  };
            return (
              <div
                key={display.escrowId}
                className="p-2 bg-gray-900 rounded flex justify-between items-center"
              >
                <div>
                  <div className="text-sm text-gray-300">
                    {display.auctionTitle}
                  </div>
                  <div className="text-xs text-gray-500">
                    Seller: {display.seller?.userName || "-"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-300">Commission</div>
                  <div className="text-white font-medium">
                    {formatBDT(display.commissionAmount)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        {debug && (
          <div className="mt-3 text-xs text-gray-400">
            Debug: Commission count {debug.commission?.count || 0}, total{" "}
            {formatBDT(debug.commission?.total || 0)}; Processed escrows{" "}
            {debug.escrow?.count || 0}.
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionList;
