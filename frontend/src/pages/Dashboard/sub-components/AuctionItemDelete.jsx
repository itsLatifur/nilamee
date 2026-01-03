import { deleteAuctionItem } from "@/store/slices/superAdminSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AuctionItemDelete = () => {
  const { allAuctions } = useSelector((state) => state.auction);
  const dispatch = useDispatch();

  const handleAuctionDelete = (id) => {
    dispatch(deleteAuctionItem(id));
  };

  return (
    <>
      <div className="overflow-x-auto mb-10">
        <table className="min-w-full bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/30 whitestone:backdrop-blur-xl backdrop-blur-sm whitestone:backdrop-blur-xl border-2 border-golden-400 whitestone:border-white/30 rounded-lg">
          <thead className="bg-burgundy-700 dark:bg-gray-900 whitestone:bg-gray-200 text-white whitestone:text-black relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient whitestone:text-white"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gold-gradient whitestone:text-white"></div>
            <tr>
              <th className="py-2 px-4 text-left">Image</th>
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-warm-white">
            {allAuctions.length > 0 ? (
              allAuctions.map((element) => {
                return (
                  <tr key={element._id}>
                    <td className="py-2 px-4">
                      <img
                        src={element.image?.url}
                        alt={element.title}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </td>
                    <td className="py-2 px-4">{element.title}</td>
                    <td className="py-2 px-4 flex space-x-2">
                      <Link
                        to={`/auction/details/${element._id}`}
                        className="bg-blue-500 text-white whitestone:!text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-all duration-300"
                      >
                        View
                      </Link>
                      <button
                        className="bg-gold-gradient text-warm-white whitestone:!text-white py-1 px-3 rounded-md border-2 border-golden-400 whitestone:border-gray-600 shadow-lg transition-all duration-300 btn-hover"
                        onClick={() => handleAuctionDelete(element._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="text-left text-xl text-sky-600 py-3">
                <td>No Auctions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AuctionItemDelete;
