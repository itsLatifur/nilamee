import React, { useState } from "react";
import { RiAuctionFill } from "react-icons/ri";
import {
  MdLeaderboard,
  MdDashboard,
  MdLightMode,
  MdDarkMode,
} from "react-icons/md";
import { SiGooglesearchconsole } from "react-icons/si";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdCloseCircleOutline, IoIosCreate } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/userSlice";
import { Link } from "react-router-dom";
import appConfig from "@/config/appConfig";
import { useTheme } from "@/contexts/ThemeContext";

const SideDrawer = () => {
  const [show, setShow] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <div
        onClick={() => setShow(!show)}
        className="fixed right-5 top-5 bg-gold-gradient text-warm-white text-3xl p-2 rounded-md shadow-xl lg:hidden"
      >
        <GiHamburgerMenu />
      </div>
      <div
        className={`w-[100%] sm:w-[300px] bg-luxury-gradient h-full fixed top-0 ${
          show ? "left-0" : "left-[-100%]"
        } transition-all duration-100 p-4 flex flex-col justify-between lg:left-0 border-r-[3px] border-r-golden-400 dark:border-r-golden-500 shadow-xl`}
      >
        <div className="relative">
          <Link to={"/"}>
            <h4 className="text-3xl font-bold mb-6 tracking-wide">
              <span className="text-gold-gradient bg-clip-text text-transparent">
                {appConfig.appName}
              </span>
            </h4>
          </Link>
          <ul className="flex flex-col gap-3">
            <li>
              <Link
                to={"/auctions"}
                className="flex text-xl font-semibold gap-2 items-center text-warm-white hover:text-golden-300 hover:transition-all hover:duration-150 link-hover"
              >
                <RiAuctionFill /> Auctions
              </Link>
            </li>
            <li>
              <Link
                to={"/leaderboard"}
                className="flex text-xl font-semibold gap-2 items-center text-warm-white hover:text-golden-300 hover:transition-all hover:duration-150 link-hover"
              >
                <MdLeaderboard /> Leaderboard
              </Link>
            </li>
            {isAuthenticated && user && user.role === "Auctioneer" && (
              <>
                <li>
                  <Link
                    to={"/submit-commission"}
                    className="flex text-xl font-semibold gap-2 items-center text-warm-white hover:text-golden-300 hover:transition-all hover:duration-150 link-hover"
                  >
                    <FaFileInvoiceDollar /> Submit Commission
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/create-auction"}
                    className="flex text-xl font-semibold gap-2 items-center text-white hover:text-golden-300 hover:transition-all hover:duration-150"
                  >
                    <IoIosCreate /> Create Auction
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/view-my-auctions"}
                    className="flex text-xl font-semibold gap-2 items-center text-white hover:text-golden-300 hover:transition-all hover:duration-150"
                  >
                    <FaEye /> View My Auctions
                  </Link>
                </li>
              </>
            )}
            {isAuthenticated && user && user.role === "Super Admin" && (
              <li>
                <Link
                  to={"/dashboard"}
                  className="flex text-xl font-semibold gap-2 items-center text-white hover:text-golden-300 hover:transition-all hover:duration-150"
                >
                  <MdDashboard /> Dashboard
                </Link>
              </li>
            )}
          </ul>
          {!isAuthenticated ? (
            <>
              <div className="my-4 flex gap-2">
                <Link
                  to={"/sign-up"}
                  className="bg-luxury-gradient font-semibold text-xl py-1 px-4 rounded-md text-warm-white border-2 border-golden-400 shadow-lg transition-all duration-300 btn-hover"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-gold-gradient font-semibold text-xl py-1 px-4 rounded-md border-2 border-golden-400 shadow-lg transition-all duration-300 text-warm-white btn-hover"
                >
                  Login
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="my-4 flex gap-4 w-fit" onClick={handleLogout}>
                <button className="bg-burgundy-600 font-semibold text-xl py-1 px-4 rounded-md text-warm-white border-2 border-golden-400 shadow-lg transition-all duration-300 btn-hover">
                  Logout
                </button>
              </div>
            </>
          )}
          <hr className="mb-4 border-t-golden-500" />
          <ul className="flex flex-col gap-3">
            {isAuthenticated && (
              <li>
                <Link
                  to={"/me"}
                  className="flex text-xl font-semibold gap-2 items-center text-white hover:text-golden-300 hover:transition-all hover:duration-150"
                >
                  <FaUserCircle /> Profile
                </Link>
              </li>
            )}
            <li>
              <Link
                to={"/how-it-works-info"}
                className="flex text-xl font-semibold gap-2 items-center text-white hover:text-golden-300 hover:transition-all hover:duration-150"
              >
                <SiGooglesearchconsole /> How it works
              </Link>
            </li>
            <li>
              <Link
                to={"/about"}
                className="flex text-xl font-semibold gap-2 items-center text-white hover:text-golden-300 hover:transition-all hover:duration-150"
              >
                <BsFillInfoSquareFill /> About Us
              </Link>
            </li>
          </ul>
          <IoMdCloseCircleOutline
            onClick={() => setShow(!show)}
            className="absolute top-0 right-4 text-[28px] sm:hidden text-white hover:text-golden-300"
          />
        </div>

        <div>
          <ul className="flex flex-col gap-3 mb-4">
            <li>
              <div className="flex text-xl font-semibold gap-2 items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  {isDarkMode ? <MdDarkMode /> : <MdLightMode />}
                  <span>Dark Mode</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    isDarkMode ? "bg-golden-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDarkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </li>
          </ul>

          <div className="flex gap-2 items-center mb-2">
            <a
              href={appConfig.socialMedia.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-900 text-golden-300 p-2 text-xl rounded-sm hover:text-golden-600"
            >
              <FaFacebook />
            </a>
            <a
              href={appConfig.socialMedia.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-900 text-golden-300 p-2 text-xl rounded-sm hover:text-burgundy-500 dark:hover:text-gray-400"
            >
              <RiInstagramFill />
            </a>
          </div>
          <Link
            to={"/contact"}
            className="text-golden-300 font-semibold hover:text-golden-500 hover:transition-all hover:duration-150"
          >
            Contact Us
          </Link>
          <p className="text-golden-300">&copy; {appConfig.companyName}</p>
          <p className="text-golden-300">
            Designed By{" "}
            <a
              href={appConfig.developerLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:text-golden-500 hover:transition-all hover:duration-150"
            >
              {appConfig.developerName}
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
