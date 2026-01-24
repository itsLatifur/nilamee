import Spinner from "@/custom-components/Spinner";
import { getAuctionDetail } from "@/store/slices/auctionSlice";
import React, { useEffect, useState } from "react";
import { FaGreaterThan } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatBDT } from "@/shared/utils/currency";
import axios from "axios";
import { toast } from "react-toastify";
import BadgeDisplay from "@/shared/components/BadgeDisplay";
import TrustScoreCard from "@/shared/components/TrustScoreCard";
import VerifiedBadge from "@/shared/components/VerifiedBadge";

const ViewAuctionDetails = () => {
  const { id } = useParams();
  const { loading, auctionDetail, auctionBidders } = useSelector(
    (state) => state.auction
  );
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const [descExpanded, setDescExpanded] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingLoading, setShippingLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user.role === "Bidder") {
      navigateTo("/");
    }
    if (id) {
      dispatch(getAuctionDetail(id));
    }
  }, [isAuthenticated]);

  const handleMarkAsShipped = async () => {
    if (!trackingNumber.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }

    setShippingLoading(true);
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/auctionitem/mark-shipped/${id}`,
        { trackingNumber },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(getAuctionDetail(id)); // Refresh auction details
        setTrackingNumber("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark as shipped");
    } finally {
      setShippingLoading(false);
    }
  };

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
        <div className="text-[16px] inline-flex items-center gap-1 justify-start">
          <Link
            to="/"
            className="font-semibold transition-all duration-300 hover:text-golden-500 whitestone:hover:text-black whitestone:text-gray-900"
          >
            Home
          </Link>
          <FaGreaterThan className="text-golden-300 whitestone:text-gray-900" />
          <Link
            to={"/view-my-auctions"}
            className="font-semibold transition-all duration-300 hover:text-golden-500 whitestone:hover:text-black whitestone:text-gray-900"
          >
            My Auctions
          </Link>
          <FaGreaterThan className="text-golden-300 whitestone:text-gray-900" />
          <p className="text-golden-300 whitestone:text-gray-900">
            {auctionDetail.title}
          </p>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="auction-view flex gap-4 flex-col 2xl:flex-row 2xl:items-stretch">
            {/* LEFT: Image block (unchanged) */}
            <div className="flex-1 flex flex-col gap-3">
              <div className="bg-white dark:bg-gray-900 w-[100%] lg:w-40 lg:h-40 flex justify-center items-center p-5 mt-3 2xl:self-stretch">
                <img src={auctionDetail.image?.url} alt={auctionDetail.title} />
              </div>
            </div>
            {/* RIGHT: Title + Description (top) then Bids */}
            <div className="flex-1 flex flex-col gap-4 2xl:items-stretch">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border-2 border-golden-400 whitestone:border-white/30 mt-3 2xl:self-stretch">
                <h3 className="text-warm-white text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">
                  {auctionDetail.title}
                </h3>
                <p className="text-xl font-semibold">
                  Condition:{" "}
                  <span className="text-golden-500 whitestone:text-gray-900">
                    {auctionDetail.condition}
                  </span>
                </p>
                <p className="text-xl font-semibold">
                  Minimum Bid:{" "}
                  <span className="text-golden-500 whitestone:text-gray-900">
                    {formatBDT(auctionDetail.startingBid)}
                  </span>
                </p>
                {auctionDetail.description && (
                  <>
                    <p className="text-xl w-fit font-bold mt-4">
                      Auction Item Description
                    </p>
                    <hr className="my-2 border-t-[1px] border-t-stone-700" />
                    <div>
                      <p
                        className={`${
                          descExpanded ? "" : "line-clamp-3"
                        } text-[18px] my-2 whitestone:text-gray-900`}
                      >
                        {auctionDetail.description}
                      </p>
                      <button
                        type="button"
                        className="text-golden-500 whitestone:text-blue-600 font-semibold hover:underline btn-hover-no-scale"
                        onClick={() => setDescExpanded((v) => !v)}
                      >
                        {descExpanded ? "Show less" : "Show more"}
                      </button>
                    </div>
                  </>
                )}

                {/* Auctioneer Information */}
                {auctionDetail.createdBy && (
                  <>
                    <p className="text-xl w-fit font-bold mt-6">
                      Seller Information
                    </p>
                    <hr className="my-2 border-t-[1px] border-t-stone-700" />
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-semibold text-warm-white whitestone:text-gray-900">
                          {auctionDetail.createdBy.userName}
                        </span>
                        {/* Premium badge removed */}
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <BadgeDisplay
                          tier={auctionDetail.createdBy.badgeTier || "Bronze-I"}
                          size="sm"
                        />
                        <VerifiedBadge
                          isVerifiedSeller={
                            auctionDetail.createdBy.isVerifiedSeller
                          }
                          size="sm"
                        />
                        <TrustScoreCard
                          starRating={auctionDetail.createdBy.starRating || 1}
                          trustScore={auctionDetail.createdBy.trustScore}
                          size="sm"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Payment and Shipping Status */}
              {auctionDetail.paymentStatus &&
                auctionDetail.paymentStatus !== "Unpaid" && (
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border-2 border-golden-400 whitestone:border-white/30">
                    <h3 className="text-xl font-semibold mb-4">Order Status</h3>

                    {/* Payment Status */}
                    <div className="mb-4">
                      <p className="text-lg font-semibold mb-2">
                        Payment Status:
                      </p>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          auctionDetail.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-800"
                            : auctionDetail.paymentStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {auctionDetail.paymentStatus}
                      </span>
                      {auctionDetail.paidAt && (
                        <p className="text-sm text-gray-600 mt-1">
                          Paid on:{" "}
                          {new Date(auctionDetail.paidAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Delivery Status */}
                    {auctionDetail.paymentStatus === "Paid" && (
                      <div className="mb-4">
                        <p className="text-lg font-semibold mb-2">
                          Delivery Status:
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            auctionDetail.deliveryStatus === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : auctionDetail.deliveryStatus === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {auctionDetail.deliveryStatus || "Not Shipped"}
                        </span>
                        {auctionDetail.trackingNumber && (
                          <p className="text-sm text-gray-600 mt-1">
                            Tracking: {auctionDetail.trackingNumber}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Mark as Shipped Section */}
                    {auctionDetail.paymentStatus === "Paid" &&
                      auctionDetail.deliveryStatus === "Not Shipped" && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="font-semibold text-blue-900 mb-3">
                            📦 Ready to ship? Mark this order as shipped
                          </p>
                          <div className="flex gap-3">
                            <input
                              type="text"
                              placeholder="Enter tracking number"
                              value={trackingNumber}
                              onChange={(e) =>
                                setTrackingNumber(e.target.value)
                              }
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                            <button
                              onClick={handleMarkAsShipped}
                              disabled={shippingLoading}
                              className={`px-6 py-2 rounded-lg text-white font-semibold transition ${
                                shippingLoading
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-blue-600 hover:bg-blue-700"
                              }`}
                            >
                              {shippingLoading
                                ? "Marking..."
                                : "Mark as Shipped"}
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 mt-2">
                            The buyer will be notified with the tracking
                            information
                          </p>
                        </div>
                      )}

                    {/* Shipped Status */}
                    {auctionDetail.deliveryStatus === "Shipped" && (
                      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="font-semibold text-green-900">
                          ✅ Item shipped on{" "}
                          {new Date(
                            auctionDetail.shippedAt
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Waiting for buyer to confirm delivery
                        </p>
                      </div>
                    )}

                    {/* Delivered Status */}
                    {auctionDetail.deliveryStatus === "Delivered" && (
                      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="font-semibold text-green-900">
                          ✅ Delivered on{" "}
                          {new Date(
                            auctionDetail.deliveredAt
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Payment has been released from escrow
                        </p>
                      </div>
                    )}

                    {/* Overall Status */}
                    {auctionDetail.overallStatus && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          Status:{" "}
                          <span className="font-semibold text-gray-900">
                            {auctionDetail.overallStatus}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                )}

              <div className="flex-1">
                <header className="bg-golden-50 py-4 text-[24px] font-semibold px-4">
                  BIDS
                </header>
                <div className="bg-white dark:bg-gray-900 px-4 min-h-fit lg:min-h-[650px]">
                  {auctionBidders &&
                  auctionBidders.length > 0 &&
                  new Date(auctionDetail.startTime) < Date.now() &&
                  new Date(auctionDetail.endTime) > Date.now() ? (
                    auctionBidders.map((element, index) => {
                      return (
                        <div
                          key={index}
                          className="py-2 flex items-center justify-between"
                        >
                          <div className="flex flex-1 items-center gap-4">
                            <img
                              src={element.profileImage}
                              alt={element.userName}
                              className="w-12 h-12 rounded-full my-2 hidden md:block"
                            />
                            <p className="text-[18px] font-semibold">
                              {element.userName}
                            </p>
                          </div>
                          <p className="flex-1 text-center">
                            {formatBDT(element.amount)}
                          </p>
                          {index === 0 ? (
                            <p className="text-[20px] font-semibold text-green-600 flex-1 text-end">
                              1st
                            </p>
                          ) : index === 1 ? (
                            <p className="text-[20px] font-semibold text-blue-600 flex-1 text-end">
                              2nd
                            </p>
                          ) : index === 2 ? (
                            <p className="text-[20px] font-semibold text-yellow-600 flex-1 text-end">
                              3rd
                            </p>
                          ) : (
                            <p className="text-[20px] font-semibold text-warm-white flex-1 text-end">
                              {index + 1}th
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : Date.now() < new Date(auctionDetail.startTime) ? (
                    <img
                      src="/notStarted.png"
                      alt="not-started"
                      className="w-full max-h-[650px]"
                    />
                  ) : (
                    <img
                      src="/auctionEnded.png"
                      alt="ended"
                      className="w-full max-h-[650px]"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ViewAuctionDetails;
