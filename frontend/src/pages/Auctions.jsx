import Card from "@/custom-components/Card";
import Spinner from "@/custom-components/Spinner";
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

const Auctions = () => {
  const { allAuctions, loading } = useSelector((state) => state.auction);
  const [displayedAuctions, setDisplayedAuctions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Available");
  const itemsPerPage = 10;

  // Initialize displayed auctions
  // Compute filtered auctions based on selected status
  const filteredAuctions = useMemo(() => {
    if (!allAuctions) return [];
    const now = Date.now();
    return allAuctions.filter((auction) => {
      const ended = auction.endTime
        ? new Date(auction.endTime).getTime() < now
        : false;
      const cancelled = auction.overallStatus === "Cancelled";
      const sold = ended && !!auction.highestBidder;

      if (statusFilter === "All") return true;
      if (statusFilter === "Available") {
        return !ended && !cancelled;
      }
      if (statusFilter === "Sold") return sold;
      if (statusFilter === "Cancelled") return cancelled;
      return true;
    });
  }, [allAuctions, statusFilter]);

  // Initialize displayed auctions when the list or filter changes
  useEffect(() => {
    if (filteredAuctions && filteredAuctions.length > 0) {
      setDisplayedAuctions(filteredAuctions.slice(0, itemsPerPage));
      setHasMore(filteredAuctions.length > itemsPerPage);
      setPage(1);
    } else {
      setDisplayedAuctions([]);
      setHasMore(false);
      setPage(1);
    }
  }, [filteredAuctions]);

  // Load more auctions
  const loadMoreAuctions = () => {
    const nextPage = page + 1;
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newAuctions = filteredAuctions.slice(startIndex, endIndex);

    if (newAuctions.length > 0) {
      setDisplayedAuctions((prev) => [...prev, ...newAuctions]);
      setPage(nextPage);
      setHasMore(endIndex < allAuctions.length);
    } else {
      setHasMore(false);
    }
  };

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200 &&
        hasMore &&
        !loading
      ) {
        loadMoreAuctions();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, page]);

  return (
    <>
      {loading && page === 1 ? (
        <Spinner />
      ) : (
        <article className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
          <section className="my-8">
            <h1
              className={`text-golden-500 whitestone:text-gray-900 text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
            >
              Auctions
            </h1>
            <div className="flex items-center justify-between mb-4">
              <div />
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500 mr-2">Filter:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded border border-gray-300 bg-white text-sm"
                >
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="All">All</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              {displayedAuctions.map((element) => (
                <Card
                  title={element.title}
                  startTime={element.startTime}
                  endTime={element.endTime}
                  imgSrc={element.image?.url}
                  startingBid={element.startingBid}
                  id={element._id}
                  sold={
                    !!element.highestBidder &&
                    new Date(element.endTime) < Date.now()
                  }
                  key={element._id}
                />
              ))}
            </div>
            {loading && page > 1 && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-golden-400"></div>
              </div>
            )}
            {!hasMore && displayedAuctions.length > 0 && (
              <p className="text-center text-golden-400 whitestone:text-gray-600 py-8 text-lg">
                All auctions loaded
              </p>
            )}
            {displayedAuctions.length === 0 && !loading && (
              <p className="text-center text-golden-400 whitestone:text-gray-600 py-8 text-lg">
                No auctions available
              </p>
            )}
          </section>
        </article>
      )}
    </>
  );
};

export default Auctions;
