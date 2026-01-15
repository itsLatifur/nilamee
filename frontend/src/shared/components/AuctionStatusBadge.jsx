import React from "react";

const AuctionStatusBadge = ({ status, size = "md" }) => {
  const getStatusConfig = () => {
    const configs = {
      "Pending Approval": {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: "⏳",
      },
      Live: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: "🔴",
      },
      "Ended - Awaiting Payment": {
        bg: "bg-orange-100",
        text: "text-orange-800",
        icon: "💰",
      },
      "Paid - Awaiting Shipment": {
        bg: "bg-purple-100",
        text: "text-purple-800",
        icon: "📦",
      },
      "Shipped - In Transit": {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: "🚚",
      },
      Completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: "✅",
      },
      Cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: "❌",
      },
      Disputed: {
        bg: "bg-orange-100",
        text: "text-orange-800",
        icon: "⚠️",
      },
    };

    return (
      configs[status] || {
        bg: "bg-gray-100",
        text: "text-gray-800",
        icon: "📋",
      }
    );
  };

  const config = getStatusConfig();

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`${config.bg} ${config.text} ${sizeClasses[size]} rounded-full font-semibold inline-flex items-center gap-1`}
    >
      <span>{config.icon}</span>
      <span>{status}</span>
    </span>
  );
};

export default AuctionStatusBadge;
