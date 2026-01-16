import mongoose from "mongoose";

const metricsSchema = new mongoose.Schema(
  {
    _id: { type: String, default: "site_metrics" },
    totalAuctionsApproved: { type: Number, default: 0 },
    totalTransactionsCount: { type: Number, default: 0 },
    totalUsers: { type: Number, default: 0 },
  },
  { _id: false }
);

export const SiteMetrics = mongoose.model("SiteMetrics", metricsSchema);

export const incrementMetric = async (field, by = 1) => {
  const update = { $inc: {} };
  update.$inc[field] = by;
  const doc = await SiteMetrics.findOneAndUpdate(
    { _id: "site_metrics" },
    update,
    { upsert: true, new: true }
  );
  return doc;
};

export const getMetrics = async () => {
  const doc = await SiteMetrics.findById("site_metrics");
  return (
    doc || {
      totalAuctionsApproved: 0,
      totalTransactionsCount: 0,
      totalUsers: 0,
    }
  );
};
