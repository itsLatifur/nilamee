import React, { useState } from "react";
import {
  FiX,
  FiCheck,
  FiStar,
  FiZap,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

const PremiumModal = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const handlePremiumPurchase = async () => {
    if (user?.isPremium) {
      toast.info("You already have premium subscription");
      onClose();
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/payment/premium/init",
        {},
        { withCredentials: true }
      );

      if (data.success && data.gatewayUrl) {
        // Redirect to payment gateway
        window.location.href = data.gatewayUrl;
      }
    } catch (error) {
      console.error("Premium purchase error:", error);
      toast.error(
        error.response?.data?.message || "Failed to initiate payment"
      );
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-burgundy-950 to-burgundy-900 blackgold:from-gray-900 blackgold:to-gray-800 whitestone:from-white whitestone:to-gray-50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-golden-400/30 whitestone:border-gray-200">
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-golden-400/20 whitestone:border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-golden-300 whitestone:text-gray-500 hover:text-golden-400 whitestone:hover:text-gray-700 transition-colors"
          >
            <FiX size={24} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gold-gradient whitestone:bg-blue-gradient flex items-center justify-center">
              <FiStar className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gold-gradient bg-clip-text text-transparent whitestone:text-blue-600">
                Upgrade to Premium
              </h2>
              <p className="text-golden-300 whitestone:text-gray-600 text-sm">
                Unlock exclusive features and benefits
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Premium Benefits */}
          <div className="mb-6">
            <h3 className="text-warm-white whitestone:text-gray-900 text-lg font-semibold mb-4">
              Premium Benefits
            </h3>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-burgundy-900/50 whitestone:bg-blue-50 border border-golden-400/20 whitestone:border-blue-200">
                <div className="w-8 h-8 rounded-full bg-gold-gradient whitestone:bg-blue-gradient flex items-center justify-center flex-shrink-0">
                  <FiZap className="text-white text-sm" />
                </div>
                <div>
                  <h4 className="text-warm-white whitestone:text-gray-900 font-semibold mb-1">
                    Priority Bidding
                  </h4>
                  <p className="text-golden-300 whitestone:text-gray-600 text-sm">
                    Get early access to new auctions and exclusive items before
                    regular users
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-burgundy-900/50 whitestone:bg-blue-50 border border-golden-400/20 whitestone:border-blue-200">
                <div className="w-8 h-8 rounded-full bg-gold-gradient whitestone:bg-blue-gradient flex items-center justify-center flex-shrink-0">
                  <FiShield className="text-white text-sm" />
                </div>
                <div>
                  <h4 className="text-warm-white whitestone:text-gray-900 font-semibold mb-1">
                    Extended Buyer Protection
                  </h4>
                  <p className="text-golden-300 whitestone:text-gray-600 text-sm">
                    60-day money-back guarantee and premium dispute resolution
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-burgundy-900/50 whitestone:bg-blue-50 border border-golden-400/20 whitestone:border-blue-200">
                <div className="w-8 h-8 rounded-full bg-gold-gradient whitestone:bg-blue-gradient flex items-center justify-center flex-shrink-0">
                  <FiTrendingUp className="text-white text-sm" />
                </div>
                <div>
                  <h4 className="text-warm-white whitestone:text-gray-900 font-semibold mb-1">
                    Lower Commission Fees
                  </h4>
                  <p className="text-golden-300 whitestone:text-gray-600 text-sm">
                    Save up to 50% on all transaction fees and commissions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-burgundy-900/50 whitestone:bg-blue-50 border border-golden-400/20 whitestone:border-blue-200">
                <div className="w-8 h-8 rounded-full bg-gold-gradient whitestone:bg-blue-gradient flex items-center justify-center flex-shrink-0">
                  <FiCheck className="text-white text-sm" />
                </div>
                <div>
                  <h4 className="text-warm-white whitestone:text-gray-900 font-semibold mb-1">
                    Verified Premium Badge
                  </h4>
                  <p className="text-golden-300 whitestone:text-gray-600 text-sm">
                    Stand out with a premium badge and boost your credibility
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-br from-golden-400/10 to-golden-600/10 whitestone:from-blue-50 whitestone:to-blue-100 border-2 border-golden-400/40 whitestone:border-blue-300">
            <div className="text-center">
              <div className="text-warm-white whitestone:text-gray-900 text-4xl font-bold mb-1">
                ৳999<span className="text-lg font-normal">/month</span>
              </div>
              <p className="text-golden-300 whitestone:text-gray-600 text-sm">
                Cancel anytime • No long-term commitment
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handlePremiumPurchase}
              disabled={loading || user?.isPremium}
              className={`flex-1 bg-gold-gradient whitestone:bg-blue-gradient text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center ${
                loading || user?.isPremium
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {loading
                ? "Processing..."
                : user?.isPremium
                ? "Already Premium"
                : "Get Premium Now"}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-burgundy-800/50 whitestone:bg-gray-200 text-warm-white whitestone:text-gray-700 font-semibold py-3 px-6 rounded-lg border-2 border-golden-400/30 whitestone:border-gray-300 hover:border-golden-400/50 whitestone:hover:border-gray-400 transition-all duration-300"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;
