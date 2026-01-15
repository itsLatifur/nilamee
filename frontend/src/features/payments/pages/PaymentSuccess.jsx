import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { fetchUser } from "../../auth/store/userSlice";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // SSLCommerz sends 'tran_id', we also support custom 'tranId'
  const sslTranId = searchParams.get("tran_id");
  const customTranId = searchParams.get("tranId");
  const transactionId = customTranId || sslTranId;
  const type = searchParams.get("type");

  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Payment Success Page - Query Params:", {
      type,
      transactionId,
      sslTranId,
      customTranId,
      allParams: Object.fromEntries(searchParams),
    });

    const isPremiumPayment =
      type === "premium" || transactionId?.startsWith("PREM-");

    if (isPremiumPayment) {
      // Premium already activated by backend - just refresh user data
      toast.success("Premium subscription activated successfully!");

      // Wait a moment then fetch updated user data
      setTimeout(() => {
        dispatch(fetchUser());
      }, 500);

      // Auto-redirect to premium page after 3 seconds
      setTimeout(() => {
        navigate("/premium");
      }, 3000);
    }

    setLoading(false);
  }, [type, transactionId, navigate, dispatch, searchParams]);

  const isPremium = type === "premium" || transactionId?.startsWith("PREM-");

  return (
    <section className="w-full ml-0 m-0 min-h-screen px-5 pt-20 lg:pl-[320px] flex flex-col items-center justify-center bg-burgundy-950 dark:bg-black whitestone:bg-gray-50">
      {loading ? (
        <div className="text-golden-400 whitestone:text-gray-900 text-2xl font-semibold animate-pulse">
          Verifying payment...
        </div>
      ) : (
        <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/30 whitestone:backdrop-blur-xl backdrop-blur-sm max-w-2xl w-full px-6 py-8 flex flex-col gap-6 items-center rounded-md border-2 border-golden-400 whitestone:border-white/30 shadow-2xl">
          <FaCheckCircle className="text-6xl text-green-500" />

          <h1 className="text-golden-500 whitestone:text-gray-900 text-3xl font-bold text-center">
            {isPremium ? "Premium Activated!" : "Payment Successful!"}
          </h1>

          <div className="bg-green-950/30 dark:bg-green-900/30 whitestone:bg-green-50 p-6 rounded-md border border-green-400 w-full">
            <p className="text-warm-white whitestone:text-gray-900 text-center mb-3">
              {isPremium
                ? "Your premium subscription has been successfully activated."
                : "Your commission payment has been successfully processed."}
            </p>
            {transactionId && (
              <p className="text-golden-300 whitestone:text-gray-700 text-sm text-center">
                Transaction ID:{" "}
                <span className="font-mono font-semibold">{transactionId}</span>
              </p>
            )}
          </div>

          <p className="text-warm-white whitestone:text-gray-700 text-center">
            {isPremium
              ? "You now have access to all premium features including priority bidding, lower fees, and extended protection."
              : "Your payment has been confirmed and your commission balance has been updated. You can now continue creating new auctions."}
          </p>

          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={() => navigate(isPremium ? "/" : "/me")}
              className="bg-gold-gradient shadow-lg border-2 border-golden-400 whitestone:border-white/30 font-semibold text-lg transition-all duration-300 py-2 px-6 rounded-md !text-white btn-hover"
            >
              {isPremium ? "Go Home" : "View Profile"}
            </button>
            <button
              onClick={() =>
                navigate(isPremium ? "/auctions" : "/create-auction")
              }
              className="bg-burgundy-gradient shadow-lg border-2 border-golden-400 whitestone:border-white/30 font-semibold text-lg transition-all duration-300 py-2 px-6 rounded-md !text-white btn-hover"
            >
              {isPremium ? "Browse Auctions" : "Create New Auction"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PaymentSuccess;
