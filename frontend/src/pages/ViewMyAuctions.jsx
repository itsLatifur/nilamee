import CardTwo from "@/custom-components/CardTwo";
import Spinner from "@/custom-components/Spinner";
import { getMyAuctionItems } from "@/store/slices/auctionSlice";
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
  const visibleAuctions = Array.isArray(myAuctions)
    ? myAuctions.filter((a) => !a.isDeleted)
    : [];

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
        ) : visibleAuctions.length > 0 ? (
          visibleAuctions.map((element) => (
            <CardTwo
              title={element.title}
              startingBid={element.startingBid}
              endTime={element.endTime}
              startTime={element.startTime}
              imgSrc={element.image?.url}
              id={element._id}
              key={element._id}
              sold={!!element.highestBidder && new Date(element.endTime) < Date.now()}
              overallStatus={element.overallStatus}
              adminHold={element.adminHold}
              escrowStatus={element.escrowStatus}
              paymentStatus={element.paymentStatus}
              paidAt={element.paidAt}
              highestBidder={element.highestBidder}
              showEndedBadge={true}
            />
          ))
        ) : (
          <h3 className="text-[#666] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl mt-5">
            You have not posted any auction.
          </h3>
        )}
      </div>
    </>
  );
    </>
  );
};

export default ViewMyAuctions;
















