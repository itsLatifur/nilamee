import React, { useState } from "react";
import Spinner from "./Spinner";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
    <div className="flex gap-4 flex-col 2xl:flex-row">
      <div className="flex-1 flex flex-col gap-3">
        <div className="bg-white dark:bg-gray-900 w-full p-5 rounded-lg">
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

        <div className="flex flex-col justify-around pb-4">
          <h3 className="text-warm-white whitestone:text-gray-900 text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">
            {auctionDetail?.title}
          </h3>
          {auctionDetail?.condition && (
            <p className="text-xl font-semibold">
              Condition:{" "}
              <span className="text-golden-500 whitestone:text-gray-900">
                {auctionDetail.condition}
              </span>
            </p>
          )}
          {auctionDetail?.startingBid != null && (
            <p className="text-xl font-semibold">
              Minimum Bid:{" "}
              <span className="text-golden-500 whitestone:text-gray-900">
                Rs.{auctionDetail.startingBid}
              </span>
            </p>
          )}
        </div>

        {auctionDetail?.description && (
          <>
            <p className="text-xl w-fit font-bold">Auction Item Description</p>
            <hr className="my-2 border-t-[1px] border-t-stone-700" />
            {auctionDetail.description.split(". ").map((element, index) => (
              <li key={index} className="text-[18px] my-2">
                {element}
              </li>
            ))}
          </>
        )}

        {(auctionDetail?.location ||
          auctionDetail?.address ||
          auctionDetail?.authenticity ||
          (auctionDetail?.customFields &&
            auctionDetail.customFields.length > 0)) && (
          <>
            <p className="text-xl w-fit font-bold mt-6">Item Details</p>
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
                    ) : null
                  )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex-1">
        <div className="relative bg-luxury-gradient rounded-t-md p-4 shadow-xl border-2 border-golden-400 whitestone:border-white/30 dark:border-golden-500">
          <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gold-gradient"></div>
          <h3 className="text-white whitestone:text-black text-2xl font-semibold">
            BIDS
          </h3>
        </div>
        <div className="bg-white dark:bg-gray-900 px-4 py-2 min-h-fit lg:min-h-[650px] border-x-2 border-b-2 border-golden-400 dark:border-golden-500 whitestone:border-white/30 rounded-b-md">
          {auctionBidders &&
          auctionBidders.length > 0 &&
          new Date(auctionDetail?.startTime) < Date.now() &&
          new Date(auctionDetail?.endTime) > Date.now() ? (
            auctionBidders.map((element, index) => (
              <div
                key={index}
                className="py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700"
              >
                <p className="text-[18px] font-semibold whitestone:text-gray-900">
                  {element.userName}
                </p>
                <p className="flex-1 text-center whitestone:text-gray-900">
                  {element.amount}
                </p>
                {index === 0 ? (
                  <p className="text-[20px] font-semibold text-golden-500 flex-1 text-end">
                    1st
                  </p>
                ) : index === 1 ? (
                  <p className="text-[20px] font-semibold text-golden-300 flex-1 text-end">
                    2nd
                  </p>
                ) : index === 2 ? (
                  <p className="text-[20px] font-semibold text-golden-200 flex-1 text-end">
                    3rd
                  </p>
                ) : (
                  <p className="text-[20px] font-semibold whitestone:text-gray-900 text-warm-white flex-1 text-end">
                    {index + 1}th
                  </p>
                )}
              </div>
            ))
          ) : Date.now() < new Date(auctionDetail?.startTime) ? (
            <div className="bg-gradient-to-br from-burgundy-400/20 to-burgundy-500/20 dark:from-gray-800/30 dark:to-black/30 whitestone:from-blue-50/40 whitestone:to-blue-100/30 rounded-md p-6 my-4 text-center border border-golden-300 dark:border-golden-500 whitestone:border-white/30">
              <p className="text-warm-white whitestone:text-gray-900 text-lg font-semibold">
                Auction has not started yet!
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-burgundy-400/20 to-burgundy-500/20 dark:from-gray-800/30 dark:to-black/30 whitestone:from-blue-50/40 whitestone:to-blue-100/30 rounded-md p-6 my-4 text-center border border-golden-300 dark:border-golden-500 whitestone:border-white/30">
              <p className="text-warm-white whitestone:text-gray-900 text-lg font-semibold">
                Auction has ended!
              </p>
            </div>
          )}
        </div>

        {showActionBar && (
          <div className="bg-gold-gradient shadow-lg border-2 border-golden-300 dark:border-golden-400 whitestone:border-white/30 py-4 text-[16px] md:text-[24px] font-semibold px-4 flex items-center justify-between whitestone:text-white rounded-md mt-4">
            {Date.now() >= new Date(auctionDetail?.startTime) &&
            Date.now() <= new Date(auctionDetail?.endTime) ? (
              <>
                <div className="flex gap-3 flex-col sm:flex-row sm:items-center">
                  <p className="text-white whitestone:text-black">Place Bid</p>
                  <input
                    type="number"
                    className="w-32 focus:outline-none md:text-[20px] p-1 whitestone:text-gray-900"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <button
                  className="p-4 text-warm-white bg-burgundy-600 rounded-full transition-all duration-300 hover:bg-burgundy-700 dark:hover:bg-black whitestone:hover:bg-blue-600 dark:bg-gray-900 btn-hover"
                  onClick={onBid}
                >
                  Bid
                </button>
              </>
            ) : new Date(auctionDetail?.startTime) > Date.now() ? (
              <p className="text-white whitestone:text-black font-semibold text-xl">
                Auction has not started yet!
              </p>
            ) : (
              <p className="text-white whitestone:text-black font-semibold text-xl">
                Auction has ended!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionView;
