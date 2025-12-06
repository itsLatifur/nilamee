import React, { useState } from "react";
import { FaFacebook, FaEye } from "react-icons/fa";
import { RiAuctionFill, RiInstagramFill } from "react-icons/ri";
import { MdLeaderboard, MdDashboard } from "react-icons/md";
import { IoMdCloseCircleOutline, IoIosCreate } from "react-icons/io";
import { SiGooglesearchconsole } from "react-icons/si";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/userSlice.js";
import { Link } from "react-router-dom";

const SideDrawer = () => {
  const [show, setShow] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <div
        onClick={() => setShow(!show)}
        className="fixed right-5 top-5 bg-[#D6482B] text-white text-3xl p-2 rounded-md hover:bg-[#b8381e] lg:hidden"
      >
        <GiHamburgerMenu />
      </div>
    </>
  );
};

export default SideDrawer;
