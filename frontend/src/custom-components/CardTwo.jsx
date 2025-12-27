import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { deleteAuction, republishAuction } from "@/store/slices/auctionSlice";

const CardTwo = ({ imgSrc, title, startingBid, startTime, endTime, id }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const startDifference = new Date(startTime) - now;
    const endDifference = new Date(endTime) - now;
    let timeLeft = {};

    if (startDifference > 0) {
      timeLeft = {
        type: "Starts In:",
        days: Math.floor(startDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((startDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((startDifference / 1000 / 60) % 60),
        seconds: Math.floor((startDifference / 1000) % 60),
      };
    } else if (endDifference > 0) {
      timeLeft = {
        type: "Ends In:",
        days: Math.floor(endDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((endDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((endDifference / 1000 / 60) % 60),
        seconds: Math.floor((endDifference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    });
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTimeLeft = ({ days, hours, minutes, seconds }) => {
    const pad = (num) => String(num).padStart(2, "0");
    return `(${days} Days) ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const dispatch = useDispatch();
  const handleDeleteAuction = () => {
    dispatch(deleteAuction(id));
  };

  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <>
      <div className="basis-full bg-gradient-to-br from-burgundy-950/10 to-golden-950/5 dark:from-black/10 dark:to-gray-950/5 backdrop-blur-sm rounded-md group sm:basis-56 lg:basis-60 2xl:basis-80 border-2 border-golden-400 dark:border-golden-500 hover:border-burgundy-400 dark:hover:border-gray-600 transition-all duration-300 relative overflow-hidden card-hover">
        <div className="absolute top-0 left-0 w-1 h-full bg-gold-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-0 right-0 w-1 h-full bg-luxury-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <img
          src={imgSrc}
          alt={title}
          className="w-full aspect-[4/3] m-auto md:p-12"
        />
        <div className="px-2 pt-4 pb-2">
          <h5 className="font-semibold text-[18px] group-hover:text-golden-300 mb-2 text-warm-white">
            {title}
          </h5>
          {startingBid && (
            <p className="text-golden-300 font-light">
              Starting Bid:{" "}
              <span className="text-golden-300 font-bold ml-1">
                {startingBid}
              </span>
            </p>
          )}
          <p className="text-golden-300 font-light">
            {timeLeft.type}
            {Object.keys(timeLeft).length > 1 ? (
              <span className="text-golden-300 font-bold ml-1">
                {formatTimeLeft(timeLeft)}
              </span>
            ) : (
              <span className="text-golden-300 font-bold ml-1">Time's up!</span>
            )}
          </p>
          <div className="flex flex-col gap-2 mt-4">
            <Link
              className="bg-gold-gradient text-center text-warm-white text-xl px-4 py-2 rounded-md transition-all duration-300 border-2 border-golden-400 shadow-lg btn-hover"
              to={`/auction/details/${id}`}
            >
              View Auction
            </Link>
            <button
              className="bg-burgundy-gradient text-center text-warm-white text-xl px-4 py-2 rounded-md transition-all duration-300 border-2 border-golden-400 shadow-lg btn-hover"
              onClick={handleDeleteAuction}
            >
              Delete Auction
            </button>
            <button
              disabled={new Date(endTime) > Date.now()}
              onClick={() => setOpenDrawer(true)}
              className="bg-sky-400 text-center text-white text-xl px-4 py-2 rounded-md transition-all duration-300 hover:bg-sky-700"
            >
              Republish Auction
            </button>
          </div>
        </div>
      </div>
      <Drawer id={id} openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
    </>
  );
};

export default CardTwo;

const Drawer = ({ setOpenDrawer, openDrawer, id }) => {
  const dispatch = useDispatch();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const { loading } = useSelector((state) => state.auction);
  const handleRepbulishAuction = () => {
    const formData = new FormData();
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);
    dispatch(republishAuction(id, formData));
  };

  return (
    <section
      className={`fixed ${
        openDrawer && id ? "bottom-0" : "-bottom-full"
      }  left-0 w-full transition-all duration-300 h-full bg-[#00000087] flex items-end`}
    >
      <div className="bg-gradient-to-br from-burgundy-950/95 to-golden-950/90 dark:from-black/95 dark:to-gray-950/90 backdrop-blur-sm h-fit transition-all duration-300 w-full border-t-4 border-golden-400">
        <div className="w-full px-5 py-8 sm:max-w-[640px] sm:m-auto">
          <h3 className="text-golden-500  text-3xl font-semibold text-center mb-1">
            Republish Auction
          </h3>
          <p className="text-golden-300">
            Let's republish auction with same details but new starting and
            ending time.
          </p>
          <form className="flex flex-col gap-5 my-5">
            <div className="flex flex-col gap-3">
              <label className="text-[16px] text-golden-300">
                Republish Auction Start Time
              </label>
              <DatePicker
                selected={startTime}
                onChange={(date) => setStartTime(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat={"MMMM d, yyyy h,mm aa"}
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 focus:outline-none w-full text-warm-white"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[16px] text-golden-300">
                Republish Auction End Time
              </label>
              <DatePicker
                selected={endTime}
                onChange={(date) => setEndTime(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat={"MMMM d, yyyy h,mm aa"}
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 focus:outline-none w-full text-warm-white"
              />
            </div>
            <div>
              <button
                type="button"
                className="bg-gold-gradient btn-hover flex justify-center w-full py-2 rounded-md text-warm-white font-semibold text-xl transition-all duration-300 border-2 border-golden-400 shadow-lg"
                onClick={handleRepbulishAuction}
              >
                {loading ? "Republishing" : "Republish"}
              </button>
            </div>
            <div>
              <button
                type="button"
                className="bg-burgundy-gradient btn-hover flex justify-center w-full py-2 rounded-md text-warm-white font-semibold text-xl transition-all duration-300 border-2 border-golden-400 shadow-lg"
                onClick={() => setOpenDrawer(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
