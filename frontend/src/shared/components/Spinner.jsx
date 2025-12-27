import React from "react";
import { HashLoader } from "react-spinners";
import { PREMIUM_GOLD } from "@/lib/colors";

const Spinner = () => {
  return (
    <div className="w-full min-h-[600px] flex justify-center items-center">
      <HashLoader size={130} color={PREMIUM_GOLD} />
    </div>
  );
};

export default Spinner;













