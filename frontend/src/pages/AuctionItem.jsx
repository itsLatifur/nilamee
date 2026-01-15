import Spinner from "@/custom-components/Spinner";
import { getAuctionDetail } from "@/store/slices/auctionSlice";
import { placeBid } from "@/store/slices/bidSlice";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { FaGreaterThan } from "react-icons/fa";
import { RiAuctionFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatBDT } from "@/shared/utils/currency";
import { toast } from "react-toastify";

const AuctionItem = () => {
  const { id } = useParams();
  const { loading, auctionDetail, auctionBidders } = useSelector(
    (state) => state.auction
  );
  const { isAuthenticated } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const [amount, setAmount] = useState(0);
  const { currentTheme } = useTheme();
  const [descExpanded, setDescExpanded] = useState(false);
  const handleBid = () => {
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }
    dispatch(placeBid(id, { amount: Number(amount) }));
    // Refresh auction details after short delay to show updated bids
    setTimeout(() => {
      dispatch(getAuctionDetail(id));
    }, 500);
  };
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
                    {formatBDT(auctionDetail.startingBid)}
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
                      {formatBDT(auctionDetail.startingBid)}
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
                {new Date(auctionDetail.startTime) <= Date.now() &&
                new Date(auctionDetail.endTime) >= Date.now() ? (
                  auctionBidders && auctionBidders.length > 0 ? (
                    auctionBidders.map((element, index) => {
                      return (
                        <div
                          key={index}
                          className="py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <img
                              src={element.profileImage}
                              alt={element.userName}
                              className="w-10 h-10 rounded-full hidden md:block"
                            />
                            <p className="text-[17px] font-semibold whitestone:text-gray-900">
                              {element.userName}
                            </p>
                          </div>
                          <p className="text-[17px] font-bold text-golden-400 whitestone:text-amber-600 flex-1 text-center">
                            {formatBDT(element.amount)}
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
                      );
                    })
                  ) : (
                    <div className="bg-gradient-to-br from-burgundy-400/20 to-burgundy-500/20 dark:from-gray-800/30 dark:to-black/30 whitestone:from-blue-50/40 whitestone:to-blue-100/30 rounded-md p-6 my-4 text-center border border-golden-300 dark:border-golden-500 whitestone:border-white/30">
                      <p className="text-warm-white whitestone:text-gray-900 text-lg font-semibold">
                        No bids yet. Be the first to bid!
                      </p>
                    </div>
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
                        className="w-32 focus:outline-none md:text-[20px] p-1 rounded font-bold text-lg"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={
                          currentTheme === "Whitestone"
                            ? {
                                color: "#2563eb",
                                background: "#fff",
                                WebkitTextFillColor: "#2563eb",
                                caretColor: "#2563eb",
                                border: "2px solid #2563eb",
                                fontWeight: 700,
                              }
                            : {}
                        }
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
