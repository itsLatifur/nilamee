import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Leaderboard = () => {
  const { leaderboard } = useSelector((state) => state.user);
  return (
    <>
      <section className="my-8 lg:px-5">
        <div className="bg-luxury-gradient rounded-lg p-6 mb-6 shadow-xl border-4 border-golden-400 dark:border-golden-500 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gold-gradient"></div>
          <div className="flex flex-col min-[340px]:flex-row min-[340px]:gap-2 items-center">
            <h3 className="text-white text-xl font-bold mb-2 min-[480px]:text-2xl md:text-3xl lg:text-4xl">
              👑 Top 10
            </h3>
            <h3 className="text-golden-300 text-xl font-bold mb-2 min-[480px]:text-2xl md:text-3xl lg:text-4xl">
              Bidders Leaderboard
            </h3>
          </div>
          <p className="text-golden-100 text-sm md:text-base mt-2">
            Elite bidders ranked by their auction prowess
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 border my-5 border-golden-300 dark:border-golden-500 shadow-md">
            <thead className="bg-luxury-gradient text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gold-gradient"></div>
              <tr>
                <th className="py-2 px-4 text-left">Profile Pic</th>
                <th className="py-2 px-4 text-left">Username</th>
                <th className="py-2 px-4 text-left">Bid Expenditure</th>
                <th className="py-2 px-4 text-left">Auctions Won</th>
              </tr>
            </thead>
            <tbody className="text-warm-white">
              {leaderboard.slice(0, 10).map((element, index) => {
                return (
                  <tr
                    key={element._id}
                    className="border-b border-gray-300 dark:border-gray-700"
                  >
                    <td className="flex gap-2 items-center py-2 px-4">
                      <span className="text-golden-300 font-semibold text-xl w-7 hidden sm:block">
                        {index + 1}
                      </span>
                      <span>
                        <img
                          src={element.profileImage?.url}
                          alt={element.username}
                          className="h-12 w-12 object-cover rounded-full"
                        />
                      </span>
                    </td>
                    <td className="py-2 px-4">{element.userName}</td>
                    <td className="py-2 px-4">{element.moneySpent}</td>
                    <td className="py-2 px-4">{element.auctionsWon}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Link
          to={"/leaderboard"}
          className="bg-burgundy-gradient font-bold text-xl w-full py-2 flex justify-center rounded-md text-warm-white border-2 border-golden-400 shadow-lg transition-all duration-300 btn-hover-no-scale"
        >
          Go to Leaderboard
        </Link>
      </section>
    </>
  );
};

export default Leaderboard;
