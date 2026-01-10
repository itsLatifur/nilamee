import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../../config/env";

const PaymentInfo = () => {
  const { user } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    bankName: "",
    bankAccountNumber: "",
    bankAccountName: "",
    mobileWallet: "",
    mobileWalletNumber: "",
    additionalInfo: "",
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchPaymentInfo();
  }, []);

  const fetchPaymentInfo = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.USER.PAYMENT_INFO}`, {
        withCredentials: true,
      });
      if (response.data.paymentInfo) {
        setFormData({
          bankName: response.data.paymentInfo.bankName || "",
          bankAccountNumber: response.data.paymentInfo.bankAccountNumber || "",
          bankAccountName: response.data.paymentInfo.bankAccountName || "",
          mobileWallet: response.data.paymentInfo.mobileWallet || "",
          mobileWalletNumber:
            response.data.paymentInfo.mobileWalletNumber || "",
          additionalInfo: response.data.paymentInfo.additionalInfo || "",
        });
        setLastUpdated(response.data.paymentInfo.lastUpdated);
      }
    } catch (error) {
      console.error("Failed to fetch payment info:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_ENDPOINTS.USER.PAYMENT_INFO}`,
        formData,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setLastUpdated(response.data.paymentInfo.lastUpdated);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update payment info"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm("Are you sure you want to reset all payment information?")
    ) {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.delete(
        `${API_ENDPOINTS.USER.PAYMENT_INFO}`,
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setFormData({
        bankName: "",
        bankAccountNumber: "",
        bankAccountName: "",
        mobileWallet: "",
        mobileWalletNumber: "",
        additionalInfo: "",
      });
      setLastUpdated(new Date());
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reset payment info"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4">
      <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/30 whitestone:backdrop-blur-xl backdrop-blur-sm mx-auto w-full max-w-4xl px-6 py-8 rounded-md border-2 border-golden-400 whitestone:border-white/30 shadow-2xl">
        <h1 className="text-golden-500 whitestone:text-gray-900 text-3xl font-bold mb-6">
          Payment Information
        </h1>

        {lastUpdated && (
          <div className="bg-golden-950/30 dark:bg-gray-900/30 whitestone:bg-blue-50 p-3 rounded-md border border-golden-400 whitestone:border-blue-300 mb-6">
            <p className="text-golden-300 whitestone:text-gray-700 text-sm">
              Last Updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Bank Details */}
          <div>
            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-4">
              Bank Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-golden-300 whitestone:text-gray-900 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="e.g., Dutch-Bangla Bank"
                  className="px-4 py-2 bg-transparent border border-golden-400 whitestone:border-gray-400 rounded-md text-warm-white whitestone:text-gray-900 focus:outline-none focus:border-golden-300"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-golden-300 whitestone:text-gray-900 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleChange}
                  placeholder="e.g., 1234567890"
                  className="px-4 py-2 bg-transparent border border-golden-400 whitestone:border-gray-400 rounded-md text-warm-white whitestone:text-gray-900 focus:outline-none focus:border-golden-300"
                />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="text-golden-300 whitestone:text-gray-900 mb-2">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  name="bankAccountName"
                  value={formData.bankAccountName}
                  onChange={handleChange}
                  placeholder="e.g., John Doe"
                  className="px-4 py-2 bg-transparent border border-golden-400 whitestone:border-gray-400 rounded-md text-warm-white whitestone:text-gray-900 focus:outline-none focus:border-golden-300"
                />
              </div>
            </div>
          </div>

          {/* Mobile Wallet Details */}
          <div>
            <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900 mb-4">
              Mobile Wallet
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-golden-300 whitestone:text-gray-900 mb-2">
                  Wallet Type
                </label>
                <select
                  name="mobileWallet"
                  value={formData.mobileWallet}
                  onChange={handleChange}
                  className="px-4 py-2 bg-transparent border border-golden-400 whitestone:border-gray-400 rounded-md text-warm-white whitestone:text-gray-900 focus:outline-none focus:border-golden-300"
                >
                  <option value="">Select Wallet</option>
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                  <option value="Upay">Upay</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-golden-300 whitestone:text-gray-900 mb-2">
                  Wallet Number
                </label>
                <input
                  type="text"
                  name="mobileWalletNumber"
                  value={formData.mobileWalletNumber}
                  onChange={handleChange}
                  placeholder="e.g., 01712345678"
                  className="px-4 py-2 bg-transparent border border-golden-400 whitestone:border-gray-400 rounded-md text-warm-white whitestone:text-gray-900 focus:outline-none focus:border-golden-300"
                />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex flex-col">
            <label className="text-golden-300 whitestone:text-gray-900 mb-2">
              Additional Information
            </label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              rows={4}
              placeholder="Any additional payment instructions or notes..."
              className="px-4 py-2 bg-transparent border border-golden-400 whitestone:border-gray-400 rounded-md text-warm-white whitestone:text-gray-900 focus:outline-none focus:border-golden-300 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 flex-wrap justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-gold-gradient shadow-lg border-2 border-golden-400 whitestone:border-white/30 font-semibold text-lg transition-all duration-300 py-2 px-8 rounded-md !text-white btn-hover disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Payment Info"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 shadow-lg border-2 border-red-500 font-semibold text-lg transition-all duration-300 py-2 px-8 rounded-md !text-white disabled:opacity-50"
            >
              Reset All
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PaymentInfo;
