import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FeaturedAuctions from "./home-sub-components/FeaturedAuctions";
import UpcomingAuctions from "./home-sub-components/UpcomingAuctions";
import Leaderboard from "./home-sub-components/Leaderboard";
import Spinner from "./Spinner";
import appConfig from "../../config/appConfig";

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4">
        <div className="mb-12">
          <h1 className="text-white whitestone:text-black text-3xl font-bold mb-3 min-[480px]:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl">
            {appConfig.mainHeading1}
          </h1>
          <h1 className="text-gold-gradient text-3xl font-bold mb-6 min-[480px]:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl">
            {appConfig.mainHeading2}
          </h1>
          <p className="text-golden-300 whitestone:text-gray-700 text-lg md:text-xl max-w-2xl">
            Bid on unique items, win amazing deals, and experience transparent
            auctions.
          </p>
        </div>
        <FeaturedAuctions />

        <UpcomingAuctions />
        <Leaderboard />
      </section>
    </>
  );
};

export default Home;
