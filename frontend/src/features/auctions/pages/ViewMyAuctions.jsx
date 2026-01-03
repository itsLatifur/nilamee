import CardTwo from "../../../shared/components/CardTwo";
import Spinner from "../../../shared/components/Spinner";
import { getMyAuctionItems } from "../store/auctionSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ViewMyAuctions = () => {
  const { myAuctions, loading } = useSelector((state) => state.auction);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user.role !== "Auctioneer") {
      navigateTo("/");
    }
    dispatch(getMyAuctionItems());
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <div className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
        <h1
          className={`text-golden-500 whitestone:text-gray-900 text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
        >
          My Auctions
        </h1>
        {loading ? (
          <Spinner />
        ) : (
          <div
            className={`${
              myAuctions.length > 2 && "flex-grow"
            } flex flex-wrap gap-6`}
          >
            {myAuctions.length > 0 ? (
              myAuctions.map((element) => {
                return (
                  <div key={element._id} className="relative">
                    <CardTwo
                      title={element.title}
                      startingBid={element.startingBid}
                      endTime={element.endTime}
                      startTime={element.startTime}
                      imgSrc={element.images?.[0]?.url || element.image?.url}
                      id={element._id}
                    />
                    {element.approvalStatus === "pending" && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                        Pending Approval
                      </div>
                    )}
                    {element.approvalStatus === "rejected" && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Rejected
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <h3 className="text-[#666] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl mt-5">
                You have not posted any auction.
              </h3>
            )}{" "}
            :
          </div>
        )}
      </div>
    </>
  );
};

export default ViewMyAuctions;
