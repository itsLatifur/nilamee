import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@/shared/components/Spinner";
import { formatBDT } from "@/shared/utils/currency";
import {
  getPendingPayments,
  approvePendingPayment,
} from "@/store/slices/superAdminSlice";

const PendingPaymentsPage = () => {
  const dispatch = useDispatch();
  const { pendingPayments, loading } = useSelector((state) => state.superAdmin);

  useEffect(() => {
    dispatch(getPendingPayments());
  }, [dispatch]);

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
                  <td className="py-3 px-3">
                    <button
                      onClick={() => dispatch(approvePendingPayment(p._id))}
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
    </section>
  );
};

export default PendingPaymentsPage;
