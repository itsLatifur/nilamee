import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FeaturedAuctions from "./home-sub-components/FeaturedAuctions";
import UpcomingAuctions from "./home-sub-components/UpcomingAuctions";
import Leaderboard from "./home-sub-components/Leaderboard";
import Spinner from "@/custom-components/Spinner";
import appConfig from "@/config/appConfig";

const Home = () => {
  const howItWorks = [
    { title: "Post Items", description: "Auctioneer posts items for bidding." },
    { title: "Place Bids", description: "Bidders place bids on listed items." },
    {
      title: "Win Notification",
      description: "Highest bidder receives a winning email.",
    },
    {
      title: "Payment & Fees",
      description: "Bidder pays; auctioneer pays 5% fee.",
    },
  ];

  const { isAuthenticated } = useSelector((state) => state.user);
  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-center">
        <div className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-2 bg-gold-gradient rounded-full shadow-xl"></div>
          <div className="absolute -left-3 top-0 bottom-0 w-1 bg-luxury-gradient rounded-full"></div>
          <div className="pl-4">
            <p className="text-golden-300 font-bold text-xl mb-8 flex items-center gap-2">
              <span className="text-golden-500">✦</span>
              {appConfig.tagline}
            </p>
            <h1
              className={`text-warm-white text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
            >
              {appConfig.mainHeading1}
            </h1>
            <h1
              className={`text-gold-gradient text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
            >
              {appConfig.mainHeading2}
            </h1>
            <div className="flex gap-4 my-8">
              {!isAuthenticated && (
                <>
                  <Link
                    to="/sign-up"
                    className="bg-luxury-gradient font-semibold rounded-md px-8 flex items-center py-2 text-warm-white border-2 border-golden-400 shadow-lg transition-all duration-300 btn-hover"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="bg-gold-gradient btn-hover font-semibold rounded-md px-8 flex items-center py-2 border-2 border-golden-400 shadow-lg transition-all duration-300 text-warm-white"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 my-8">
          <div className="bg-luxury-gradient rounded-lg p-6 shadow-xl border-4 border-golden-400 dark:border-golden-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gold-gradient"></div>
            <h3 className="text-white text-xl font-bold mb-2 min-[480px]:text-2xl md:text-3xl lg:text-4xl flex items-center gap-3">
              <span className="text-golden-300">⚜</span>
              How it works
              <span className="text-golden-300">⚜</span>
            </h3>
            <p className="text-golden-100 text-sm md:text-base">
              Your journey to winning auctions in four simple steps
            </p>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:flex-wrap w-full">
            {howItWorks.map((element) => {
              return (
                <div
                  key={element.title}
                  className="bg-gradient-to-br from-burgundy-400/60 to-burgundy-500/50 dark:from-gray-800/60 dark:to-black/50 backdrop-blur-sm flex flex-col gap-2 p-4 rounded-md h-[120px] justify-center md:w-[48%] lg:w-[47%] 2xl:w-[24%] hover:shadow-xl transition-all duration-300 hover:from-burgundy-400/70 hover:to-burgundy-500/60 dark:hover:from-gray-800/70 dark:hover:to-black/60 relative overflow-hidden shine-effect"
                >
                  <h5 className="font-bold text-golden-400 text-lg">
                    {element.title}
                  </h5>
                  <p className="text-warm-white">{element.description}</p>
                </div>
              );
            })}
          </div>
        </div>
        <FeaturedAuctions />
        <UpcomingAuctions />
        <Leaderboard />
      </section>
    </>
  );
};

export default Home;
