import { getAuctionDetail } from "../store/auctionSlice";
import { placeBid } from "../../bids/store/bidSlice";
import React, { useEffect, useState } from "react";
import { FaGreaterThan } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuctionView from "../../../shared/components/AuctionView";

const AuctionItem = () => {
  const { id } = useParams();
  const { loading, auctionDetail, auctionBidders } = useSelector(
    (state) => state.auction
  );
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const [amount, setAmount] = useState(0);
  const handleBid = () => {
    const formData = new FormData();
    formData.append("amount", amount);
    dispatch(placeBid(id, formData));
    dispatch(getAuctionDetail(id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
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
          to={"/auctions"}
          className="font-semibold transition-all duration-300 hover:text-golden-500 whitestone:hover:text-black whitestone:text-gray-900"
        >
          Auctions
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
        showActionBar={true}
        amount={amount}
        setAmount={setAmount}
        onBid={handleBid}
      />
    </section>
  );
};

export default AuctionItem;
