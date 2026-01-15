import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../../config/env";
import { formatBDT } from "@/shared/utils/currency";

const SubmitCommission = () => {
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (parseFloat(amount) > user.unpaidCommission) {
      toast.error(
        `Amount cannot exceed your unpaid commission: ${formatBDT(
          user.unpaidCommission
        )}`
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.API_URL}/payment/commission/init`,
        { amount: parseFloat(amount), comment },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Redirect to SSLCommerz payment gateway
        window.location.href = response.data.gatewayUrl;
      } else {
        toast.error("Failed to initialize payment");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process payment");
      setLoading(false);
    }
  };

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-start">
        <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/30 whitestone:backdrop-blur-xl backdrop-blur-sm whitestone:backdrop-blur-xl mx-auto w-full h-auto px-2 flex flex-col gap-4 items-center py-4 justify-center rounded-md border-2 border-golden-400 whitestone:border-white/30 shadow-2xl">
          <form className="flex flex-col gap-5 w-full" onSubmit={handlePayment}>
            <h3
              className={`text-golden-500 whitestone:text-gray-900 text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl`}
            >
              Pay Commission via SSLCommerz
            </h3>

            {user.unpaidCommission > 0 ? (
              <>
                <div className="bg-golden-950/30 dark:bg-gray-900/30 whitestone:bg-blue-50 p-4 rounded-md border border-golden-400 whitestone:border-blue-300">
                  <p className="text-golden-300 whitestone:text-gray-900 text-lg font-semibold">
                    Unpaid Commission: {formatBDT(user.unpaidCommission)}
                  </p>
                  <p className="text-warm-white whitestone:text-gray-700 text-sm mt-2">
                    Pay your commission securely using SSLCommerz payment
                    gateway. You can use Credit/Debit Card, Mobile Banking, or
                    Internet Banking.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[16px] text-golden-300 whitestone:text-gray-900">
                    Amount (BDT) *
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount to pay"
                    required
                    min="1"
                    max={user.unpaidCommission}
                    className="text-[16px] py-2 px-3 bg-transparent border-[1px] rounded-md border-golden-400 whitestone:border-gray-400 focus:outline-none text-warm-white whitestone:text-gray-900 focus:border-golden-300 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[16px] text-golden-300 whitestone:text-gray-900">
                    Comment (Optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Add any additional notes..."
                    className="text-[16px] py-2 px-3 bg-transparent border-[1px] rounded-md border-golden-400 whitestone:border-gray-400 focus:outline-none text-warm-white whitestone:text-gray-900 resize-none"
                  />
                </div>

                <button
                  className="bg-gold-gradient shadow-lg border-2 border-golden-400 whitestone:border-white/30 mx-auto font-semibold text-xl transition-all duration-300 py-2 px-4 rounded-md !text-white my-4 btn-hover disabled:opacity-50"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Proceed to SSLCommerz Payment"}
                </button>
              </>
            ) : (
              <div className="bg-green-950/30 dark:bg-green-900/30 whitestone:bg-green-50 p-6 rounded-md border border-green-400">
                <p className="text-green-300 whitestone:text-green-900 text-lg font-semibold text-center">
                  ✓ No unpaid commissions
                </p>
                <p className="text-warm-white whitestone:text-gray-700 text-center mt-2">
                  You don't have any pending commissions to pay.
                </p>
              </div>
            )}
          </form>
        </div>
      </section>
    </>
  );
};

export default SubmitCommission;
