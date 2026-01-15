import React from "react";

/**
 * VerifiedBadge Component
 * Displays verification checkmark for verified sellers/buyers
 * @param {boolean} isVerifiedSeller - Whether user is verified seller
 * @param {boolean} isVerifiedBuyer - Whether user is verified buyer
 * @param {string} size - Size variant: "sm", "md", "lg"
 */
const VerifiedBadge = ({
  isVerifiedSeller = false,
  isVerifiedBuyer = false,
  size = "md",
}) => {
  if (!isVerifiedSeller && !isVerifiedBuyer) return null;

  // Verified badge is slightly bigger than rank badges
  const iconSizes = {
    sm: 22,
    md: 26,
    lg: 34,
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const label = isVerifiedSeller
    ? "Verified Seller"
    : isVerifiedBuyer
    ? "Verified Buyer"
    : "Verified";

  return (
    <div className="inline-flex items-center relative group">
      <div className="relative">
        <img
          src="/icons/verified.png"
          alt="Verified"
          style={{ width: iconSizes[size], height: iconSizes[size] }}
          className="flex-shrink-0 object-contain cursor-default transition-transform duration-200 hover:scale-110 relative z-10"
        />
        {/* Circular Shiny Effect */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />
      </div>

      {/* Tooltip */}
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
        {label}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <div className="border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

export default VerifiedBadge;
