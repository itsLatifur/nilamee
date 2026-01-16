import Card from "../../../shared/components/Card";
import Spinner from "../../../shared/components/Spinner";
import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const Auctions = () => {
  const { allAuctions, loading } = useSelector((state) => state.auction);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const categoryFilter = params.get("category");

  const filtered = categoryFilter
    ? allAuctions.filter((a) => a.category === categoryFilter)
    : allAuctions;

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <article className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
          <section className="my-8">
            <h1
              className={`text-golden-500 whitestone:text-gray-900 text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
            >
              Auctions
            </h1>
            <div className="flex flex-wrap gap-6">
              {filtered.map((element) => (
                <Card
                  title={element.title}
                  startTime={element.startTime}
                  endTime={element.endTime}
                  imgSrc={element.images?.[0]?.url || element.image?.url}
                  startingBid={element.startingBid}
                  id={element._id}
                  key={element._id}
                />
              ))}
            </div>
          </section>
        </article>
      )}
    </>
  );
};

export default Auctions;
