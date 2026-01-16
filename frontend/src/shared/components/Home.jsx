import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Card from "./Card";
import Spinner from "./Spinner";
import appConfig from "../../config/appConfig";
import {
  FiArrowRight,
  FiShield,
  FiLock,
  FiHeadphones,
  FiCheckCircle,
} from "react-icons/fi";
import { RiAuctionFill } from "react-icons/ri";
import { HiTrendingUp } from "react-icons/hi";
import { formatBDT } from "@/shared/utils/currency";
import { reviews } from "@/shared/data/reviews";
import auctionCategories from "@/config/auctionCategories";

const Home = () => {
  const { allAuctions, loading } = useSelector((state) => state.auction);
  const { leaderboard } = useSelector((state) => state.user);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  // Use canonical categories from shared config
  const categories = auctionCategories.map((name, idx) => ({
    name,
    icon:
      ["📱", "🛋️", "🎨", "💎", "🚗", "🏠", "🗃️", "👗", "🏆", "📚"][idx] || "📦",
  }));

  // Auto-rotate reviews every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        return nextIndex >= reviews.length ? 0 : nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Get featured auctions (first 6)
  const featuredAuctions = allAuctions.slice(0, 6);

  // Get latest auctions (sorted by creation date, last 8)
  const latestAuctions = [...allAuctions]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.startTime) -
        new Date(a.createdAt || a.startTime)
    )
    .slice(0, 8);

  // Get recent high bids for ticker
  const getRecentBids = () => {
    const recentBids = [];
    allAuctions.slice(0, 15).forEach((auction) => {
      if (auction.bids && auction.bids.length > 0) {
        const highestBid = Math.max(...auction.bids.map((b) => b.amount || 0));
        const bidder = auction.bids.find((b) => b.amount === highestBid);
        if (bidder && bidder.bidder?.userName) {
          recentBids.push({
            userName: bidder.bidder.userName,
            amount: highestBid,
            auctionTitle: auction.title,
          });
        }
      }
    });

    // If no bids, show top leaderboard users
    if (recentBids.length === 0 && leaderboard.length > 0) {
      return leaderboard.slice(0, 10).map((user) => ({
        userName: user.userName,
        amount: user.moneySpent,
        auctionTitle: "Total Spent",
      }));
    }

    return recentBids;
  };

  const recentBids = getRecentBids();

  // Auction categories with dynamic images from latest auctions
  const getCategoryImage = (categoryName) => {
    const categoryAuction = allAuctions.find(
      (auction) => auction.category === categoryName && auction.image?.url
    );
    return categoryAuction?.image?.url || null;
  };

  // search removed — homepage uses direct navigation links

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4">
        {/* Header Section - Discover Text Left, Search Right */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
            {/* Discover Exclusive Auctions - Top Left */}
            <h1 className="text-gold-gradient text-3xl md:text-4xl xl:text-5xl font-bold">
              Discover Exclusive Auctions
            </h1>
            <div className="w-full lg:w-auto flex justify-start lg:justify-end">
              <Link
                to="/auctions"
                className="px-6 py-3.5 bg-gold-gradient text-white rounded-xl shadow-sm font-semibold hover:opacity-95 transition"
              >
                Browse Auctions
              </Link>
            </div>
          </div>

          {/* Live Bidding Activity Ticker */}
          {recentBids.length > 0 && (
            <div className="relative overflow-hidden bg-gradient-to-r from-burgundy-950/30 via-golden-950/20 to-burgundy-950/30 whitestone:from-blue-50 whitestone:via-purple-50 whitestone:to-blue-50 border-y-2 border-golden-400/30 whitestone:border-gray-300 py-3 rounded-lg">
              <div className="flex items-center gap-3 absolute left-0 px-4 z-10 bg-gradient-to-r from-burgundy-950 whitestone:from-blue-100 to-transparent pr-8">
                <HiTrendingUp className="text-golden-400 whitestone:text-blue-600 text-xl animate-pulse" />
                <span className="text-golden-300 whitestone:text-gray-700 font-semibold text-sm whitespace-nowrap">
                  Live Activity:
                </span>
              </div>
              <div className="ticker-wrapper ml-40">
                <div className="ticker-content flex gap-12 animate-ticker">
                  {[...recentBids, ...recentBids].map((bid, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 whitespace-nowrap"
                    >
                      <span className="text-warm-white whitestone:text-gray-900 font-medium">
                        {bid.userName}
                      </span>
                      <span className="text-golden-400 whitestone:text-blue-600">
                        •
                      </span>
                      <span className="text-golden-300 whitestone:text-gray-600">
                        {formatBDT(bid.amount)}
                      </span>
                      <span className="text-golden-400/50 whitestone:text-gray-400 text-xs">
                        ({bid.auctionTitle.substring(0, 20)}
                        {bid.auctionTitle.length > 20 ? "..." : ""})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {loading && allAuctions.length === 0 ? (
          <Spinner />
        ) : (
          <>
            {/* Featured Auctions - Horizontal Scroll */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-warm-white whitestone:text-gray-900 text-3xl font-bold mb-2 md:text-4xl">
                    Featured Auctions
                  </h2>
                  <p className="text-golden-300 whitestone:text-gray-600 text-sm md:text-base">
                    Hand-picked premium items ending soon
                  </p>
                </div>
                <Link
                  to="/auctions"
                  className="hidden md:flex items-center gap-2 text-golden-400 whitestone:text-blue-600 hover:text-golden-300 whitestone:hover:text-blue-700 font-semibold transition-colors"
                >
                  View All <FiArrowRight />
                </Link>
              </div>

              <div className="relative">
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                  {featuredAuctions.map((auction) => (
                    <div
                      key={auction._id}
                      className="flex-shrink-0 w-[300px] snap-start"
                    >
                      <Card
                        title={auction.title}
                        imgSrc={auction.images?.[0]?.url || auction.image?.url}
                        startTime={auction.startTime}
                        endTime={auction.endTime}
                        startingBid={auction.startingBid}
                        id={auction._id}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Latest Auctions - Grid */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-warm-white whitestone:text-gray-900 text-3xl font-bold mb-2 md:text-4xl">
                    Latest Auctions
                  </h2>
                  <p className="text-golden-300 whitestone:text-gray-600 text-sm md:text-base">
                    Recently added items ready for bidding
                  </p>
                </div>
                <Link
                  to="/auctions"
                  className="hidden md:flex items-center gap-2 text-golden-400 whitestone:text-blue-600 hover:text-golden-300 whitestone:hover:text-blue-700 font-semibold transition-colors"
                >
                  View All <FiArrowRight />
                </Link>
              </div>

              <div className="relative">
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                  {latestAuctions.map((auction) => (
                    <div
                      key={auction._id}
                      className="flex-shrink-0 w-[300px] snap-start"
                    >
                      <Card
                        title={auction.title}
                        imgSrc={auction.images?.[0]?.url || auction.image?.url}
                        startTime={auction.startTime}
                        endTime={auction.endTime}
                        startingBid={auction.startingBid}
                        id={auction._id}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Category Cards - Carousel */}
            <section className="px-8 py-16 mb-16">
              <div className="mb-10 text-center">
                <h2 className="text-warm-white whitestone:text-gray-900 text-3xl font-bold mb-2 md:text-4xl">
                  We auction everything
                </h2>
                <p className="text-golden-300 whitestone:text-gray-600 text-sm md:text-base max-w-3xl mx-auto">
                  Holding over 3,200 auctions each year, we have the expertise
                  and ability to auction any type of asset across our
                  departments.
                </p>
              </div>

              <div className="max-w-7xl mx-auto relative">
                {categories.length > 6 && (
                  <>
                    {/* Previous Arrow */}
                    <button
                      onClick={() =>
                        setCurrentCategoryIndex((prev) =>
                          prev === 0
                            ? Math.max(0, categories.length - 6)
                            : prev - 1
                        )
                      }
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-8 z-10 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                      aria-label="Previous categories"
                    >
                      <span className="text-2xl text-gray-700">‹</span>
                    </button>
                  </>
                )}

                {/* Categories Grid - 6 Visible */}
                <div className="overflow-hidden">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.slice(0, 6).map((category, index) => {
                      const categoryImage = getCategoryImage(category.name);
                      return (
                        <Link
                          key={index}
                          to={`/auctions?category=${encodeURIComponent(
                            category.name
                          )}`}
                          className="group relative bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border-2 border-white/20 hover:border-white/60 transition-all duration-300 h-48 hover:scale-105 hover:shadow-2xl"
                        >
                          {/* Category Image */}
                          {categoryImage ? (
                            <img
                              src={categoryImage}
                              alt={category.name}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 to-blue-800/50 flex items-center justify-center">
                              <span className="text-6xl opacity-40">
                                {category.icon}
                              </span>
                            </div>
                          )}

                          {/* Dark overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                          {/* Category Name */}
                          <div className="absolute inset-0 flex flex-col justify-end p-4">
                            <h3 className="text-white font-bold text-sm md:text-base text-center transition-colors drop-shadow-lg">
                              {category.name.toUpperCase()}
                            </h3>
                            <p className="text-white/70 text-xs text-center mt-1">
                              AUCTIONS
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {categories.length > 6 && (
                  <>
                    {/* Next Arrow */}
                    <button
                      onClick={() =>
                        setCurrentCategoryIndex((prev) =>
                          prev >= categories.length - 6 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-8 z-10 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                      aria-label="Next categories"
                    >
                      <span className="text-2xl text-gray-700">›</span>
                    </button>
                  </>
                )}
              </div>

              {/* Navigation Dots */}
              {categories.length > 6 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({
                    length: Math.max(1, categories.length - 5),
                  }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentCategoryIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentCategoryIndex === index
                          ? "bg-golden-400 whitestone:bg-blue-600 w-8"
                          : "bg-golden-400/40 whitestone:bg-blue-300 hover:bg-golden-400/60 whitestone:hover:bg-blue-400 w-2"
                      }`}
                      aria-label={`Go to category set ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* About Us Section */}
            <section className="px-8 py-16 mb-16">
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Image */}
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src="/about-team.jpg"
                    alt="About Nilamee"
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800";
                    }}
                  />
                </div>

                {/* Content */}
                <div>
                  <h2 className="text-gray-900 text-3xl md:text-4xl font-bold mb-4">
                    About {appConfig.appName}
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed mb-6">
                    {appConfig.appName} is a family-owned and run business
                    established in 2024. Grown from a single auction site, the
                    company has grown to become the largest independent auction
                    company in Bangladesh, managing hundreds of auctions
                    annually with a hammer total in excess of ৳500 million.
                  </p>
                  <p className="text-gray-700 text-base leading-relaxed mb-6">
                    We pride ourselves on providing exceptional service,
                    transparency, and security for both buyers and sellers. Our
                    innovative escrow system and verified seller program ensure
                    safe and trustworthy transactions for everyone.
                  </p>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Read More
                    <FiArrowRight className="text-lg" />
                  </Link>
                </div>
              </div>
            </section>

            {/* Trust Statistics Section */}
            <section className="mb-20">
              <div className="text-center mb-10">
                <h2 className="text-warm-white whitestone:text-gray-900 text-2xl md:text-3xl font-bold mb-2">
                  Trusted by Thousands
                </h2>
                <p className="text-golden-300 whitestone:text-gray-600 text-sm">
                  Join our growing community of satisfied buyers and sellers
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {/* Active Users */}
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-burgundy-950/10 to-golden-950/5 whitestone:from-blue-50 whitestone:to-purple-50 border border-golden-400/20 whitestone:border-gray-200 hover:border-golden-400/40 whitestone:hover:border-blue-300 transition-all duration-300 hover:shadow-lg group">
                  <div className="text-3xl md:text-4xl font-bold text-gold-gradient mb-2 group-hover:scale-110 transition-transform">
                    {leaderboard.length > 0
                      ? `${Math.max(leaderboard.length, 500)}+`
                      : "5,000+"}
                  </div>
                  <div className="text-golden-300 whitestone:text-gray-600 text-sm font-medium">
                    Active Users
                  </div>
                </div>

                {/* Successful Auctions */}
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-burgundy-950/10 to-golden-950/5 whitestone:from-blue-50 whitestone:to-purple-50 border border-golden-400/20 whitestone:border-gray-200 hover:border-golden-400/40 whitestone:hover:border-blue-300 transition-all duration-300 hover:shadow-lg group">
                  <div className="text-3xl md:text-4xl font-bold text-gold-gradient mb-2 group-hover:scale-110 transition-transform">
                    {allAuctions.length > 0
                      ? `${Math.max(allAuctions.length, 1200)}+`
                      : "10,000+"}
                  </div>
                  <div className="text-golden-300 whitestone:text-gray-600 text-sm font-medium">
                    Total Auctions
                  </div>
                </div>

                {/* Total Transaction Value */}
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-burgundy-950/10 to-golden-950/5 whitestone:from-blue-50 whitestone:to-purple-50 border border-golden-400/20 whitestone:border-gray-200 hover:border-golden-400/40 whitestone:hover:border-blue-300 transition-all duration-300 hover:shadow-lg group">
                  <div className="text-3xl md:text-4xl font-bold text-gold-gradient mb-2 group-hover:scale-110 transition-transform">
                    {leaderboard.length > 0
                      ? `${Math.max(
                          Math.floor(
                            leaderboard.reduce(
                              (sum, user) => sum + (user.moneySpent || 0),
                              0
                            ) / 100000
                          ),
                          50
                        )}M+`
                      : "100M+"}
                  </div>
                  <div className="text-golden-300 whitestone:text-gray-600 text-sm font-medium">
                    BDT Transacted
                  </div>
                </div>

                {/* Customer Satisfaction */}
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-burgundy-950/10 to-golden-950/5 whitestone:from-blue-50 whitestone:to-purple-50 border border-golden-400/20 whitestone:border-gray-200 hover:border-golden-400/40 whitestone:hover:border-blue-300 transition-all duration-300 hover:shadow-lg group">
                  <div className="text-3xl md:text-4xl font-bold text-gold-gradient mb-2 group-hover:scale-110 transition-transform">
                    99.8%
                  </div>
                  <div className="text-golden-300 whitestone:text-gray-600 text-sm font-medium">
                    Satisfaction Rate
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="px-8 py-16 mb-16">
              <div className="text-center mb-12">
                <h2 className="text-warm-white whitestone:text-gray-900 text-3xl font-bold mb-2 md:text-4xl">
                  What our clients are saying
                </h2>
              </div>

              <div className="max-w-5xl mx-auto mb-8 relative">
                {/* Previous Arrow */}
                <button
                  onClick={() =>
                    setCurrentReviewIndex((prevIndex) => {
                      const nextIndex = prevIndex - 1;
                      return nextIndex < 0 ? reviews.length - 1 : nextIndex;
                    })
                  }
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  aria-label="Previous review"
                >
                  <span className="text-2xl text-gray-700">‹</span>
                </button>

                {/* Review Card */}
                <div className="bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-burgundy-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 whitestone:from-blue-900/40 whitestone:via-blue-600/30 whitestone:to-blue-900/70 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border-0">
                  {/* Quote Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="text-6xl md:text-7xl text-golden-400/30 whitestone:text-white font-serif">
                      “
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-white whitestone:text-white text-base md:text-lg leading-relaxed text-center mb-8 max-w-3xl mx-auto">
                    {reviews[currentReviewIndex].review}
                  </p>

                  {/* Company/User Name */}
                  <div className="text-center">
                    <h4 className="text-white whitestone:text-white font-bold text-xl">
                      {reviews[currentReviewIndex].name}
                    </h4>
                  </div>
                </div>

                {/* Next Arrow */}
                <button
                  onClick={() =>
                    setCurrentReviewIndex((prevIndex) => {
                      const nextIndex = prevIndex + 1;
                      return nextIndex >= reviews.length ? 0 : nextIndex;
                    })
                  }
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  aria-label="Next review"
                >
                  <span className="text-2xl text-gray-700">›</span>
                </button>
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center gap-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentReviewIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentReviewIndex === index
                        ? "bg-golden-400 whitestone:bg-blue-600 w-8"
                        : "bg-golden-400/40 whitestone:bg-blue-300 hover:bg-golden-400/60 whitestone:hover:bg-blue-400 w-2"
                    }`}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="relative mt-0 -mx-5 px-5 pt-12 pb-6 border-t-2 border-golden-400/20 whitestone:border-gray-300 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] whitestone:shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                  {/* About Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <img
                        src="/nilamee-logo-gold.png"
                        alt="Nilamee Logo"
                        className="w-9 h-9 object-contain whitestone:hidden"
                      />
                      <img
                        src="/nilamee-logo-blue.png"
                        alt="Nilamee Logo"
                        className="w-9 h-9 object-contain hidden whitestone:block"
                      />
                      <h3 className="text-gold-gradient text-xl font-bold">
                        {appConfig.appName}
                      </h3>
                    </div>
                    <p className="text-golden-300/80 whitestone:text-gray-600 text-sm leading-relaxed">
                      Bangladesh's premier online auction platform. Secure,
                      transparent, and exciting.
                    </p>
                    <div className="flex gap-3 pt-2">
                      <a
                        href="#"
                        className="w-9 h-9 rounded-lg bg-gradient-to-br from-golden-400/20 to-golden-600/20 whitestone:from-blue-100 whitestone:to-blue-200 flex items-center justify-center text-golden-300 whitestone:text-blue-700 hover:scale-110 hover:shadow-md transition-all duration-200 border border-golden-400/30 whitestone:border-blue-300"
                      >
                        <span className="text-sm font-bold">f</span>
                      </a>
                      <a
                        href="#"
                        className="w-9 h-9 rounded-lg bg-gradient-to-br from-golden-400/20 to-golden-600/20 whitestone:from-blue-100 whitestone:to-blue-200 flex items-center justify-center text-golden-300 whitestone:text-blue-700 hover:scale-110 hover:shadow-md transition-all duration-200 border border-golden-400/30 whitestone:border-blue-300"
                      >
                        <span className="text-sm font-bold">𝕏</span>
                      </a>
                      <a
                        href="#"
                        className="w-9 h-9 rounded-lg bg-gradient-to-br from-golden-400/20 to-golden-600/20 whitestone:from-blue-100 whitestone:to-blue-200 flex items-center justify-center text-golden-300 whitestone:text-blue-700 hover:scale-110 hover:shadow-md transition-all duration-200 border border-golden-400/30 whitestone:border-blue-300"
                      >
                        <span className="text-sm font-bold">in</span>
                      </a>
                      <a
                        href="#"
                        className="w-9 h-9 rounded-lg bg-gradient-to-br from-golden-400/20 to-golden-600/20 whitestone:from-blue-100 whitestone:to-blue-200 flex items-center justify-center text-golden-300 whitestone:text-blue-700 hover:scale-110 hover:shadow-md transition-all duration-200 border border-golden-400/30 whitestone:border-blue-300"
                      >
                        <span className="text-sm font-bold">IG</span>
                      </a>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h4 className="text-warm-white whitestone:text-gray-900 font-bold text-base mb-3">
                      Quick Links
                    </h4>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          to="/auctions"
                          className="text-golden-300/80 whitestone:text-gray-600 hover:text-golden-400 whitestone:hover:text-blue-600 transition-colors text-sm flex items-center gap-2 group"
                        >
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                          </span>
                          <span className="group-hover:translate-x-1 transition-transform">
                            Browse Auctions
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/how-it-works-info"
                          className="text-golden-300/80 whitestone:text-gray-600 hover:text-golden-400 whitestone:hover:text-blue-600 transition-colors text-sm flex items-center gap-2 group"
                        >
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                          </span>
                          <span className="group-hover:translate-x-1 transition-transform">
                            How It Works
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/leaderboard"
                          className="text-golden-300/80 whitestone:text-gray-600 hover:text-golden-400 whitestone:hover:text-blue-600 transition-colors text-sm flex items-center gap-2 group"
                        >
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                          </span>
                          <span className="group-hover:translate-x-1 transition-transform">
                            Leaderboard
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/about"
                          className="text-golden-300/80 whitestone:text-gray-600 hover:text-golden-400 whitestone:hover:text-blue-600 transition-colors text-sm flex items-center gap-2 group"
                        >
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                          </span>
                          <span className="group-hover:translate-x-1 transition-transform">
                            About Us
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* For Sellers */}
                  <div>
                    <h4 className="text-warm-white whitestone:text-gray-900 font-bold text-base mb-3">
                      For Sellers
                    </h4>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          to="/create-auction"
                          className="text-golden-300/80 whitestone:text-gray-600 hover:text-golden-400 whitestone:hover:text-blue-600 transition-colors text-sm flex items-center gap-2 group"
                        >
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                          </span>
                          <span className="group-hover:translate-x-1 transition-transform">
                            Create Auction
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/view-my-auctions"
                          className="text-golden-300/80 whitestone:text-gray-600 hover:text-golden-400 whitestone:hover:text-blue-600 transition-colors text-sm flex items-center gap-2 group"
                        >
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                          </span>
                          <span className="group-hover:translate-x-1 transition-transform">
                            My Auctions
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/submit-commission"
                          className="text-golden-300/80 whitestone:text-gray-600 hover:text-golden-400 whitestone:hover:text-blue-600 transition-colors text-sm flex items-center gap-2 group"
                        >
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                          </span>
                          <span className="group-hover:translate-x-1 transition-transform">
                            Submit Commission
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Contact & Legal */}
                  <div>
                    <h4 className="text-warm-white whitestone:text-gray-900 font-bold text-base mb-3">
                      Get in Touch
                    </h4>
                    <ul className="space-y-2">
                      <li className="text-golden-300/80 whitestone:text-gray-600 text-sm">
                        <a
                          href="mailto:support@nilamee.com"
                          className="hover:text-golden-400 whitestone:hover:text-blue-600 transition-colors flex items-start gap-2"
                        >
                          <span className="text-golden-400 whitestone:text-blue-600">
                            📧
                          </span>
                          <span>support@nilamee.com</span>
                        </a>
                      </li>
                      <li className="text-golden-300/80 whitestone:text-gray-600 text-sm">
                        <a
                          href="tel:+8801234567890"
                          className="hover:text-golden-400 whitestone:hover:text-blue-600 transition-colors flex items-start gap-2"
                        >
                          <span className="text-golden-400 whitestone:text-blue-600">
                            📞
                          </span>
                          <span>+880 1234-567890</span>
                        </a>
                      </li>
                      <li className="text-golden-300/80 whitestone:text-gray-600 text-sm flex items-start gap-2">
                        <span className="text-golden-400 whitestone:text-blue-600">
                          🕐
                        </span>
                        <span>9 AM - 6 PM (BST)</span>
                      </li>
                    </ul>
                    <div className="mt-3 pt-3 border-t border-golden-400/10 whitestone:border-gray-200 space-y-1.5">
                      <Link
                        to="/privacy"
                        className="block text-golden-300/70 whitestone:text-gray-500 hover:text-golden-400 whitestone:hover:text-blue-600 text-xs transition-colors"
                      >
                        Privacy Policy
                      </Link>
                      <Link
                        to="/terms"
                        className="block text-golden-300/70 whitestone:text-gray-500 hover:text-golden-400 whitestone:hover:text-blue-600 text-xs transition-colors"
                      >
                        Terms of Service
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Copyright Bar */}
                <div className="pt-6 mt-6 border-t border-golden-400/10 whitestone:border-gray-200">
                  <div className="flex justify-center items-center text-golden-300/60 whitestone:text-gray-500 text-xs">
                    <p>
                      © {new Date().getFullYear()} {appConfig.appName}. All
                      rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            </footer>
          </>
        )}

        {/* CSS for animations */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          @keyframes ticker {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .animate-ticker {
            animation: ticker 30s linear infinite;
          }

          .ticker-wrapper {
            overflow: hidden;
          }

          .ticker-content {
            display: flex;
            width: max-content;
          }
        `}</style>
      </section>
    </>
  );
};

export default Home;
