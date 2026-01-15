import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

/**
 * FeedbackForm Component
 * Form for buyers to submit feedback after auction completion
 * @param {string} auctionId - ID of the completed auction
 * @param {function} onSuccess - Callback after successful submission
 */
const FeedbackForm = ({ auctionId, onSuccess }) => {
  const [feedbackText, setFeedbackText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (feedbackText.trim().length < 10) {
      toast.error("Feedback must be at least 10 characters long");
      return;
    }

    if (feedbackText.length > 500) {
      toast.error("Feedback cannot exceed 500 characters");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/feedback/submit`,
        { auctionId, feedbackText },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Feedback submitted successfully!");
        setFeedbackText("");
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <div className="mb-2">
        <label className="block text-sm font-semibold mb-2 text-gray-700 whitestone:text-gray-900">
          Share your experience with this seller (10-500 characters)
        </label>
        <textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="E.g., Fast shipping, item exactly as described!"
          className="
            w-full px-3 py-2 
            border-2 border-gray-300 rounded-lg
            focus:border-golden-500 focus:outline-none
            resize-none
            text-gray-800
            whitestone:border-gray-400
          "
          rows={4}
          maxLength={500}
          disabled={submitting}
        />
        <div className="text-xs text-gray-500 mt-1">
          {feedbackText.length}/500 characters
          {feedbackText.length < 10 && feedbackText.length > 0 && (
            <span className="text-red-500 ml-2">
              (Minimum 10 characters required)
            </span>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || feedbackText.trim().length < 10}
        className="
          flex items-center gap-2 px-4 py-2
          bg-gold-gradient text-white font-semibold rounded-lg
          border-2 border-golden-400
          hover:shadow-lg transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        <FaPaperPlane size={14} />
        {submitting ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
};

export default FeedbackForm;
