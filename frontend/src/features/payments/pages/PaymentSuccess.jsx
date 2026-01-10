import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = searchParams.get("tran_id");

  return (
    <section className="w-full ml-0 m-0 h-screen px-5 pt-20 lg:pl-[320px] flex flex-col items-center justify-center">
      <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/30 whitestone:backdrop-blur-xl backdrop-blur-sm max-w-2xl w-full px-6 py-8 flex flex-col gap-6 items-center rounded-md border-2 border-golden-400 whitestone:border-white/30 shadow-2xl">
        <FaCheckCircle className="text-6xl text-green-500" />

        <h1 className="text-golden-500 whitestone:text-gray-900 text-3xl font-bold text-center">
          Payment Successful!
        </h1>

        <div className="bg-green-950/30 dark:bg-green-900/30 whitestone:bg-green-50 p-6 rounded-md border border-green-400 w-full">
          <p className="text-warm-white whitestone:text-gray-900 text-center mb-3">
            Your commission payment has been successfully processed.
          </p>
          {transactionId && (
            <p className="text-golden-300 whitestone:text-gray-700 text-sm text-center">
              Transaction ID:{" "}
              <span className="font-mono font-semibold">{transactionId}</span>
            </p>
          )}
        </div>

        <p className="text-warm-white whitestone:text-gray-700 text-center">
          Your payment has been confirmed and your commission balance has been
          updated. You can now continue creating new auctions.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => navigate("/me")}
            className="bg-gold-gradient shadow-lg border-2 border-golden-400 whitestone:border-white/30 font-semibold text-lg transition-all duration-300 py-2 px-6 rounded-md !text-white btn-hover"
          >
            View Profile
          </button>
          <button
            onClick={() => navigate("/create-auction")}
            className="bg-burgundy-gradient shadow-lg border-2 border-golden-400 whitestone:border-white/30 font-semibold text-lg transition-all duration-300 py-2 px-6 rounded-md !text-white btn-hover"
          >
            Create New Auction
          </button>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccess;
