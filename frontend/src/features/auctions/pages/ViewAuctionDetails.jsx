import { getAuctionDetail } from "../store/auctionSlice";
import React, { useEffect } from "react";
import { FaGreaterThan } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuctionView from "../../../shared/components/AuctionView";

const ViewAuctionDetails = () => {
  const { id } = useParams();
  const { loading, auctionDetail, auctionBidders } = useSelector(
    (state) => state.auction
  );
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated || user.role === "Bidder") {
      navigateTo("/");
    }
    if (id) {
      dispatch(getAuctionDetail(id));
    }
  }, [isAuthenticated, id]);

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
      <div className="text-[16px] flex flex-wrap gap-2 items-center">
        <Link
          to="/"
          className="font-semibold transition-all duration-300 hover:text-golden-500 whitestone:hover:text-black whitestone:text-gray-900"
        >
          Home
        </Link>
        <FaGreaterThan className="text-golden-300 whitestone:text-gray-900" />
        <Link
          to={"/view-my-auctions"}
          className="font-semibold transition-all duration-300 hover:text-golden-500 whitestone:hover:text-black whitestone:text-gray-900"
        >
          My Auctions
        </Link>
        <FaGreaterThan className="text-golden-300 whitestone:text-gray-900" />
        <p className="text-golden-300 whitestone:text-gray-900">
          {auctionDetail?.title}
        </p>
      </div>

      <AuctionView
        loading={loading}
        auctionDetail={auctionDetail}
        auctionBidders={auctionBidders}
        showActionBar={false}
      />
    </section>
  );
};

export default ViewAuctionDetails;
