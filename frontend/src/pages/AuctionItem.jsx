import Spinner from "@/custom-components/Spinner";
import { getAuctionDetail } from "@/store/slices/auctionSlice";
import { placeBid } from "@/store/slices/bidSlice";
import React, { useEffect, useState } from "react";
import { FaGreaterThan } from "react-icons/fa";
import { RiAuctionFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

const AuctionItem = () => {
  const { id } = useParams();
  const { loading, auctionDetail, auctionBidders } = useSelector(
    (state) => state.auction
  );
  const { isAuthenticated } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const [amount, setAmount] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);
  const handleBid = () => {
    const formData = new FormData();
    formData.append("amount", amount);
    dispatch(placeBid(id, formData));
    dispatch(getAuctionDetail(id));
        {loading ? (
          <Spinner />
        ) : (
          <div className="auction-view flex gap-4 flex-col lg:flex-row lg:items-stretch">
            {/* LEFT: Image block (unchanged) */}
            <div className="flex-1 flex flex-col gap-3">
              <div className="bg-white dark:bg-gray-900 w-[100%] lg:w-40 lg:h-40 flex justify-center items-center p-5 mt-3 lg:self-stretch">
                <img
                  src={auctionDetail.image?.url}
                  alt={auctionDetail.title}
                />
              </div>
            </div>
            {/* RIGHT: Title + Description (top) then Bids */}
            <div className="flex-1 flex flex-col gap-4 lg:items-stretch">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border-2 border-golden-400 whitestone:border-white/30 mt-3 lg:self-stretch">
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
                    Rs.{auctionDetail.startingBid}
                  </span>
                </p>
                {auctionDetail.description && (
                  <>
                    <p className="text-xl w-fit font-bold mt-4">Auction Item Description</p>
                    <hr className="my-2 border-t-[1px] border-t-stone-700" />
                    <div>
                      <p className={`${descExpanded ? "" : "line-clamp-3"} text-[18px] my-2 whitestone:text-gray-900`}>{auctionDetail.description}</p>
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
              </div>
              <div className="flex-1">
                    <span className="text-golden-500 whitestone:text-gray-900">
                      {auctionDetail.condition}
                    </span>
                  </p>
                  <p className="text-xl font-semibold">
                    Minimum Bid:{" "}
                    <span className="text-golden-500 whitestone:text-gray-900">
                      Rs.{auctionDetail.startingBid}
                    </span>
                  </p>
                </div>
              </div>
              <p className="text-xl w-fit font-bold">Auction Item Description</p>
              <hr className="my-2 border-t-[1px] border-t-stone-700" />
              {auctionDetail.description && (
                <div>
                  <p className={`${descExpanded ? "" : "line-clamp-3"} text-[18px] my-2 whitestone:text-gray-900`}>{auctionDetail.description}</p>
                  <button
                    type="button"
                    className="text-golden-500 whitestone:text-blue-600 font-semibold hover:underline btn-hover-no-scale"
                    onClick={() => setDescExpanded((v) => !v)}
                  >
                    {descExpanded ? "Show less" : "Show more"}
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1">
              <header className="bg-golden-50 py-4 text-[24px] font-semibold px-4">
                BIDS
              </header>
              <div className="bg-white dark:bg-gray-900 px-4 min-h-fit lg:min-h-[650px]">
                {auctionBidders &&
                new Date(auctionDetail.startTime) < Date.now() &&
                new Date(auctionDetail.endTime) > Date.now() ? (
                  auctionBidders.length > 0 ? (
                    auctionBidders.map((element, index) => {
                      return (
                        <div
                          key={index}
                          className="py-2 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={element.profileImage}
                              alt={element.userName}
                              className="w-12 h-12 rounded-full my-2 hidden md:block"
                            />
                            <p className="text-[18px] font-semibold">
                              {element.userName}
                            </p>
                          </div>
                          {index === 0 ? (
                            <p className="text-[20px] font-semibold text-green-600">
                              1st
                            </p>
                          ) : index === 1 ? (
                            <p className="text-[20px] font-semibold text-blue-600">
                              2nd
                            </p>
                          ) : index === 2 ? (
                            <p className="text-[20px] font-semibold text-yellow-600">
                              3rd
                            </p>
                          ) : (
                            <p className="text-[20px] font-semibold text-warm-white">
                              {index + 1}th
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-golden-300 whitestone:text-gray-800 py-4">
                      No bids for this auction
                    </p>
                  )
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

              <div className="bg-gold-gradient shadow-lg border-2 border-golden-300 dark:border-golden-400 whitestone:border-white/30 py-4 text-[16px] md:text-[24px] font-semibold px-4 flex items-center justify-between whitestone:text-white">
                {Date.now() >= new Date(auctionDetail.startTime) &&
                Date.now() <= new Date(auctionDetail.endTime) ? (
                  <>
                    <div className="flex gap-3 flex-col sm:flex-row sm:items-center">
                      <p className="text-white whitestone:text-black">Place Bid</p>
                      <input
                        type="number"
                        className="w-32 focus:outline-none md:text-[20px] p-1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <button
                      className="p-4 text-warm-white bg-burgundy-600 rounded-full transition-all duration-300 hover:bg-burgundy-700 dark:hover:bg-black whitestone:hover:bg-blue-50 dark:bg-gray-900 btn-hover"
                      onClick={handleBid}
                    >
                      <RiAuctionFill />
                    </button>
                  </>
                ) : new Date(auctionDetail.startTime) > Date.now() ? (
                  <p className="text-white whitestone:text-black font-semibold text-xl">
                    Auction has not started yet!
                  </p>
                ) : (
                  <p className="text-white whitestone:text-black font-semibold text-xl">
                    Auction has ended!
                  </p>
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

export default AuctionItem;
