// This file is deprecated. Use frontend/src/shared/layouts/SideDrawer.jsx instead

const SideDrawer = () => {
  const [show, setShow] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const { currentTheme, setTheme, THEMES } = useTheme();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
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
                to="/auctions"
                className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                  location.pathname === "/auctions"
                    ? "text-golden-300 whitestone:text-gray-800 bg-burgundy-600 dark:bg-gray-800 whitestone:bg-gray-200 py-2 px-3 rounded"
                    : "text-warm-white hover:text-golden-300 whitestone:text-gray-900 whitestone:hover:text-gray-800"
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
                    ? "text-golden-300 whitestone:text-gray-800 bg-burgundy-600 dark:bg-gray-800 whitestone:bg-gray-200 py-2 px-3 rounded"
                    : "text-warm-white hover:text-golden-300 whitestone:text-gray-900 whitestone:hover:text-gray-800"
                }`}
              >
                <MdLeaderboard /> Leaderboard
              </Link>
            </li>
            {isAuthenticated && user && user.role === "Auctioneer" && (
              <>
                <li>
                  <Link
                    to="/submit-commission"
                    className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                      location.pathname === "/submit-commission"
                        ? "text-golden-300 whitestone:text-gray-800 bg-burgundy-600 dark:bg-gray-800 whitestone:bg-gray-200 py-2 px-3 rounded"
                        : "text-warm-white hover:text-golden-300 whitestone:text-gray-900 whitestone:hover:text-gray-800"
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
                        ? "text-golden-300 whitestone:text-gray-800 bg-burgundy-600 dark:bg-gray-800 whitestone:bg-gray-200 py-2 px-3 rounded"
                        : "text-warm-white hover:text-golden-300 whitestone:text-gray-900 whitestone:hover:text-gray-800"
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
                        ? "text-golden-300 whitestone:text-gray-800 bg-burgundy-600 dark:bg-gray-800 whitestone:bg-gray-200 py-2 px-3 rounded"
                        : "text-warm-white hover:text-golden-300 whitestone:text-gray-900 whitestone:hover:text-gray-800"
                    }`}
                  >
                    <FaEye /> View My Auctions
                  </Link>
                </li>
              </>
            )}
            {isAuthenticated && user && user.role === "Super Admin" && (
              <li>
                <Link
                  to="/dashboard"
                  className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                    location.pathname === "/dashboard"
                      ? "text-golden-300 whitestone:text-gray-800 bg-burgundy-600 dark:bg-gray-800 whitestone:bg-gray-200 py-2 px-3 rounded"
                      : "text-warm-white hover:text-golden-300 whitestone:text-gray-900 whitestone:hover:text-gray-800"
                  }`}
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
                  className="bg-luxury-gradient font-semibold text-xl py-1 px-4 rounded-md text-warm-white border-2 border-golden-400 whitestone:border-gray-400 shadow-lg transition-all duration-300 btn-hover"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-gold-gradient font-semibold text-xl py-1 px-4 rounded-md border-2 border-golden-400 whitestone:border-gray-400 shadow-lg transition-all duration-300 text-warm-white whitestone:text-white btn-hover"
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
          <ul className="flex flex-col gap-3">
            {isAuthenticated && (
              <li>
                <Link
                  to="/me"
                  className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                    location.pathname === "/me"
                      ? "text-golden-300 whitestone:text-gray-800 bg-burgundy-600 dark:bg-gray-800 whitestone:bg-gray-200 py-2 px-3 rounded"
                      : "text-warm-white hover:text-golden-300 whitestone:text-gray-900 whitestone:hover:text-gray-800"
                  }`}
                >
                  <FaUserCircle /> Profile
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/how-it-works-info"
                className={`flex text-xl font-semibold gap-2 items-center hover:transition-all hover:duration-150 ${
                  location.pathname === "/how-it-works-info"
                    ? "text-golden-300 whitestone:text-gray-800 bg-burgundy-600 dark:bg-gray-800 whitestone:bg-gray-200 py-2 px-3 rounded"
                    : "text-warm-white hover:text-golden-300 whitestone:text-gray-900 whitestone:hover:text-gray-800"
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
                    ? "text-golden-300 whitestone:text-gray-800 bg-burgundy-600 dark:bg-gray-800 whitestone:bg-gray-200 py-2 px-3 rounded"
                    : "text-warm-white hover:text-golden-300 whitestone:text-gray-900 whitestone:hover:text-gray-800"
                }`}
              >
                <BsFillInfoSquareFill /> About Us
              </Link>
            </li>
          </ul>
          <IoMdCloseCircleOutline
            onClick={() => setShow(!show)}
            className="absolute top-0 right-4 text-[28px] sm:hidden text-white whitestone:text-gray-900 hover:text-golden-300 whitestone:hover:text-gray-800 whitestone:text-gray-900"
          />
        </div>

        <div>
          <ul className="flex flex-col gap-3 mb-4">
            <li>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowThemes(!showThemes)}
                  className="flex text-xl font-semibold gap-2 items-center justify-between text-warm-white whitestone:text-gray-900 hover:text-golden-300 whitestone:hover:text-gray-800 transition-all duration-150"
                >
                  <div className="flex items-center gap-2">
                    <FaPalette />
                    <span>Theme</span>
                  </div>
                  {showThemes ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                </button>

                {showThemes && (
                  <div className="ml-8 flex flex-col gap-2 mt-1">
                    <button
                      onClick={() => setTheme(THEMES.ROYAL_BURGUNDY)}
                      className={`text-left text-lg py-1 px-2 rounded transition-all duration-150 ${
                        currentTheme === THEMES.ROYAL_BURGUNDY
                          ? "text-golden-300 whitestone:text-gray-800 bg-burgundy-600 dark:bg-gray-800 font-semibold"
                          : "text-warm-white hover:text-golden-300 whitestone:hover:text-gray-800 whitestone:text-gray-900"
                      }`}
                    >
                      Royal Burgundy
                    </button>
                    <button
                      onClick={() => setTheme(THEMES.BLACK_GOLD)}
                      className={`text-left text-lg py-1 px-2 rounded transition-all duration-150 ${
                        currentTheme === THEMES.BLACK_GOLD
                          ? "text-golden-300 whitestone:text-gray-800 bg-burgundy-600 dark:bg-gray-800 font-semibold"
                          : "text-warm-white hover:text-golden-300 whitestone:hover:text-gray-800 whitestone:text-gray-900"
                      }`}
                    >
                      Black Gold
                    </button>
                    <button
                      onClick={() => setTheme(THEMES.WHITESTONE)}
                      className={`text-left text-lg py-1 px-2 rounded transition-all duration-150 ${
                        currentTheme === THEMES.WHITESTONE
                          ? "text-golden-300 whitestone:text-gray-800 bg-burgundy-600 dark:bg-gray-800 whitestone:bg-gray-50 font-semibold"
                          : "text-warm-white hover:text-golden-300 whitestone:hover:text-gray-800 whitestone:text-gray-900"
                      }`}
                    >
                      Whitestone
                    </button>
                  </div>
                )}
              </div>
            </li>
          </ul>

          <div className="flex gap-2 items-center mb-2">
            <a
              href={appConfig.socialMedia.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-900 whitestone:bg-gray-100 text-golden-300 whitestone:text-gray-800 p-2 text-xl rounded-sm hover:text-golden-600 whitestone:hover:text-gray-900 whitestone:text-gray-900"
            >
              <FaFacebook />
            </a>
            <a
              href={appConfig.socialMedia.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-900 whitestone:bg-gray-100 text-golden-300 whitestone:text-gray-800 p-2 text-xl rounded-sm hover:text-burgundy-500 dark:hover:text-gray-400 whitestone:hover:text-gray-900"
            >
              <RiInstagramFill />
            </a>
          </div>
          <Link
            to="/contact"
            className={`text-lg font-semibold hover:transition-all hover:duration-150 inline-block ${
              location.pathname === "/contact"
                ? "text-golden-300 whitestone:text-gray-800"
                : "text-golden-300 whitestone:text-gray-800 hover:text-golden-500 whitestone:hover:text-gray-900"
            }`}
          >
            Contact Us
          </Link>
          <p className="text-golden-300 whitestone:text-gray-800">
            &copy; {appConfig.companyName}
          </p>
          <p className="text-golden-300 whitestone:text-gray-800">
            Made by{" "}
            <a
              href={appConfig.developerLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:text-golden-500 whitestone:hover:text-gray-900 hover:transition-all hover:duration-150"
            >
              LATIFUR
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
