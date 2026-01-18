import Card from "../Card";
import React from "react";
import { useSelector } from "react-redux";

const FeaturedAuctions = () => {
  const { allAuctions, loading } = useSelector((state) => state.auction);
  return (
    <>
      <section className="my-12">
        <h3 className="text-warm-white whitestone:text-gray-900 text-2xl font-bold mb-6 md:text-3xl lg:text-4xl">
          Featured Auctions
        </h3>
        <div className="flex flex-wrap gap-6 justify-center">
          {allAuctions
            .filter((a) => {
              if (a.isDeleted) return false;
              if (a.overallStatus === "Cancelled") return false;
              if (a.escrowStatus === "Refunded") return false;
              const now = Date.now();
              const ended = a.endTime
                ? new Date(a.endTime).getTime() < now
                : false;
              const sold = ended && !!a.highestBidder;
              if (ended && !sold) return false;
              return true;
            })
            .slice(0, 8)
            .map((element) => {
              return (
                <Card
                  title={element.title}
                  imgSrc={element.images?.[0]?.url || element.image?.url}
                  startTime={element.startTime}
                  endTime={element.endTime}
                  startingBid={element.startingBid}
                  id={element._id}
                  sold={
                    !!element.highestBidder &&
                    new Date(element.endTime) < Date.now()
                  }
                  overallStatus={element.overallStatus}
                  adminHold={element.adminHold}
                  escrowStatus={element.escrowStatus}
                  paymentStatus={element.paymentStatus}
                  paidAt={element.paidAt}
                  key={element._id}
                />
              );
            })}
        </div>
      </section>
    </>
  );
};

export default FeaturedAuctions;
