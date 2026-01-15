import Spinner from "../../../shared/components/Spinner";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../../config/env";
import { fetchUser } from "../../auth/store/userSlice";
import BadgeDisplay from "../../../shared/components/BadgeDisplay";
import PremiumBadge from "../../../shared/components/PremiumBadge";
import VerifiedBadge from "../../../shared/components/VerifiedBadge";
import TrustScoreCard from "../../../shared/components/TrustScoreCard";
import RankProgressCard from "../../../shared/components/RankProgressCard";

const UserProfile = () => {
  const { user, isAuthenticated, loading, hasCheckedAuth } = useSelector(
    (state) => state.user
  );
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (hasCheckedAuth && !isAuthenticated) {
      navigateTo("/");
    }
  }, [hasCheckedAuth, isAuthenticated, navigateTo]);

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      setImagePreview(user.profileImage?.url || null);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("userName", formData.userName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      if (profileImage) {
        formDataToSend.append("profileImage", profileImage);
      }

      const response = await axios.put(
        API_ENDPOINTS.USER.UPDATE_PROFILE,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
      dispatch(fetchUser());
      setIsEditing(false);
      setProfileImage(null);
    } catch (error) {
      console.error("Profile update error:", error);
      console.error("Error response:", error.response);
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      userName: user.userName || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    });
    setImagePreview(user.profileImage?.url || null);
    setProfileImage(null);
    setIsEditing(false);
  };

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-start">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/30 whitestone:backdrop-blur-xl backdrop-blur-sm whitestone:backdrop-blur-xl mx-auto w-full h-auto px-6 flex flex-col gap-4 items-center py-6 justify-center rounded-md border-2 border-golden-400 whitestone:border-white/30 shadow-2xl">
              <div className="relative">
                <img
                  src={imagePreview || "/imageHolder.jpg"}
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover border-4 border-golden-400 whitestone:border-white/50"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-golden-500 whitestone:bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-golden-600 whitestone:hover:bg-blue-700 transition text-sm font-bold">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    Upload
                  </label>
                )}
              </div>

              {/* User Name and Badges */}
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-warm-white whitestone:text-gray-900">
                    {user?.userName}
                  </h2>
                  {/* Premium Badge - 3x size (60px) */}
                  <div className="inline-flex items-center relative group">
                    <div className="relative">
                      {user?.isPremium && (
                        <>
                          <img
                            src="/icons/premium.png"
                            alt="Premium Member"
                            style={{ width: 60, height: 60 }}
                            className="cursor-default transition-transform duration-200 hover:scale-110 object-contain relative z-10"
                          />
                          {/* Circular Shiny Effect */}
                          <div
                            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                              background:
                                "radial-gradient(circle, rgba(234, 179, 8, 0.5) 0%, transparent 70%)",
                              filter: "blur(12px)",
                            }}
                          />
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
                            Premium Member
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                              <div className="border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* Rank Badge - 3x size (72px) */}
                  <div className="inline-flex items-center relative group">
                    <div className="relative">
                      <img
                        src={`/icons/${(
                          user?.badgeTier || "bronze-i"
                        ).toLowerCase()}.png`}
                        alt={user?.badgeTier || "Bronze-I"}
                        style={{ width: 72, height: 72 }}
                        className="flex-shrink-0 object-contain cursor-default transition-transform duration-200 hover:scale-110 relative z-10"
                      />
                      {/* Circular Shiny Effect */}
                      <div
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle, ${
                            (user?.badgeTier || "bronze-i").startsWith("Bronze")
                              ? "rgba(217, 119, 6, 0.4)"
                              : (user?.badgeTier || "bronze-i").startsWith(
                                  "Silver"
                                )
                              ? "rgba(156, 163, 175, 0.4)"
                              : (user?.badgeTier || "bronze-i").startsWith(
                                  "Gold"
                                )
                              ? "rgba(234, 179, 8, 0.4)"
                              : (user?.badgeTier || "bronze-i").startsWith(
                                  "Platinum"
                                )
                              ? "rgba(148, 163, 184, 0.4)"
                              : (user?.badgeTier || "bronze-i").startsWith(
                                  "Diamond"
                                )
                              ? "rgba(34, 211, 238, 0.4)"
                              : "rgba(168, 85, 247, 0.4)"
                          } 0%, transparent 70%)`,
                          filter: "blur(12px)",
                        }}
                      />
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
                        {user?.badgeTier || "Bronze-I"}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                          <div className="border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Verified Badge - 3x size (78px) */}
                  {(user?.isVerifiedSeller || user?.isVerifiedBuyer) && (
                    <div className="inline-flex items-center relative group">
                      <div className="relative">
                        <img
                          src="/icons/verified.png"
                          alt="Verified"
                          style={{ width: 78, height: 78 }}
                          className="flex-shrink-0 object-contain cursor-default transition-transform duration-200 hover:scale-110 relative z-10"
                        />
                        {/* Circular Shiny Effect */}
                        <div
                          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background:
                              "radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, transparent 70%)",
                            filter: "blur(12px)",
                          }}
                        />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
                          {user?.isVerifiedSeller
                            ? "Verified Seller"
                            : "Verified Buyer"}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {user?.trustScore !== undefined && (
                  <TrustScoreCard
                    trustScore={user.trustScore}
                    starRating={user.starRating}
                    size="lg"
                  />
                )}
              </div>

              {/* Rank Progress Card */}
              <div className="w-full max-w-2xl mb-6">
                <RankProgressCard
                  totalTransactionVolume={user?.totalTransactionVolume || 0}
                  currentTier={user?.badgeTier || "Bronze-I"}
                />
              </div>

              <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-6 w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-warm-white whitestone:text-gray-900">
                      Personal Details
                    </h3>
                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="bg-gold-gradient shadow-lg border-2 border-golden-400 whitestone:border-white/30 font-semibold text-sm transition-all duration-300 py-2 px-4 rounded-md !text-white btn-hover"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={updating}
                          className="bg-green-600 hover:bg-green-700 shadow-lg border-2 border-green-500 font-semibold text-sm transition-all duration-300 py-2 px-4 rounded-md !text-white disabled:opacity-50"
                        >
                          {updating ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          disabled={updating}
                          className="bg-red-600 hover:bg-red-700 shadow-lg border-2 border-red-500 font-semibold text-sm transition-all duration-300 py-2 px-4 rounded-md !text-white disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-golden-300 whitestone:text-gray-900">
                        Username
                      </label>
                      <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border border-golden-400 whitestone:border-gray-400 bg-transparent rounded-md focus:outline-none focus:border-golden-300 text-warm-white whitestone:text-gray-900"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-golden-300 whitestone:text-gray-900">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border border-golden-400 whitestone:border-gray-400 bg-transparent rounded-md focus:outline-none focus:border-golden-300 text-warm-white whitestone:text-gray-900"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-golden-300 whitestone:text-gray-900">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border border-golden-400 whitestone:border-gray-400 bg-transparent rounded-md focus:outline-none focus:border-golden-300 text-warm-white whitestone:text-gray-900"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-golden-300 whitestone:text-gray-900">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border border-golden-400 whitestone:border-gray-400 bg-transparent rounded-md focus:outline-none focus:border-golden-300 text-warm-white whitestone:text-gray-900"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-golden-300 whitestone:text-gray-900">
                        Role
                      </label>
                      <input
                        type="text"
                        value={user.role}
                        className="w-full mt-1 p-2 border border-golden-400 whitestone:border-gray-400 bg-transparent rounded-md focus:outline-none text-warm-white whitestone:text-gray-900"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-golden-300 whitestone:text-gray-900">
                        Joined On
                      </label>
                      <input
                        type="text"
                        value={user.createdAt?.substring(0, 10)}
                        className="w-full mt-1 p-2 border border-golden-400 whitestone:border-gray-400 bg-transparent rounded-md focus:outline-none text-warm-white whitestone:text-gray-900"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </form>

              <div className="mb-6 w-full">
                <h3 className="text-xl font-semibold mb-4 text-warm-white whitestone:text-gray-900">
                  Other User Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.role === "Auctioneer" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-golden-300 whitestone:text-gray-900">
                          Unpaid Commissions
                        </label>
                        <input
                          type="text"
                          value={user.unpaidCommission}
                          className="w-full mt-1 p-2 border border-golden-400 whitestone:border-gray-400 bg-transparent rounded-md focus:outline-none text-warm-white whitestone:text-gray-900"
                          disabled
                        />
                      </div>
                    </>
                  )}
                  {user.role === "Bidder" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-golden-300 whitestone:text-gray-900">
                          Auctions Won
                        </label>
                        <input
                          type="text"
                          value={user.auctionsWon}
                          className="w-full mt-1 p-2 border border-golden-400 whitestone:border-gray-400 bg-transparent rounded-md focus:outline-none text-warm-white whitestone:text-gray-900"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-golden-300 whitestone:text-gray-900">
                          Money Spent
                        </label>
                        <input
                          type="text"
                          value={user.moneySpent}
                          className="w-full mt-1 p-2 border border-golden-400 whitestone:border-gray-400 bg-transparent rounded-md focus:outline-none text-warm-white whitestone:text-gray-900"
                          disabled
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default UserProfile;
