import React from "react";

/**
 * RankProgressCard Component
 * Displays user's rank progress with current tier, spending, and progress to next rank
 * @param {number} totalTransactionVolume - Total BDT spent by user
 * @param {string} currentTier - Current badge tier (e.g., "Gold-II")
 */
const RankProgressCard = ({
  totalTransactionVolume = 0,
  currentTier = "Bronze-I",
}) => {
  // Tier thresholds (minimum BDT to reach each tier)
  const tierThresholds = [
    { tier: "Bronze-I", min: 0, max: 3333 },
    { tier: "Bronze-II", min: 3334, max: 6666 },
    { tier: "Bronze-III", min: 6667, max: 9999 },
    { tier: "Silver-I", min: 10000, max: 23333 },
    { tier: "Silver-II", min: 23334, max: 36666 },
    { tier: "Silver-III", min: 36667, max: 49999 },
    { tier: "Gold-I", min: 50000, max: 66666 },
    { tier: "Gold-II", min: 66667, max: 83333 },
    { tier: "Gold-III", min: 83334, max: 99999 },
    { tier: "Platinum-I", min: 100000, max: 233333 },
    { tier: "Platinum-II", min: 233334, max: 366666 },
    { tier: "Platinum-III", min: 366667, max: 499999 },
    { tier: "Diamond-I", min: 500000, max: 999999 },
    { tier: "Diamond-II", min: 1000000, max: 1499999 },
    { tier: "Diamond-III", min: 1500000, max: 1999999 },
    { tier: "Royal", min: 2000000, max: Infinity },
  ];

  // Find current tier index
  const currentIndex = tierThresholds.findIndex((t) => t.tier === currentTier);
  const currentTierData = tierThresholds[currentIndex] || tierThresholds[0];
  const nextTierData = tierThresholds[currentIndex + 1] || null;

  // Calculate progress
  const currentSpent = totalTransactionVolume;
  const tierMin = currentTierData.min;
  const tierMax =
    currentTierData.max === Infinity ? currentSpent : currentTierData.max;
  const nextTierMin = nextTierData?.min || tierMax;

  const remaining = nextTierData ? nextTierMin - currentSpent : 0;
  const progress = nextTierData
    ? Math.min(100, ((currentSpent - tierMin) / (nextTierMin - tierMin)) * 100)
    : 100;

  // Format BDT currency
  const formatBDT = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Tier colors for gradient
  const tierColors = {
    Bronze: "from-amber-600 to-amber-800",
    Silver: "from-gray-400 to-gray-600",
    Gold: "from-yellow-400 to-yellow-600",
    Platinum: "from-slate-300 to-slate-500",
    Diamond: "from-cyan-400 to-cyan-600",
    Royal: "from-purple-500 to-purple-700",
  };

  const [tierName] = currentTier.split("-");
  const gradientColor = tierColors[tierName] || tierColors.Bronze;

  return (
    <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/30 whitestone:backdrop-blur-xl backdrop-blur-sm border-2 border-golden-400 whitestone:border-white/30 rounded-lg p-6 shadow-xl">
      <h3 className="text-xl font-bold text-warm-white whitestone:text-gray-900 mb-4">
        Rank Progress
      </h3>

      {/* Current Rank */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-golden-300 whitestone:text-gray-700">
            Current Rank
          </span>
          <span
            className={`text-lg font-bold bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent`}
          >
            {currentTier}
          </span>
        </div>
      </div>

      {/* Total Spent */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-golden-300 whitestone:text-gray-700">
            Total Transacted
          </span>
          <span className="text-lg font-semibold text-warm-white whitestone:text-gray-900">
            {formatBDT(currentSpent)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      {nextTierData ? (
        <>
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-golden-300 whitestone:text-gray-700">
                Progress to {nextTierData.tier}
              </span>
              <span className="text-xs font-semibold text-warm-white whitestone:text-gray-900">
                {progress.toFixed(1)}%
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-6 bg-gray-800/50 whitestone:bg-gray-300 rounded-full overflow-hidden border-2 border-golden-400/30 whitestone:border-gray-400 shadow-inner">
              {/* Animated Progress Fill */}
              <div
                className={`h-full bg-gradient-to-r ${gradientColor} transition-all duration-1000 ease-out relative`}
                style={{ width: `${progress}%` }}
              >
                {/* Shiny Animation Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Remaining to Next Rank */}
          <div className="mt-3 text-center">
            <span className="text-sm text-golden-300 whitestone:text-gray-700">
              {formatBDT(remaining)} to reach{" "}
              <span className="font-semibold">{nextTierData.tier}</span>
            </span>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="text-2xl mb-2">👑</div>
          <span className="text-sm font-semibold text-purple-400 whitestone:text-purple-600">
            Maximum Rank Achieved!
          </span>
        </div>
      )}

      {/* CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default RankProgressCard;
