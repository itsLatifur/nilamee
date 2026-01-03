import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Leaderboard = () => {
  const { leaderboard } = useSelector((state) => state.user);
  return (
    <>
      <section className="my-8 lg:px-5">
        <div className="flex flex-col min-[340px]:flex-row min-[340px]:gap-2">
          <h3 className="text-warm-white text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">
            Top 10
          </h3>
          <h3 className="text-golden-500 whitestone:text-gray-900 text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">
            Bidders Leaderboard
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 border my-5 border-golden-300 dark:border-golden-500 whitestone:border-white/40 shadow-md">
            <thead className="bg-luxury-gradient text-white whitestone:text-black shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient whitestone:!text-white"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gold-gradient whitestone:!text-white"></div>
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
                      <span className="text-golden-300 whitestone:text-gray-800 font-semibold text-xl w-7 hidden sm:block">
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
          className="border-2 border-golden-300 dark:border-golden-500 whitestone:border-white/40 font-bold text-xl w-full py-2 flex justify-center rounded-md text-warm-white hover:border-golden-600 hover:bg-gold-gradient transition-all duration-300 btn-hover-no-scale whitestone:!text-white"
        >
          Go to Leaderboard
        </Link>
      </section>
    </>
  );
};

export default Leaderboard;
