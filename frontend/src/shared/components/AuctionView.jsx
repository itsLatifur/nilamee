import React, { useState, useEffect, useRef } from "react";
import Spinner from "./Spinner";
import { FaChevronLeft, FaChevronRight, FaCrown } from "react-icons/fa";
import { formatBDT } from "@/shared/utils/currency";
import { useSelector } from "react-redux";

const AuctionView = ({
  loading,
  auctionDetail,
  auctionBidders,
  showActionBar = false,
  amount,
  setAmount,
  onBid,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);
  const auctionStarted = !!(
    auctionDetail?.startTime &&
    Date.now() >= new Date(auctionDetail.startTime).getTime()
  );
  const auctionEnded = !!(
    auctionDetail?.endTime &&
    Date.now() > new Date(auctionDetail.endTime).getTime()
  );
  const [timeLeft, setTimeLeft] = useState("--");
  const nameRefs = useRef([]);
  const amountRefs = useRef([]);

  const ordinal = (n) => {
    const j = n % 10;
    const k = n % 100;
    if (k >= 11 && k <= 13) return n + "th";
    if (j === 1) return n + "st";
    if (j === 2) return n + "nd";
    if (j === 3) return n + "rd";
    return n + "th";
  };

  const getStatusLabel = (auction) => {
    if (!auction) return "";
    const now = Date.now();
    if (auction.overallStatus === "Cancelled") return "Cancelled";
    const ended = auction.endTime
      ? new Date(auction.endTime).getTime() < now
      : false;
    // Only label as Sold when the final payment/escrow has been released or auction is explicitly paid
    const escrowReleased =
      (auction.escrow && auction.escrow.status === "Released") ||
      auction.paymentStatus === "Paid" ||
      !!auction.paidAt;
    const sold = ended && !!auction.highestBidder && escrowReleased;
    if (sold) return "Sold";
    return "Available";
  };

  const statusLabel = getStatusLabel(auctionDetail);

  const getStatusBadgeClass = (label) => {
    if (label === "Sold") return "bg-yellow-100 text-yellow-800";
    if (label === "Cancelled") return "bg-red-100 text-red-800";
    return "bg-green-100 text-green-800"; // Available
  };

  useEffect(() => {
    let timer;
    function update() {
      if (!auctionDetail?.endTime) {
        setTimeLeft("--");
        return;
      }
      const diff = new Date(auctionDetail.endTime).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Ended");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const parts = [];
      if (days) parts.push(`${days}D`);
      if (hours || days) parts.push(`${hours}H`);
      parts.push(`${minutes}M`);
      parts.push(`${seconds}S`);
      setTimeLeft(parts.join(" "));
    }
    update();
    if (auctionStarted && !auctionEnded) {
      timer = setInterval(update, 1000);
    }
    return () => clearInterval(timer);
  }, [auctionDetail?.endTime, auctionStarted, auctionEnded]);

  // Fit text within fixed columns by reducing font-size if necessary
  useEffect(() => {
    function fit(el, min = 12) {
      if (!el) return;
      const style = window.getComputedStyle(el);
      let fontSize = parseFloat(style.fontSize);
      // allow up to 3 steps of reduction
      let attempts = 0;
      while (
        el.scrollWidth > el.clientWidth &&
        attempts < 10 &&
        fontSize > min
      ) {
        fontSize = Math.max(min, fontSize - 1);
        el.style.fontSize = fontSize + "px";
        attempts += 1;
      }
    }

    // apply to all name and amount refs
    (nameRefs.current || []).forEach((el) => fit(el, 12));
    (amountRefs.current || []).forEach((el) => fit(el, 12));

    function onResize() {
      // reset sizes then refit
      (nameRefs.current || []).forEach((el) => {
        if (el) el.style.fontSize = "";
      });
      (amountRefs.current || []).forEach((el) => {
        if (el) el.style.fontSize = "";
      });
      (nameRefs.current || []).forEach((el) => fit(el, 12));
      (amountRefs.current || []).forEach((el) => fit(el, 12));
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [auctionBidders]);

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const restrictedRoles = ["Auctioneer", "Admin", "Super Admin"];
  const isOwner = !!(
    user &&
    auctionDetail &&
    (auctionDetail.createdBy?._id?.toString?.() === user._id?.toString?.() ||
      auctionDetail.createdBy?.toString?.() === user._id?.toString?.())
  );
  const canPlaceBid =
    !(user && restrictedRoles.includes(user.role)) && !isOwner;

  const nextImage = () => {
    if (
      auctionDetail?.images &&
      currentImageIndex < auctionDetail.images.length - 1
    ) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="auction-view flex gap-4 flex-col 2xl:flex-row 2xl:items-start">
      {/* LEFT: Image block (main content) */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="bg-white dark:bg-gray-900 w-full p-5 rounded-lg mt-3 2xl:self-stretch">
          <div className="relative">
            <img
              src={
                auctionDetail?.images?.[currentImageIndex]?.url ||
                auctionDetail?.image?.url
              }
              alt={auctionDetail?.title}
              className="w-full h-[400px] object-contain"
            />
            {auctionDetail?.images && auctionDetail.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  disabled={currentImageIndex === 0}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <FaChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  disabled={
                    currentImageIndex === auctionDetail.images.length - 1
                  }
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <FaChevronRight size={20} />
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {auctionDetail.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "bg-golden-500 w-8"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {auctionDetail?.images && auctionDetail.images.length > 1 && (
            <div className="grid grid-cols-6 gap-2 mt-4">
              {auctionDetail.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`border-2 rounded-md overflow-hidden transition-all ${
                    index === currentImageIndex
                      ? "border-golden-500 opacity-100"
                      : "border-gray-300 dark:border-gray-700 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${auctionDetail.title} ${index + 1}`}
                    className="w-full h-16 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Title (immediately below image) */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border-2 border-golden-400 whitestone:border-white/30 mt-3">
          <h3 className="text-warm-white whitestone:text-gray-900 text-xl font-semibold mb-0 min-[480px]:text-xl md:text-2xl lg:text-3xl">
            {auctionDetail?.title}
          </h3>
          {statusLabel && (
            <div className="mt-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(statusLabel)}`}
              >
                {statusLabel}
              </span>
            </div>
          )}
        </div>

        {/* Item Details (unchanged) */}
        {(auctionDetail?.location ||
          auctionDetail?.address ||
          auctionDetail?.authenticity ||
          (auctionDetail?.customFields &&
            auctionDetail.customFields.length > 0) ||
          auctionDetail?.condition) && (
          <>
            <hr className="my-2 border-t-[1px] border-t-stone-700" />
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border-2 border-golden-400 whitestone:border-white/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auctionDetail?.location && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Location
                    </span>
                    <span className="text-base font-medium text-warm-white whitestone:text-gray-900">
                      {auctionDetail.location}
                    </span>
                  </div>
                )}
                {auctionDetail?.address && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Address
                    </span>
                    <span className="text-base font-medium text-warm-white whitestone:text-gray-900">
                      {auctionDetail.address}
                    </span>
                  </div>
                )}
                {auctionDetail?.authenticity && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Authenticity
                    </span>
                    <span className="text-base font-medium text-warm-white whitestone:text-gray-900">
                      {auctionDetail.authenticity}
                    </span>
                  </div>
                )}
                {auctionDetail?.condition && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Condition
                    </span>
                    <span className="text-base font-medium text-warm-white whitestone:text-gray-900">
                      {auctionDetail.condition}
                    </span>
                  </div>
                )}
                {auctionDetail?.customFields &&
                  auctionDetail.customFields.map((field, index) =>
                    field.label && field.value ? (
                      <div key={index} className="flex flex-col">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {field.label}
                        </span>
                        <span className="text-base font-medium text-warm-white whitestone:text-gray-900">
                          {field.value}
                        </span>
                      </div>
                    ) : null,
                  )}
              </div>
            </div>
          </>
        )}

        {/* Description (after item details) */}
        {auctionDetail?.description && (
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border-2 border-golden-400 whitestone:border-white/30 mt-4">
            <p className="text-xl w-fit font-bold">Auction Item Description</p>
            <hr className="my-2 border-t-[1px] border-t-stone-700" />
            <div>
              <p
                className={`${descExpanded ? "" : "line-clamp-3"} text-[18px] my-2 whitestone:text-gray-900`}
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
          </div>
        )}
      </div>
      {/* RIGHT: Sidebar with auction card and bids history (replaces services area) */}
      <aside className="w-full 2xl:w-[520px] flex-shrink-0 flex flex-col gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border-2 border-golden-400 whitestone:border-white/30 mt-3">
          {/* Top: Current / Final Bid or Not started - full width to allow long amounts */}
          <div className="w-full">
            {!auctionStarted && !auctionEnded ? (
              <p className="text-sm text-gray-500">Not Started</p>
            ) : (
              <>
                <p className="text-sm text-gray-500">
                  {auctionEnded
                    ? "FINAL BID"
                    : auctionBidders && auctionBidders.length > 0
                      ? "CURRENT BID"
                      : ""}
                </p>
                {(auctionEnded ||
                  (auctionStarted &&
                    auctionBidders &&
                    auctionBidders.length > 0)) && (
                  <p className="text-2xl md:text-3xl font-bold text-golden-500 mt-1 break-keep">
                    {auctionBidders && auctionBidders[0]
                      ? formatBDT(auctionBidders[0].amount)
                      : formatBDT(
                          auctionDetail?.currentBid ||
                            auctionDetail?.startingBid ||
                            0,
                        )}
                  </p>
                )}

                {/* subtle separator */}
                <div className="mt-3 mb-3 border-t border-gray-200"></div>

                {/* Place bid control: shown under current/final bid and above stats */}
                {showActionBar &&
                  canPlaceBid &&
                  auctionStarted &&
                  !auctionEnded && (
                    <div className="mb-3">
                      <div className="bg-gold-gradient shadow-sm border-2 border-golden-300 dark:border-golden-400 whitestone:border-white/20 py-3 px-3 rounded-md flex items-center gap-3">
                        <input
                          type="number"
                          className="w-32 focus:outline-none md:text-[16px] p-1 rounded bg-white text-black"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Amount"
                        />
                        <button
                          onClick={onBid}
                          className="p-2 bg-burgundy-600 text-white rounded-md"
                        >
                          Place Bid
                        </button>
                      </div>
                    </div>
                  )}
              </>
            )}
          </div>

          {/* Below: stats and starting amount with TIME LEFT and ENDING side-by-side */}
          <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-gray-600">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs text-gray-400">TIME LEFT</p>
                <p className="font-semibold">
                  {auctionStarted && !auctionEnded
                    ? timeLeft
                    : auctionEnded
                      ? "Ended"
                      : "--"}
                </p>
              </div>
              <div className="flex-1 text-right">
                <p className="text-xs text-gray-400">ENDING</p>
                <p className="font-semibold">
                  {auctionDetail?.endTime
                    ? new Date(auctionDetail.endTime).toLocaleString()
                    : "--"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400">STARTING AMOUNT</p>
                <p className="font-semibold">
                  {formatBDT(auctionDetail?.startingBid || 0)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">NUMBER OF BIDS</p>
                <p className="font-semibold">
                  {auctionBidders ? auctionBidders.length : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bids list (keeps current bidder rendering) */}
        <div className="bg-white dark:bg-gray-900 px-4 py-2 min-h-fit lg:min-h-[360px] border-2 border-golden-400 dark:border-golden-500 whitestone:border-white/30 rounded-md">
          <h4 className="text-lg font-semibold mb-2">BID HISTORY</h4>
          {auctionBidders && auctionBidders.length > 0 ? (
            auctionBidders.map((element, index) => {
              const isEnded =
                Date.now() > new Date(auctionDetail?.endTime).getTime();
              return (
                <div
                  key={index}
                  className={`py-3 grid grid-cols-[56px_28px_1fr_1fr] items-center gap-2 border-b border-gray-200 dark:border-gray-700 ${
                    isEnded && index === 0
                      ? "border-2 border-golden-300 dark:border-golden-500 whitestone:border-blue-500 rounded-md bg-golden-50/10"
                      : ""
                  }`}
                >
                  <div className="text-center">
                    <span className="text-[14px] font-semibold">
                      {ordinal(index + 1)}
                    </span>
                  </div>

                  {/* Crown column: small fixed column so names align whether crown shown or not */}
                  <div className="text-center">
                    {isEnded && index === 0 ? (
                      <FaCrown className="text-golden-500" />
                    ) : (
                      <span className="inline-block w-4 h-4" />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <p
                        ref={(el) => (nameRefs.current[index] = el)}
                        className={`text-[16px] font-semibold whitestone:text-gray-900 truncate ${isEnded && index === 0 ? "text-golden-600" : ""}`}
                      >
                        {element.userName}
                      </p>
                    </div>
                  </div>

                  <p
                    ref={(el) => (amountRefs.current[index] = el)}
                    className="text-[15px] font-bold text-golden-400 whitestone:text-amber-600 text-right pr-4"
                  >
                    {formatBDT(element.amount)}
                  </p>
                </div>
              );
            })
          ) : Date.now() < new Date(auctionDetail?.startTime) ? (
            <div className="rounded-md p-6 my-4 text-center">
              <p className="text-warm-white whitestone:text-gray-900 text-lg font-semibold">
                Auction has not started yet!
              </p>
            </div>
          ) : (
            <div className="rounded-md p-6 my-4 text-center">
              <p className="text-warm-white whitestone:text-gray-900 text-lg font-semibold">
                No bids placed.
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default AuctionView;
