import React from "react";

/**
 * PremiumBadge Component (archived)
 */
const PremiumBadge = ({ isPremium, size = "md" }) => {
  if (!isPremium) return null;

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 26,
  };

  return (
    <div className="inline-flex items-center relative group">
      <div className="relative">
        <img
          src="/icons/premium.png"
          alt="Premium Member"
          style={{
            width: iconSizes[size],
            height: iconSizes[size],
          }}
          className="cursor-default transition-transform duration-200 hover:scale-110 object-contain relative z-10"
        />
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle, rgba(234, 179, 8, 0.5) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />
      </div>

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
        Premium Member
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <div className="border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

export default PremiumBadge;
