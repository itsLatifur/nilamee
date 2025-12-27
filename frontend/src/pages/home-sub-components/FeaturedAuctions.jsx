import Card from "@/custom-components/Card";
import React from "react";
import { useSelector } from "react-redux";

const FeaturedAuctions = () => {
  const { allAuctions, loading } = useSelector((state) => state.auction);
  return (
    <>
      <section className="my-8">
        <div className="bg-luxury-gradient rounded-lg p-6 mb-6 shadow-xl border-4 border-golden-400 dark:border-golden-500 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gold-gradient"></div>
          <h3 className="text-white text-xl font-bold mb-2 min-[480px]:text-2xl md:text-3xl lg:text-4xl flex items-center gap-3">
            <span className="text-golden-300">✦</span>
            Featured Auctions
            <span className="text-golden-300">✦</span>
          </h3>
          <p className="text-golden-100 text-sm md:text-base">
            Discover our most prestigious items up for auction
          </p>
        </div>
        <div className="flex flex-wrap gap-6">
          {allAuctions.slice(0, 8).map((element) => {
            return (
              <Card
                title={element.title}
                imgSrc={element.image?.url}
                startTime={element.startTime}
                endTime={element.endTime}
                startingBid={element.startingBid}
                id={element._id}
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
