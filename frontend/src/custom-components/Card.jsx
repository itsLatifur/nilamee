import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Card = ({ imgSrc, title, startingBid, startTime, endTime, id }) => {
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

  return (
    <>
      <Link
        to={`/auction/item/${id}`}
        className="flex-grow basis-full bg-gradient-to-br from-burgundy-950/10 to-golden-950/5 dark:from-black/10 dark:to-gray-950/5 whitestone:bg-white/35 whitestone:backdrop-blur-xl backdrop-blur-sm whitestone:backdrop-blur-xl rounded-md group sm:basis-56 lg:basis-60 2xl:basis-80 border-2 border-golden-400 whitestone:border-white/30 dark:border-golden-500 whitestone:border-white/40 hover:border-burgundy-400 dark:hover:border-gray-600 whitestone:hover:border-blue-300 transition-all duration-300 card-hover relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-gold-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitestone:text-white"></div>
        <div className="absolute top-0 right-0 w-1 h-full bg-luxury-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <img
          src={imgSrc}
          alt={title}
          className="w-full aspect-[4/3] m-auto md:p-12"
        />
        <div className="px-2 pt-4 pb-2">
          <h5 className="font-semibold text-[18px] group-hover:text-golden-500 whitestone:hover:text-black whitestone:text-gray-800 mb-2">
            {title}
          </h5>
          {startingBid && (
            <p className="text-golden-300 whitestone:text-gray-800 font-light">
              Starting Bid:{" "}
              <span className="text-golden-300 whitestone:text-gray-800 font-bold ml-1">
                {startingBid}
              </span>
            </p>
          )}
          <p className="text-golden-300 whitestone:text-gray-800 font-light">
            {timeLeft.type}
            {Object.keys(timeLeft).length > 1 ? (
              <span className="text-golden-300 whitestone:text-gray-800 font-bold ml-1">
                {formatTimeLeft(timeLeft)}
              </span>
            ) : (
              <span className="text-golden-300 whitestone:text-gray-800 font-bold ml-1">Time's up!</span>
            )}
          </p>
        </div>
      </Link>
    </>
  );
};

export default Card;
