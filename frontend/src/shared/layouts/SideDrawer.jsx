import React, { useState, useEffect } from "react";
import { RiAuctionFill } from "react-icons/ri";
import {
  MdLeaderboard,
  MdDashboard,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { SiGooglesearchconsole } from "react-icons/si";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { FaFacebook, FaPalette } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdCloseCircleOutline, IoIosCreate } from "react-icons/io";
import { FaUserCircle, FaBell, FaWallet } from "react-icons/fa";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout, fetchUser } from "../../features/auth/store/userSlice";
import { Link, useLocation } from "react-router-dom";
import appConfig from "../../config/appConfig";
import { useTheme, THEMES } from "../../contexts/ThemeContext";
import NotificationPanel from "../../components/NotificationPanel";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/env";
import { toast } from "react-toastify";

const SideDrawer = () => {
  const [show, setShow] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentTheme, setTheme, THEMES } = useTheme();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  const handleRoleSwitch = async (newRole) => {
    console.log("Switching to role:", newRole);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/user/switch-role",
        { role: newRole },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Role switch response:", data);
      toast.success(data.message);
      // Refresh user data with new role
      dispatch(fetchUser());
    } catch (error) {
      console.error("Role switch error:", error);
      console.error("Error response:", error.response);
      toast.error(error.response?.data?.message || "Failed to switch role");
    }
  };

  // Fetch unread notification count
  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      // Poll every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await axios.get(API_ENDPOINTS.NOTIFICATION.ALL, {
        withCredentials: true,
      });
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch notification count:", error);
    }
  };

  return (
    <>
      <div
        onClick={() => setShow(!show)}
        className="fixed right-5 top-5 bg-gold-gradient text-warm-white whitestone:!text-white text-3xl p-2 rounded-md shadow-xl lg:hidden"
      >
        <GiHamburgerMenu />
      </div>
      <div
        className={`w-[100%] sm:w-[300px] bg-luxury-gradient h-full fixed top-0 ${
          show ? "left-0" : "left-[-100%]"
        } transition-all duration-100 p-3 flex flex-col justify-between lg:left-0 border-r-[3px] border-r-golden-400 dark:border-r-golden-500 shadow-xl overflow-y-auto`}
      >
        <div className="relative mb-4">
          <Link
            to={
              isAuthenticated &&
              user &&
              (user.role === "Super Admin" || user.role === "Admin")
                ? "/dashboard"
                : "/"
            }
            className="flex items-center gap-1"
          >
            <img
              src={
                currentTheme === THEMES.WHITESTONE
                  ? "/nilamee-logo-blue.png"
                  : "/nilamee-logo-gold.png"
              }
              alt="Nilamee Logo"
              className="w-11 h-11 object-contain"
            />
            <h4
              className="logo-text font-bold tracking-wide leading-none"
              style={{ fontSize: "0.875rem" }}
            >
              <span className="text-gold-gradient bg-clip-text text-transparent whitestone:text-blue-600">
                {appConfig.appName}
              </span>
            </h4>
          </Link>
          <ul className="flex flex-col gap-2 mt-4">
            {!(
              isAuthenticated &&
              user &&
              (user.role === "Super Admin" || user.role === "Admin")
            ) && (
              <>
                <li>
                  <Link
                    to="/auctions"
                    className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                      location.pathname === "/auctions"
                        ? "text-white bg-burgundy-600 dark:bg-gray-800 whitestone:bg-blue-600 py-2 px-3 rounded"
                        : "text-warm-white whitestone:text-gray-900 hover:text-golden-300 whitestone:hover:text-gray-800"
                    }`}
                  >
                    <RiAuctionFill /> Auctions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/leaderboard"
                    className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                      location.pathname === "/leaderboard"
                        ? "text-white bg-burgundy-600 dark:bg-gray-800 whitestone:bg-blue-600 py-2 px-3 rounded"
                        : "text-warm-white whitestone:text-gray-900 hover:text-golden-300 whitestone:hover:text-gray-800"
                    }`}
                  >
                    <MdLeaderboard /> Leaderboard
                  </Link>
                </li>
              </>
            )}
            {isAuthenticated && user && user.role === "Auctioneer" && (
              <>
                <li>
                  <Link
                    to="/submit-commission"
                    className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                      location.pathname === "/submit-commission"
                        ? "text-white bg-burgundy-600 dark:bg-gray-800 whitestone:bg-blue-600 py-2 px-3 rounded"
                        : "text-warm-white whitestone:text-gray-900 hover:text-golden-300 whitestone:hover:text-gray-800"
                    }`}
                  >
                    <FaFileInvoiceDollar /> Submit Commission
                  </Link>
                </li>
                <li>
                  <Link
                    to="/create-auction"
                    className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                      location.pathname === "/create-auction"
                        ? "text-white bg-burgundy-600 dark:bg-gray-800 whitestone:bg-blue-600 py-2 px-3 rounded"
                        : "text-warm-white whitestone:text-gray-900 hover:text-golden-300 whitestone:hover:text-gray-800"
                    }`}
                  >
                    <IoIosCreate /> Create Auction
                  </Link>
                </li>
                <li>
                  <Link
                    to="/view-my-auctions"
                    className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                      location.pathname === "/view-my-auctions"
                        ? "text-white bg-burgundy-600 dark:bg-gray-800 whitestone:bg-blue-600 py-2 px-3 rounded"
                        : "text-warm-white whitestone:text-gray-900 hover:text-golden-300 whitestone:hover:text-gray-800"
                    }`}
                  >
                    <FaEye /> View My Auctions
                  </Link>
                </li>
              </>
            )}
            {isAuthenticated &&
              user &&
              (user.role === "Super Admin" || user.role === "Admin") && (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                        location.pathname === "/dashboard"
                          ? "text-white bg-burgundy-600 dark:bg-gray-800 whitestone:bg-blue-600 py-2 px-3 rounded"
                          : "text-warm-white whitestone:text-gray-900 hover:text-golden-300 whitestone:hover:text-gray-800"
                      }`}
                    >
                      <MdDashboard /> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/manage-auctions"
                      className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                        location.pathname === "/dashboard/manage-auctions"
                          ? "text-white bg-burgundy-600 dark:bg-gray-800 whitestone:bg-blue-600 py-2 px-3 rounded"
                          : "text-warm-white whitestone:text-gray-900 hover:text-golden-300 whitestone:hover:text-gray-800"
                      }`}
                    >
                      <RiAuctionFill /> Manage Auctions
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/manage-users"
                      className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                        location.pathname === "/dashboard/manage-users"
                          ? "text-white bg-burgundy-600 dark:bg-gray-800 whitestone:bg-blue-600 py-2 px-3 rounded"
                          : "text-warm-white whitestone:text-gray-900 hover:text-golden-300 whitestone:hover:text-gray-800"
                      }`}
                    >
                      <FaUserCircle /> Manage Users
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/manage-roles"
                      className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                        location.pathname === "/dashboard/manage-roles"
                          ? "text-white bg-burgundy-600 dark:bg-gray-800 whitestone:bg-blue-600 py-2 px-3 rounded"
                          : "text-warm-white whitestone:text-gray-900 hover:text-golden-300 whitestone:hover:text-gray-800"
                      }`}
                    >
                      <MdKeyboardArrowDown /> Manage Roles
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/stats"
                      className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                        location.pathname === "/dashboard/stats"
                          ? "text-white bg-burgundy-600 dark:bg-gray-800 whitestone:bg-blue-600 py-2 px-3 rounded"
                          : "text-warm-white whitestone:text-gray-900 hover:text-golden-300 whitestone:hover:text-gray-800"
                      }`}
                    >
                      <MdLeaderboard /> Stats
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/pending-auctions"
                      className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                        location.pathname === "/dashboard/pending-auctions"
                          ? "text-white bg-burgundy-600 dark:bg-gray-800 whitestone:bg-blue-600 py-2 px-3 rounded"
                          : "text-warm-white whitestone:text-gray-900 hover:text-golden-300 whitestone:hover:text-gray-800"
                      }`}
                    >
                      <RiAuctionFill /> Pending Auctions
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/payment-proofs"
                      className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                        location.pathname === "/dashboard/payment-proofs"
                          ? "text-white bg-burgundy-600 dark:bg-gray-800 whitestone:bg-blue-600 py-2 px-3 rounded"
                          : "text-warm-white whitestone:text-gray-900 hover:text-golden-300 whitestone:hover:text-gray-800"
                      }`}
                    >
                      <FaFileInvoiceDollar /> Payment Proofs
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/database-control"
                      className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                        location.pathname === "/dashboard/database-control"
                          ? "text-white bg-burgundy-600 dark:bg-gray-800 whitestone:bg-blue-600 py-2 px-3 rounded"
                          : "text-warm-white whitestone:text-gray-900 hover:text-golden-300 whitestone:hover:text-gray-800"
                      }`}
                    >
                      <MdKeyboardArrowUp /> Database Control
                    </Link>
                  </li>
                </>
              )}
          </ul>
          {!isAuthenticated ? (
            <>
              <div className="my-4 flex gap-2">
                <Link
                  to={"/sign-up"}
                  className="bg-luxury-gradient font-semibold text-xl py-1 px-4 rounded-md text-white border-2 border-golden-400 whitestone:border-gray-400 shadow-lg transition-all duration-300 btn-hover flex items-center justify-center"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-gold-gradient font-semibold text-xl py-1 px-4 rounded-md text-white border-2 border-golden-400 whitestone:border-gray-400 shadow-lg transition-all duration-300 btn-hover flex items-center justify-center"
                >
                  Login
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="my-4 flex gap-4 w-fit" onClick={handleLogout}>
                <button className="bg-burgundy-600 font-semibold text-xl py-1 px-4 rounded-md text-warm-white border-2 border-golden-400 whitestone:border-gray-400 shadow-lg transition-all duration-300 btn-hover">
                  Logout
                </button>
              </div>
            </>
          )}
          <hr className="mb-4 border-t-golden-500" />
          <ul className="flex flex-col gap-2">
            {isAuthenticated && (
              <>
                <li>
                  <Link
                    to="/me"
                    className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                      location.pathname === "/me"
                        ? "text-white bg-burgundy-600 dark:bg-gray-800 whitestone:bg-blue-600 py-2 px-3 rounded"
                        : "text-warm-white whitestone:text-gray-900 hover:text-golden-300 whitestone:hover:text-gray-800"
                    }`}
                  >
                    <FaUserCircle /> Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setShowNotifications(true)}
                    className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 w-full text-left bg-transparent border-0 outline-none ${
                      showNotifications
                        ? "text-white bg-burgundy-600 dark:bg-gray-800 whitestone:bg-blue-600 py-2 px-3 rounded"
                        : "text-warm-white whitestone:text-gray-900 hover:text-golden-300 whitestone:hover:text-gray-800"
                    }`}
                  >
                    <FaBell /> Notifications
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-auto">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </li>
                {!(user.role === "Super Admin" || user.role === "Admin") && (
                  <li>
                    <button
                      onClick={() =>
                        handleRoleSwitch(
                          user.role === "Auctioneer" ? "Bidder" : "Auctioneer"
                        )
                      }
                      className="bg-burgundy-600 font-semibold text-xl py-1 px-4 rounded-md text-warm-white border-2 border-golden-400 whitestone:border-gray-400 shadow-lg transition-all duration-300 btn-hover w-full"
                    >
                      Switch to{" "}
                      {user.role === "Auctioneer" ? "Bidder" : "Auctioneer"}
                    </button>
                  </li>
                )}
                {user && user.role === "Auctioneer" && (
                  <li>
                    <Link
                      to="/payment-info"
                      className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                        location.pathname === "/payment-info"
                          ? "text-white bg-burgundy-600 dark:bg-gray-800 whitestone:bg-blue-600 py-2 px-3 rounded"
                          : "text-warm-white whitestone:text-gray-900 hover:text-golden-300 whitestone:hover:text-gray-800"
                      }`}
                    >
                      <FaWallet /> Payment Info
                    </Link>
                  </li>
                )}
              </>
            )}
            <li>
              <button
                onClick={() => setShowThemes(!showThemes)}
                className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 w-full text-left bg-transparent border-0 outline-none ${
                  showThemes
                    ? "text-white bg-burgundy-600 dark:bg-gray-800 whitestone:bg-blue-600 py-2 px-3 rounded"
                    : "text-warm-white whitestone:text-gray-900 hover:text-golden-300 whitestone:hover:text-gray-800"
                }`}
              >
                <FaPalette /> Theme
                <span className="ml-auto">
                  {showThemes ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                </span>
              </button>

              {showThemes && (
                <div className="mt-1 flex flex-col gap-1 pl-9">
                  <button
                    onClick={() => setTheme(THEMES.ROYAL_BURGUNDY)}
                    className={`text-left text-base py-1 rounded hover:transition-all hover:duration-150 bg-transparent border-0 outline-none w-full ${
                      currentTheme === THEMES.ROYAL_BURGUNDY
                        ? "text-golden-300 whitestone:text-blue-600 font-semibold"
                        : "text-warm-white whitestone:text-gray-700 hover:text-golden-300 whitestone:hover:text-gray-800"
                    }`}
                  >
                    Royal Burgundy
                  </button>
                  <button
                    onClick={() => setTheme(THEMES.BLACK_GOLD)}
                    className={`text-left text-base py-1 rounded hover:transition-all hover:duration-150 bg-transparent border-0 outline-none w-full ${
                      currentTheme === THEMES.BLACK_GOLD
                        ? "text-golden-300 whitestone:text-blue-600 font-semibold"
                        : "text-warm-white whitestone:text-gray-700 hover:text-golden-300 whitestone:hover:text-gray-800"
                    }`}
                  >
                    Black Gold
                  </button>
                  <button
                    onClick={() => setTheme(THEMES.WHITESTONE)}
                    className={`text-left text-base py-1 rounded hover:transition-all hover:duration-150 bg-transparent border-0 outline-none w-full ${
                      currentTheme === THEMES.WHITESTONE
                        ? "text-golden-300 whitestone:text-blue-600 font-semibold"
                        : "text-warm-white whitestone:text-gray-700 hover:text-golden-300 whitestone:hover:text-gray-800"
                    }`}
                  >
                    Whitestone
                  </button>
                </div>
              )}
            </li>
            <li>
              <Link
                to="/how-it-works-info"
                className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                  location.pathname === "/how-it-works-info"
                    ? "text-white bg-burgundy-600 dark:bg-gray-800 whitestone:bg-blue-600 py-2 px-3 rounded"
                    : "text-warm-white whitestone:text-gray-900 hover:text-golden-300 whitestone:hover:text-gray-800"
                }`}
              >
                <SiGooglesearchconsole /> How it works
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                  location.pathname === "/about"
                    ? "text-white bg-burgundy-600 dark:bg-gray-800 whitestone:bg-blue-600 py-2 px-3 rounded"
                    : "text-warm-white whitestone:text-gray-900 hover:text-golden-300 whitestone:hover:text-gray-800"
                }`}
              >
                <BsFillInfoSquareFill /> About Us
              </Link>
            </li>
          </ul>
          <IoMdCloseCircleOutline
            onClick={() => setShow(!show)}
            className="absolute top-0 right-4 text-[28px] sm:hidden"
          />
        </div>

        <div>
          <div className="flex gap-2 items-center mb-2">
            <a
              href={appConfig.socialMedia.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-900 whitestone:bg-gray-100 text-golden-600 whitestone:text-gray-900 p-2 text-xl rounded-sm transition-colors"
            >
              <FaFacebook />
            </a>
            <a
              href={appConfig.socialMedia.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-900 whitestone:bg-gray-100 text-golden-600 whitestone:text-gray-900 p-2 text-xl rounded-sm transition-colors"
            >
              <RiInstagramFill />
            </a>
          </div>
          <Link
            to={"/contact"}
            className="text-golden-400 whitestone:text-gray-700 font-semibold transition-all duration-150"
          >
            Contact Us
          </Link>
          <p className="text-golden-400 whitestone:text-gray-700">
            &copy; {appConfig.companyName}
          </p>
          <p className="text-golden-400 whitestone:text-gray-700">
            Made by{" "}
            <a
              href={appConfig.developerLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-golden-300 whitestone:text-gray-800"
            >
              LATIFUR
            </a>
          </p>
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => {
          setShowNotifications(false);
          fetchUnreadCount(); // Refresh count when closing
        }}
      />
    </>
  );
};

export default SideDrawer;
