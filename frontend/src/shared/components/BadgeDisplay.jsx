import React from "react";

/**
 * BadgeDisplay Component
 * Displays user's badge tier with professional icons and hover tooltip
 * @param {string} tier - Badge tier (e.g., "Gold-II", "Royal")
 * @param {string} size - Size variant: "sm", "md", "lg"
 * @param {boolean} showTooltip - Whether to show tooltip on hover (default: true)
 */
const BadgeDisplay = ({ tier, size = "md", showTooltip = true }) => {
  if (!tier) return null;

  // Size configurations - all badges same size
  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 32,
  };

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  // Get icon path based on tier
  const getIconPath = () => {
    const tierLower = tier.toLowerCase().replace(/-/g, "-");
    return `/icons/${tierLower}.png`;
  };

  // Badge configurations
  const badgeConfig = {
    Bronze: {
      bgColor: "bg-amber-50",
      borderColor: "border-amber-300",
      label: "Bronze",
      gradient: "from-amber-700 to-amber-900",
    },
    Silver: {
      bgColor: "bg-gray-50",
      borderColor: "border-gray-300",
      label: "Silver",
      gradient: "from-gray-300 to-gray-500",
    },
    Gold: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-400",
      label: "Gold",
      gradient: "from-yellow-400 to-yellow-600",
    },
    Platinum: {
      bgColor: "bg-slate-50",
      borderColor: "border-slate-300",
      label: "Platinum",
      gradient: "from-slate-200 to-slate-400",
    },
    Diamond: {
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-300",
      label: "Diamond",
      gradient: "from-cyan-300 to-cyan-500",
    },
    Royal: {
      bgColor: "bg-purple-50",
      borderColor: "border-purple-400",
      label: "Royal",
      gradient: "from-purple-500 to-purple-700",
    },
  };

  const [tierName] = tier.split("-");
  const config = badgeConfig[tierName] || badgeConfig.Bronze;

  return (
    <div className="inline-flex items-center relative group">
      <div className="relative">
        <img
          src={getIconPath()}
          alt={tier}
          style={{ width: iconSizes[size], height: iconSizes[size] }}
          className="flex-shrink-0 object-contain cursor-default transition-transform duration-200 hover:scale-110 relative z-10"
        />
        {/* Circular Shiny Effect */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle, ${
              tierName === "Bronze"
                ? "rgba(217, 119, 6, 0.4)"
                : tierName === "Silver"
                ? "rgba(156, 163, 175, 0.4)"
                : tierName === "Gold"
                ? "rgba(234, 179, 8, 0.4)"
                : tierName === "Platinum"
                ? "rgba(148, 163, 184, 0.4)"
                : tierName === "Diamond"
                ? "rgba(34, 211, 238, 0.4)"
                : "rgba(168, 85, 247, 0.4)"
            } 0%, transparent 70%)`,
            filter: "blur(8px)",
          }}
        />
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="
            absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
            px-3 py-1.5 
            bg-gray-900 text-white text-xs rounded-lg
            whitespace-nowrap
            opacity-0 invisible group-hover:opacity-100 group-hover:visible
            transition-all duration-200
            pointer-events-none
            z-50
          "
        >
          {tier}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;
