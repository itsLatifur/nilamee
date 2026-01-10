import React from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full ml-0 m-0 h-screen px-5 pt-20 lg:pl-[320px] flex flex-col items-center justify-center">
      <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/30 whitestone:backdrop-blur-xl backdrop-blur-sm max-w-2xl w-full px-6 py-8 flex flex-col gap-6 items-center rounded-md border-2 border-golden-400 whitestone:border-white/30 shadow-2xl">
        <FaExclamationCircle className="text-6xl text-yellow-500" />

        <h1 className="text-golden-500 whitestone:text-gray-900 text-3xl font-bold text-center">
          Payment Cancelled
        </h1>

        <div className="bg-yellow-950/30 dark:bg-yellow-900/30 whitestone:bg-yellow-50 p-6 rounded-md border border-yellow-400 w-full">
          <p className="text-warm-white whitestone:text-gray-900 text-center">
            You have cancelled the payment process.
          </p>
        </div>

        <p className="text-warm-white whitestone:text-gray-700 text-center">
          Your commission payment was cancelled. You can try again when you're
          ready.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => navigate("/submit-commission")}
            className="bg-gold-gradient shadow-lg border-2 border-golden-400 whitestone:border-white/30 font-semibold text-lg transition-all duration-300 py-2 px-6 rounded-md !text-white btn-hover"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-burgundy-gradient shadow-lg border-2 border-golden-400 whitestone:border-white/30 font-semibold text-lg transition-all duration-300 py-2 px-6 rounded-md !text-white btn-hover"
          >
            Go Home
          </button>
        </div>
      </div>
    </section>
  );
};

export default PaymentCancelled;
