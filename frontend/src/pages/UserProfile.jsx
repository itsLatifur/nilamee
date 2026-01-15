import Spinner from "@/custom-components/Spinner";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiMail, FiPhone, FiMapPin, FiCalendar, FiUser, FiAward, FiDollarSign, FiCreditCard } from "react-icons/fi";

const UserProfile = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated]);
  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-start">
        {loading ? (
          <Spinner />
        ) : (
          <div className="max-w-7xl mx-auto w-full">
            {/* Profile Header Card */}
            <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 whitestone:bg-white backdrop-blur-sm rounded-2xl p-8 mb-6 border-2 border-golden-400/30 whitestone:border-gray-200 shadow-xl">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Profile Image */}
                <div className="relative">
                  <img
                    src={user.profileImage?.url || "/imageHolder.jpg"}
                    alt={user.userName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-golden-400 whitestone:border-blue-500 shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-gold-gradient whitestone:bg-blue-gradient text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    {user.role}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-warm-white whitestone:text-gray-900 mb-2">
                    {user.userName}
                  </h1>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start text-golden-300 whitestone:text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiMail className="text-lg" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <FiPhone className="text-lg" />
                        <span className="text-sm">{user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-lg" />
                      <span className="text-sm">Joined {user.createdAt?.substring(0, 10)}</span>
                    </div>
                  </div>
                  {user.address && (
                    <div className="flex items-center gap-2 mt-3 text-golden-300 whitestone:text-gray-600 justify-center md:justify-start">
                      <FiMapPin className="text-lg" />
                      <span className="text-sm">{user.address}</span>
                    </div>
                  )}
                </div>

                {/* Stats Cards */}
                {user.role === "Bidder" && (
                  <div className="flex gap-4">
                    <div className="bg-burgundy-900/30 whitestone:bg-blue-50 rounded-lg p-4 text-center min-w-[100px]">
                      <FiAward className="text-2xl text-golden-400 whitestone:text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-warm-white whitestone:text-gray-900">{user.auctionsWon || 0}</div>
                      <div className="text-xs text-golden-300 whitestone:text-gray-600">Auctions Won</div>
                    </div>
                    <div className="bg-burgundy-900/30 whitestone:bg-blue-50 rounded-lg p-4 text-center min-w-[100px]">
                      <FiDollarSign className="text-2xl text-golden-400 whitestone:text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-warm-white whitestone:text-gray-900">৳{user.moneySpent || 0}</div>
                      <div className="text-xs text-golden-300 whitestone:text-gray-600">Total Spent</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {user.role === "Auctioneer" && (
                <>
                  {/* Payment Details Card */}
                  <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 whitestone:bg-white backdrop-blur-sm rounded-2xl p-6 border-2 border-golden-400/30 whitestone:border-gray-200 shadow-xl lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                      <FiCreditCard className="text-3xl text-golden-400 whitestone:text-blue-600" />
                      <h3 className="text-2xl font-bold text-warm-white whitestone:text-gray-900">Payment Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-golden-300 whitestone:text-gray-700">
                          Bank Name
                        </label>
                        <div className="bg-burgundy-900/30 whitestone:bg-gray-50 rounded-lg p-3 text-warm-white whitestone:text-gray-900">
                          {user.paymentMethods.bankTransfer.bankName || "Not provided"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-golden-300 whitestone:text-gray-700">
                          Bank Account (IBAN)
                        </label>
                        <div className="bg-burgundy-900/30 whitestone:bg-gray-50 rounded-lg p-3 text-warm-white whitestone:text-gray-900">
                          {user.paymentMethods.bankTransfer.bankAccountNumber || "Not provided"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-golden-300 whitestone:text-gray-700">
                          Account Holder Name
                        </label>
                        <div className="bg-burgundy-900/30 whitestone:bg-gray-50 rounded-lg p-3 text-warm-white whitestone:text-gray-900">
                          {user.paymentMethods.bankTransfer.bankAccountName || "Not provided"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-golden-300 whitestone:text-gray-700">
                          Easypaisa Account
                        </label>
                        <div className="bg-burgundy-900/30 whitestone:bg-gray-50 rounded-lg p-3 text-warm-white whitestone:text-gray-900">
                          {user.paymentMethods.easypaisa.easypaisaAccountNumber || "Not provided"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-golden-300 whitestone:text-gray-700">
                          Paypal Email
                        </label>
                        <div className="bg-burgundy-900/30 whitestone:bg-gray-50 rounded-lg p-3 text-warm-white whitestone:text-gray-900">
                          {user.paymentMethods.paypal.paypalEmail || "Not provided"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Auctioneer Stats */}
                  <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 whitestone:bg-white backdrop-blur-sm rounded-2xl p-6 border-2 border-golden-400/30 whitestone:border-gray-200 shadow-xl">
                    <h3 className="text-xl font-bold text-warm-white whitestone:text-gray-900 mb-4">Commission Details</h3>
                    <div className="bg-burgundy-900/30 whitestone:bg-blue-50 rounded-lg p-6 text-center">
                      <FiDollarSign className="text-4xl text-golden-400 whitestone:text-blue-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-warm-white whitestone:text-gray-900 mb-1">
                        ৳{user.unpaidCommission || 0}
                      </div>
                      <div className="text-sm text-golden-300 whitestone:text-gray-600">Unpaid Commissions</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default UserProfile;
