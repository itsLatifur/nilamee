import Spinner from "@/custom-components/Spinner";
import React from "react";
import { useSelector } from "react-redux";

const Leaderboard = () => {
  const { loading, leaderboard } = useSelector((state) => state.user);
  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="bg-luxury-gradient rounded-lg p-8 mb-6 shadow-xl border-4 border-golden-400 whitestone:border-white/30 dark:border-golden-500 whitestone:border-white/40 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient whitestone:text-white"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gold-gradient whitestone:text-white"></div>
              <h1
                className={`text-white whitestone:text-black whitestone:text-white text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl flex items-center gap-4`}
              >
                <span className="text-golden-300 whitestone:text-gray-900">??</span>
                Bidders Leaderboard
              </h1>
              <p className="text-golden-100 whitestone:text-gray-700 text-lg md:text-xl mt-2">
                Top 100 elite bidders ranked by excellence
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/30 whitestone:backdrop-blur-xl backdrop-blur-sm whitestone:backdrop-blur-xl border my-5 border-golden-400 whitestone:border-white/30 shadow-md rounded-lg">
                <thead className="bg-luxury-gradient text-white whitestone:text-black shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient whitestone:text-white"></div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gold-gradient whitestone:text-white"></div>
                  <tr>
                    <th className="py-2 px-4 text-left">Profile Pic</th>
                    <th className="py-2 px-4 text-left">Username</th>
                    <th className="py-2 px-4 text-left">Bid Expenditure</th>
                    <th className="py-2 px-4 text-left">Auctions Won</th>
                  </tr>
                </thead>
                <tbody className="text-warm-white">
                  {leaderboard.slice(0, 100).map((element, index) => {
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
          </>
        )}
      </section>
    </>
  );
};

export default Leaderboard;
