import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

/**
 * TrustScoreCard Component
 * Displays user's star rating with optional trust score number
 * @param {number} starRating - Star rating (1-5)
 * @param {number} trustScore - Numeric trust score (optional)
 * @param {string} size - Size variant: "sm", "md", "lg"
 * @param {boolean} showScore - Whether to display numeric trust score
 */
const TrustScoreCard = ({
  starRating = 1,
  trustScore,
  size = "md",
  showScore = false,
}) => {
  // Size configurations
  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24,
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  // Render star icons
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(starRating);
    const hasHalfStar = starRating % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar
          key={`full-${i}`}
          size={iconSizes[size]}
          className="text-yellow-500"
        />
      );
    }

    // Half star
    if (hasHalfStar && fullStars < 5) {
      stars.push(
        <FaStarHalfAlt
          key="half"
          size={iconSizes[size]}
          className="text-yellow-500"
        />
      );
    }

    // Empty stars
    const emptyStars = 5 - Math.ceil(starRating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaRegStar
          key={`empty-${i}`}
          size={iconSizes[size]}
          className="text-gray-300"
        />
      );
    }

    return stars;
  };

  return (
    <div className="inline-flex items-center gap-2 group relative cursor-default">
      {/* Star icons */}
      <div className="flex items-center gap-0.5">{renderStars()}</div>

      {/* Trust score number (optional) */}
      {showScore && trustScore !== undefined && (
        <span
          className={`${textSizes[size]} font-semibold text-gray-600 whitestone:text-gray-800`}
        >
          ({trustScore})
        </span>
      )}

      {/* Tooltip showing numeric rating */}
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
        {starRating.toFixed(1)} / 5.0 Stars
        {showScore && trustScore !== undefined && (
          <span className="block mt-1 text-yellow-400 font-semibold">
            {trustScore} Trust Points
          </span>
        )}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <div className="border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

export default TrustScoreCard;
