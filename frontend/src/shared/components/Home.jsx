import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FeaturedAuctions from "./home-sub-components/FeaturedAuctions";
import UpcomingAuctions from "./home-sub-components/UpcomingAuctions";
import Leaderboard from "./home-sub-components/Leaderboard";
import Spinner from "./Spinner";
import appConfig from "../../config/appConfig";

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
        <div>
          <p className="text-golden-300 font-bold text-xl mb-8 flex items-center gap-2">
            <span className="text-golden-500">✦</span>
            {appConfig.tagline}
          </p>
          <h1
            className={`text-white text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
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
                  className="bg-gold-gradient font-semibold rounded-md px-8 flex items-center py-2 border-2 border-golden-400 shadow-lg transition-all duration-300 text-warm-white btn-hover"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <h3 className="text-warm-white text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">
            How it works
          </h3>
          <div className="flex flex-col gap-4 md:flex-row md:flex-wrap w-full">
            {howItWorks.map((element) => {
              return (
                <div
                  key={element.title}
                  className="bg-gradient-to-br from-burgundy-400/60 to-burgundy-500/50 dark:from-gray-800/60 dark:to-black/50 backdrop-blur-sm flex flex-col gap-2 p-4 rounded-md h-[96px] justify-center md:w-[48%] lg:w-[47%] 2xl:w-[24%] hover:shadow-xl transition-all duration-300 hover:from-burgundy-400/70 hover:to-burgundy-500/60 dark:hover:from-gray-800/70 dark:hover:to-black/60 relative overflow-hidden shine-effect"
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
