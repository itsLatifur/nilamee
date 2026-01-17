import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Spinner from "@/custom-components/Spinner";
import { API_URL } from "@/config/env";
import { formatBDT } from "@/shared/utils/currency";

const EscrowDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [escrow, setEscrow] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/profile/escrow/${id}`, {
          withCredentials: true,
        });
        setEscrow(res.data.escrow);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <Spinner />;
  if (!escrow) return <div className="p-6">Escrow not found.</div>;

  return (
    <div className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-golden-500">Escrow Detail</h1>
        <div className="flex items-center gap-3">
          <Link to="/sell-history" className="text-sm text-blue-400">
            Back to Sell History
          </Link>
          <button
            onClick={() => {
              const r = escrow;
              const lines = [];
              lines.push("Payout Receipt");
              lines.push("------------------------");
              lines.push(`Escrow ID: ${r._id}`);
              lines.push(`Auction: ${r.auctionId?.title || "-"}`);
              lines.push(
                `Buyer: ${r.buyerId?.userName || "-"} (${r.buyerId?.email || "-"})`,
              );
              lines.push(
                `Seller: ${r.sellerId?.userName || "-"} (${r.sellerId?.email || "-"})`,
              );
              lines.push(`Total Amount: ${formatBDT(r.totalAmount)}`);
              lines.push(`Commission: ${formatBDT(r.commissionAmount)}`);
              lines.push(`Seller Receivable: ${formatBDT(r.sellerAmount)}`);
              lines.push(`Status: ${r.status}`);
              lines.push(
                `Released At: ${r.releasedAt ? new Date(r.releasedAt).toLocaleString() : "-"}`,
              );
              lines.push(
                `Processed At: ${r.processedAt ? new Date(r.processedAt).toLocaleString() : "-"}`,
              );
              lines.push("\nPayout Info:");
              if (r.payoutInfo) {
                lines.push(`  Method: ${r.payoutInfo.method || "-"}`);
                lines.push(`  Account: ${r.payoutInfo.account || "-"}`);
                lines.push(`  Name: ${r.payoutInfo.name || "-"}`);
              } else {
                lines.push("  None recorded");
              }
              const blob = new Blob([lines.join("\n")], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `payout-receipt-${r._id}.txt`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            }}
            className="px-3 py-1 bg-emerald-600 text-white rounded text-sm"
          >
            Download Receipt
          </button>
        </div>
      </div>

      <div className="bg-white/5 p-6 rounded-md">
        <h2 className="text-lg font-semibold mb-2">
          {escrow.auctionId?.title}
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-300">Buyer</p>
            <p className="text-white">
              {escrow.buyerId?.userName} ({escrow.buyerId?.email})
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-300">Total Amount</p>
            <p className="text-white">{formatBDT(escrow.totalAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-300">Seller Receivable</p>
            <p className="text-white">{formatBDT(escrow.sellerAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-300">Commission</p>
            <p className="text-white">{formatBDT(escrow.commissionAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-300">Status</p>
            <p className="text-white">{escrow.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-300">Admin Hold</p>
            <p className="text-white">{escrow.adminHold ? "Yes" : "No"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-300">Released At</p>
            <p className="text-white">
              {escrow.releasedAt
                ? new Date(escrow.releasedAt).toLocaleString()
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-300">Processed At</p>
            <p className="text-white">
              {escrow.processedAt
                ? new Date(escrow.processedAt).toLocaleString()
                : "-"}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">Payout Info</h3>
          {escrow.payoutInfo ? (
            <div className="bg-gray-900 p-3 rounded">
              <p className="text-sm text-gray-300">
                Method: {escrow.payoutInfo.method || "-"}
              </p>
              <p className="text-sm text-gray-300">
                Account: {escrow.payoutInfo.account || "-"}
              </p>
              <p className="text-sm text-gray-300">
                Name: {escrow.payoutInfo.name || "-"}
              </p>
            </div>
          ) : (
            <p className="text-gray-400">No payout info recorded yet.</p>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">Admin Notes</h3>
          {Array.isArray(escrow.adminNotes) && escrow.adminNotes.length > 0 ? (
            <ul className="space-y-2">
              {escrow.adminNotes.map((n, idx) => (
                <li key={idx} className="bg-gray-900 p-3 rounded">
                  <div className="text-gray-300 text-sm">{n.note}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    By:{" "}
                    {n.addedByName ||
                      (n.addedBy ? n.addedBy.toString() : "Admin")}{" "}
                    • {new Date(n.addedAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No notes from admin.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EscrowDetail;
