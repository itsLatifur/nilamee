/**
 * Calculate badge tier based on total transaction volume
 * @param {Number} totalVolume - Total BDT transacted across all completed auctions
 * @returns {String} Badge tier (e.g., "Gold-II", "Royal")
 */
export const calculateBadgeTier = (totalVolume) => {
  // Define tier ranges
  const tiers = [
    { name: "Bronze", min: 0, max: 9999, subTiers: true },
    { name: "Silver", min: 10000, max: 49999, subTiers: true },
    { name: "Gold", min: 50000, max: 99999, subTiers: true },
    { name: "Platinum", min: 100000, max: 499999, subTiers: true },
    { name: "Diamond", min: 500000, max: 1999999, subTiers: true },
    { name: "Royal", min: 2000000, max: Infinity, subTiers: false },
  ];

  for (let tier of tiers) {
    if (totalVolume >= tier.min && totalVolume <= tier.max) {
      if (!tier.subTiers) return "Royal";

      // Calculate sub-tier (I, II, III)
      const range = tier.max - tier.min + 1;
      const subTierSize = range / 3;

      if (totalVolume < tier.min + subTierSize) {
        return `${tier.name}-I`;
      } else if (totalVolume < tier.min + 2 * subTierSize) {
        return `${tier.name}-II`;
      } else {
        return `${tier.name}-III`;
      }
    }
  }

  return "Bronze-I"; // Default for edge cases
};

/**
 * Calculate star rating from trust score
 * @param {Number} trustScore - User's total trust points
 * @returns {Number} Star rating (1-5)
 */
export const calculateStarRating = (trustScore) => {
  if (trustScore < 0) return 1;
  const stars = Math.floor(trustScore / 100);
  return Math.min(5, Math.max(1, stars || 1));
};

/**
 * Calculate trust points earned for a transaction
 * @param {Object} params - Transaction details
 * @returns {Number} Trust points earned
 */
export const calculateTrustPoints = ({
  role,
  amount,
  timeHours,
  hasDispute = false,
  disputeOutcome = null,
}) => {
  let points = 10; // Base points

  // Volume bonus: 1 point per 1000 BDT
  points += Math.floor(amount / 1000);

  if (role === "Bidder") {
    // Payment speed bonus
    if (timeHours < 1) points += 15;
    else if (timeHours < 6) points += 10;
    else if (timeHours < 12) points += 5;
  } else if (role === "Auctioneer") {
    // Delivery speed bonus (convert hours to days)
    const days = timeHours / 24;
    if (days <= 3) points += 15;
    else if (days <= 7) points += 10;
    else if (days <= 14) points += 5;
  }

  // Dispute penalties
  if (hasDispute && disputeOutcome === "lost") {
    points -= role === "Auctioneer" ? 50 : 10;
  }

  return Math.max(0, points); // Never negative
};
