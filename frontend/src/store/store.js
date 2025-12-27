import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/auth/store/userSlice";
import commissionReducer from "../features/commissions/store/commissionSlice";
import auctionReducer from "../features/auctions/store/auctionSlice";
import bidReducer from "../features/bids/store/bidSlice";
import superAdminReducer from "../features/admin/store/superAdminSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    commission: commissionReducer,
    auction: auctionReducer,
    bid: bidReducer,
    superAdmin: superAdminReducer,
  },
});











