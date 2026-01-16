import { catchAsyncErrors } from "../../shared/middlewares/async.middleware.js";
import { User } from "../../models/userSchema.js";
import { Auction } from "../auctions/auctions.model.js";
import { Escrow } from "../escrow/escrow.model.js";
import { getMetrics } from "./metrics.model.js";

// GET /api/v1/public/stats
export const getSiteStats = catchAsyncErrors(async (req, res, next) => {
  // total users (count every user ever created, including deleted/banned)
  // Prefer persisted `totalUsers` metric if available (seeded); otherwise fallback
  // to raw collection count.
  const metrics = await getMetrics();
  const totalUsers =
    metrics && typeof metrics.totalUsers === "number" && metrics.totalUsers >= 0
      ? metrics.totalUsers
      : await User.collection.countDocuments();

  // active users in last 30 days (include deleted/banned per request)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const activeUsers = await User.countDocuments({
    lastActivityDate: { $gte: thirtyDaysAgo },
  }).setOptions({ includeDeleted: true });

  // total auctions (prefer persisted counter if available)
  // metrics already loaded above
  const totalAuctions =
    metrics && metrics.totalAuctionsApproved > 0
      ? metrics.totalAuctionsApproved
      : await Auction.collection.countDocuments();

  // total transaction value from escrow records
  const agg = await Escrow.aggregate([
    { $match: { totalAmount: { $exists: true } } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);
  const totalTransactionValue = agg && agg.length > 0 ? agg[0].total : 0;

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      activeUsers,
      totalAuctions,
      totalTransactionValue,
      totalTransactionsCount: metrics.totalTransactionsCount || 0,
    },
  });
});

export default { getSiteStats };
