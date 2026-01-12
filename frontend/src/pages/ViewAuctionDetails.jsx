import Spinner from "@/custom-components/Spinner";
import { getAuctionDetail } from "@/store/slices/auctionSlice";
import React, { useEffect, useState } from "react";
import { FaGreaterThan } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

const ViewAuctionDetails = () => {
  const { id } = useParams();
  const { loading, auctionDetail, auctionBidders } = useSelector(
    (state) => state.auction
  );
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user.role === "Bidder") {
      navigateTo("/");
    }
    if (id) {
      dispatch(getAuctionDetail(id));
    }
  }, [isAuthenticated]);

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
                    Rs.{auctionDetail.startingBid}
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
              </div>
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
                          <p className="flex-1 text-center">{element.amount}</p>
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
