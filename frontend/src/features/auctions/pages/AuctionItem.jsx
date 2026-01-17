import { getAuctionDetail, getAuctionBidders } from "../store/auctionSlice";
import { placeBid } from "../../bids/store/bidSlice";
import React, { useEffect, useState } from "react";
import { FaGreaterThan } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuctionView from "../../../shared/components/AuctionView";
import { toast } from "react-toastify";

const AuctionItem = () => {
  const { id } = useParams();
  const { loading, auctionDetail, auctionBidders } = useSelector(
    (state) => state.auction,
  );
  const {
    isAuthenticated,
    loading: userLoading,
    hasCheckedAuth,
  } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const [amount, setAmount] = useState(0);
  const handleBid = () => {
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }
    dispatch(placeBid(id, { amount: Number(amount) }));
    // Refresh bidders after short delay to show updated bids without reloading full detail
    setTimeout(() => {
      dispatch(getAuctionBidders(id));
    }, 500);
  };

  useEffect(() => {
    if (hasCheckedAuth && !isAuthenticated) {
      navigateTo("/");
    }
    if (id) {
      dispatch(getAuctionDetail(id));
    }

    // Auto-refresh auction bidders every 5 seconds for real-time bid updates
    const interval = setInterval(() => {
      if (id && auctionDetail && new Date(auctionDetail.endTime) > Date.now()) {
        dispatch(getAuctionBidders(id));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [hasCheckedAuth, isAuthenticated, id, dispatch, navigateTo]);

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
      <div className="text-[14px] flex items-center gap-1 whitespace-nowrap text-left">
        <Link
          to="/"
          className="font-semibold transition-all duration-300 hover:text-golden-500 whitestone:hover:text-black whitestone:text-gray-900 mr-1"
        >
          Home
        </Link>
        <FaGreaterThan
          className="text-golden-300 whitestone:text-gray-900 mx-1"
          size={12}
        />
        <Link
          to={"/auctions"}
          className="font-semibold transition-all duration-300 hover:text-golden-500 whitestone:hover:text-black whitestone:text-gray-900 mx-1"
        >
          Auctions
        </Link>
        <FaGreaterThan
          className="text-golden-300 whitestone:text-gray-900 mx-1"
          size={12}
        />
        <p className="text-golden-300 whitestone:text-gray-900 ml-1 truncate">
          {auctionDetail?.title}
        </p>
      </div>

      <AuctionView
        loading={loading}
        auctionDetail={auctionDetail}
        auctionBidders={auctionBidders}
        showActionBar={true}
        amount={amount}
        setAmount={setAmount}
        onBid={handleBid}
      />
    </section>
  );
};

export default AuctionItem;
