import React from "react";

const DateSeparator = ({ date }) => {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    // Date is invalid, don't render anything or render a fallback
    return null;
  }

  const formattedDate = d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center" aria-hidden="true">
      <div className="w-full border-t border-slate-600" />
      <span className="flex-shrink-0 mx-4 text-sm text-slate-400">
        {formattedDate}
      </span>
      <div className="w-full border-t border-slate-600" />
    </div>
  );
};

export default DateSeparator;
