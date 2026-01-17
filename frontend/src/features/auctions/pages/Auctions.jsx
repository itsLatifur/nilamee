import Card from "../../../shared/components/Card";
import Spinner from "../../../shared/components/Spinner";
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation, Link, useNavigate } from "react-router-dom";
import auctionCategories from "@/config/auctionCategories";

const Auctions = () => {
  const { allAuctions, loading } = useSelector((state) => state.auction);
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const urlCategoriesParam = params.get("categories") || params.get("category");
  const urlCategories = urlCategoriesParam
    ? urlCategoriesParam.split(",").filter(Boolean)
    : [];
  const urlMin = Number(params.get("min") || 0);
  const urlMax = Number(params.get("max") || 0);
  const urlSort = params.get("sort") || "newest";
  const urlStatusParam = params.get("status") || "All";

  const [selectedCategories, setSelectedCategories] = useState(urlCategories);
  const [minPrice, setMinPrice] = useState(urlMin);
  const [maxPrice, setMaxPrice] = useState(urlMax);
  const [sortOption, setSortOption] = useState(urlSort);
  const [statusFilter, setStatusFilter] = useState(urlStatusParam);

  // Filter panel visibility and temporary selections (apply on click)
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [tempSelectedCategories, setTempSelectedCategories] =
    useState(urlCategories);
  const [tempMinPrice, setTempMinPrice] = useState(urlMin);
  const [tempMaxPrice, setTempMaxPrice] = useState(urlMax);
  const [tempSortOption, setTempSortOption] = useState(urlSort);
  const [tempStatus, setTempStatus] = useState(
    urlStatusParam && urlStatusParam !== "All" ? urlStatusParam.split(",") : [],
  ); // allow multi-status selection

  // when opening the panel, initialize temp values from applied filters
  useEffect(() => {
    if (showFilterPanel) {
      setTempSelectedCategories(selectedCategories || []);
      setTempMinPrice(minPrice || 0);
      setTempMaxPrice(maxPrice || 0);
      setTempSortOption(sortOption || "newest");
      if (!statusFilter || statusFilter === "All") setTempStatus([]);
      else setTempStatus(statusFilter.split(","));
    }
  }, [showFilterPanel]);

  // ESC key closes modal
  useEffect(() => {
    if (!showFilterPanel) return;
    const onKey = (e) => {
      if (e.key === "Escape") setShowFilterPanel(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showFilterPanel]);

  const updateUrlWithFilters = (cats, min, max, sort, status) => {
    const p = new URLSearchParams();
    if (cats && cats.length) p.set("categories", cats.join(","));
    if (min && min > 0) p.set("min", String(min));
    if (max && max > 0) p.set("max", String(max));
    if (sort) p.set("sort", sort);
    if (status && status !== "All") {
      if (Array.isArray(status)) p.set("status", status.join(","));
      else p.set("status", status);
    }
    const qs = p.toString();
    navigate(qs ? `/auctions?${qs}` : `/auctions`, { replace: false });
  };

  // keep URL in sync with applied filters (so links reproduce state)
  useEffect(() => {
    updateUrlWithFilters(
      selectedCategories,
      minPrice,
      maxPrice,
      sortOption,
      statusFilter,
    );
  }, [selectedCategories, minPrice, maxPrice, sortOption, statusFilter]);

  // derive a working list based on filters
  const filtered = useMemo(() => {
    if (!allAuctions) return [];
    const now = Date.now();
    let list = [...allAuctions];

    // category filter (multi)
    if (selectedCategories && selectedCategories.length > 0) {
      list = list.filter((a) => selectedCategories.includes(a.category));
    }

    // status filter (support single or multi selection encoded in statusFilter)
    list = list.filter((auction) => {
      const statuses =
        !statusFilter || statusFilter === "All"
          ? []
          : statusFilter.includes(",")
            ? statusFilter.split(",")
            : [statusFilter];

      const ended = auction.endTime
        ? new Date(auction.endTime).getTime() < now
        : false;
      const cancelled = auction.overallStatus === "Cancelled";
      const sold = ended && !!auction.highestBidder;
      const label = cancelled ? "Cancelled" : sold ? "Sold" : "Available";

      if (statuses.length === 0) return true;
      return statuses.includes(label);
    });

    // price range filter (use currentBid or startingBid)
    list = list.filter((auction) => {
      const price =
        auction.currentBid ||
        auction.currentBidAmount ||
        auction.startingBid ||
        0;
      if (minPrice && price < minPrice) return false;
      if (maxPrice && maxPrice > 0 && price > maxPrice) return false;
      return true;
    });

    // sorting
    list.sort((a, b) => {
      if (sortOption === "newest") {
        const aTime = new Date(a.createdAt || a.startTime || 0).getTime();
        const bTime = new Date(b.createdAt || b.startTime || 0).getTime();
        return bTime - aTime;
      }
      if (sortOption === "oldest") {
        const aTime = new Date(a.createdAt || a.startTime || 0).getTime();
        const bTime = new Date(b.createdAt || b.startTime || 0).getTime();
        return aTime - bTime;
      }
      if (sortOption === "price-asc") {
        const ap = a.currentBid || a.startingBid || 0;
        const bp = b.currentBid || b.startingBid || 0;
        return ap - bp;
      }
      if (sortOption === "price-desc") {
        const ap = a.currentBid || a.startingBid || 0;
        const bp = b.currentBid || b.startingBid || 0;
        return bp - ap;
      }
      if (sortOption === "az") {
        return (a.title || "").localeCompare(b.title || "");
      }
      return 0;
    });

    return list;
  }, [
    allAuctions,
    selectedCategories,
    minPrice,
    maxPrice,
    sortOption,
    statusFilter,
  ]);

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
            {/* Filter + Sort header: Filter button opens panel with category/status/price, Sort on the right */}
            <div className="mb-4 flex items-center justify-between">
              <div />
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowFilterPanel((s) => !s)}
                    className="px-3 py-1 rounded bg-transparent border border-gray-300 text-sm"
                    aria-expanded={showFilterPanel}
                    aria-controls="auctions-filter-panel"
                  >
                    Filter
                  </button>

                  {showFilterPanel && (
                    <div
                      className="fixed inset-0 z-[99999]"
                      role="dialog"
                      aria-modal="true"
                      onClick={() => setShowFilterPanel(false)}
                    >
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="fixed inset-0 flex items-start justify-center p-6">
                        <div
                          className="w-[680px] max-w-[90vw] bg-white dark:bg-gray-900 rounded shadow-lg p-4 border border-gray-200 z-[100000] max-h-[80vh] overflow-y-auto"
                          style={{ boxSizing: "border-box" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="mb-3">
                            <p className="text-sm font-semibold mb-2">
                              Categories
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {auctionCategories.map((cat) => {
                                const active =
                                  tempSelectedCategories.includes(cat);
                                return (
                                  <button
                                    key={cat}
                                    onClick={() => {
                                      setTempSelectedCategories((prev) =>
                                        prev.includes(cat)
                                          ? prev.filter((c) => c !== cat)
                                          : [...prev, cat],
                                      );
                                    }}
                                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition border flex-shrink-0 ${
                                      active
                                        ? "bg-golden-400 text-white"
                                        : "bg-transparent text-warm-white border-white/20"
                                    }`}
                                    style={{
                                      maxWidth: 160,
                                      height: 28,
                                      lineHeight: "20px",
                                    }}
                                  >
                                    {cat}
                                  </button>
                                );
                              })}
                              <button
                                onClick={() => setTempSelectedCategories([])}
                                className="px-2 py-0.5 rounded-full text-[11px] text-gray-500"
                              >
                                Clear
                              </button>
                            </div>
                          </div>

                          <div className="mb-3">
                            <p className="text-sm font-semibold mb-2">
                              Status (multi-select)
                            </p>
                            <div className="flex items-center gap-4">
                              {["Available", "Sold", "Cancelled"].map((s) => (
                                <label
                                  key={s}
                                  className="inline-flex items-center gap-2"
                                >
                                  <input
                                    type="checkbox"
                                    checked={tempStatus.includes(s)}
                                    onChange={() => {
                                      setTempStatus((prev) =>
                                        prev.includes(s)
                                          ? prev.filter((x) => x !== s)
                                          : [...prev, s],
                                      );
                                    }}
                                  />
                                  <span className="text-sm">{s}</span>
                                </label>
                              ))}
                              <button
                                onClick={() => setTempStatus([])}
                                className="px-2 py-1 rounded bg-gray-100 text-sm text-gray-700"
                              >
                                Clear
                              </button>
                            </div>
                          </div>

                          <div className="mb-3 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-gray-500">
                                Price:
                              </label>
                              <input
                                type="number"
                                placeholder="Min"
                                value={tempMinPrice || ""}
                                onChange={(e) =>
                                  setTempMinPrice(Number(e.target.value || 0))
                                }
                                className="px-2 py-1 rounded border border-gray-300 w-24"
                              />
                              <span className="text-gray-400">—</span>
                              <input
                                type="number"
                                placeholder="Max"
                                value={tempMaxPrice || ""}
                                onChange={(e) =>
                                  setTempMaxPrice(Number(e.target.value || 0))
                                }
                                className="px-2 py-1 rounded border border-gray-300 w-24"
                              />
                            </div>

                            <div className="flex items-center gap-2 ml-auto">
                              <label className="text-sm text-gray-500">
                                Sort:
                              </label>
                              <select
                                value={tempSortOption}
                                onChange={(e) =>
                                  setTempSortOption(e.target.value)
                                }
                                className="px-3 py-1 rounded border border-gray-300 bg-white text-sm"
                              >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="price-asc">
                                  Price: Low → High
                                </option>
                                <option value="price-desc">
                                  Price: High → Low
                                </option>
                                <option value="az">A → Z</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                // reset temps and applied filters immediately
                                setTempSelectedCategories([]);
                                setTempMinPrice(0);
                                setTempMaxPrice(0);
                                setTempSortOption("newest");
                                setTempStatus([]);
                                setSelectedCategories([]);
                                setMinPrice(0);
                                setMaxPrice(0);
                                setSortOption("newest");
                                setStatusFilter("All");
                                updateUrlWithFilters([], 0, 0, "newest", "All");
                              }}
                              className="px-3 py-1 rounded bg-gray-100 text-sm text-gray-700"
                            >
                              Clear
                            </button>
                            <button
                              onClick={() => {
                                // apply temps to actual filters
                                setSelectedCategories(tempSelectedCategories);
                                setMinPrice(tempMinPrice);
                                setMaxPrice(tempMaxPrice);
                                setSortOption(tempSortOption);
                                // tempStatus is array; if empty interpret as All
                                if (!tempStatus || tempStatus.length === 0)
                                  setStatusFilter("All");
                                else if (tempStatus.length === 3)
                                  setStatusFilter("All");
                                else setStatusFilter(tempStatus.join(","));
                                // persist to url
                                updateUrlWithFilters(
                                  tempSelectedCategories,
                                  tempMinPrice,
                                  tempMaxPrice,
                                  tempSortOption,
                                  tempStatus.length === 0 ? "All" : tempStatus,
                                );
                                // hide panel
                                setShowFilterPanel(false);
                              }}
                              className="px-4 py-1 rounded bg-golden-400 text-white font-semibold"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sort shown inline to the right of Filter */}
                <div>
                  <label className="text-sm text-gray-500 mr-2">Sort:</label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="px-3 py-1 rounded border border-gray-300 bg-white text-sm"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="az">A → Z</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              {filtered.map((element) => (
                <Card
                  title={element.title}
                  startTime={element.startTime}
                  endTime={element.endTime}
                  imgSrc={element.images?.[0]?.url || element.image?.url}
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
          </section>
        </article>
      )}
    </>
  );
};

export default Auctions;
