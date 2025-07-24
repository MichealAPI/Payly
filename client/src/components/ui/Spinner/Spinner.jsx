import React from 'react';

const Spinner = ({ color="bg-[#BD9EFF]" }) => {
  return (
    <div className="flex space-x-2 items-center">
      <div className={`w-2 h-2 rounded-full animate-pulse ${color}`}></div>
      <div className={`w-3 h-3 rounded-full animate-pulse delay-200 ${color}`}></div>
      <div className={`w-4 h-4 rounded-full animate-pulse delay-400 ${color}`}></div>
    </div>
  );
};

export default Spinner;